<?php

namespace App\Services\Implementations;

use App\Services\BaseService;
use App\Services\Contracts\VisitServiceInterface;
use App\Repositories\Interfaces\VisitRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class VisitService extends BaseService implements VisitServiceInterface
{
    /**
     * @var VisitRepositoryInterface
     */
    protected $visitRepository;

    /**
     * @var UserRepositoryInterface
     */
    protected $userRepository;

    /**
     * @var EmployeeRepositoryInterface
     */
    protected $employeeRepository;

    /**
     * Constructor
     *
     * @param VisitRepositoryInterface $visitRepository
     * @param UserRepositoryInterface $userRepository
     * @param EmployeeRepositoryInterface $employeeRepository
     */
    public function __construct(
        VisitRepositoryInterface $visitRepository,
        UserRepositoryInterface $userRepository,
        EmployeeRepositoryInterface $employeeRepository
    ) {
        $this->visitRepository = $visitRepository;
        $this->userRepository = $userRepository;
        $this->employeeRepository = $employeeRepository;
    }

    /**
     * {@inheritdoc}
     */
    public function getAllVisits(int $perPage = 15, array $filters = []): array
    {
        try {
            $query = $this->visitRepository->with([
                'employee', 
                'department', 
                'headquarter', 
                'creator', 
                'approver'
            ]);

            // Aplicar filtros
            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['employee_id'])) {
                $query->where('employee_id', $filters['employee_id']);
            }

            if (!empty($filters['department_id'])) {
                $query->where('department_id', $filters['department_id']);
            }

            if (!empty($filters['headquarter_id'])) {
                $query->where('headquarter_id', $filters['headquarter_id']);
            }

            if (!empty($filters['date_from'])) {
                $query->where('visit_date', '>=', $filters['date_from']);
            }

            if (!empty($filters['date_to'])) {
                $query->where('visit_date', '<=', $filters['date_to']);
            }

            if (!empty($filters['search'])) {
                $searchTerm = $filters['search'];
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('visit_code', 'like', "%{$searchTerm}%")
                      ->orWhere('purpose', 'like', "%{$searchTerm}%")
                      ->orWhere('visitor_name', 'like', "%{$searchTerm}%")
                      ->orWhere('visitor_email', 'like', "%{$searchTerm}%");
                });
            }

            // Ordenar por fecha de visita descendente
            $query->orderBy('visit_date', 'desc');

            $visits = $query->paginate($perPage);

            return $this->successResponse($visits, 'Visitas obtenidas exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getVisitById(int $id): array
    {
        try {
            $visit = $this->visitRepository->with([
                'employee', 
                'department', 
                'headquarter', 
                'creator', 
                'approver', 
                'logs', 
                'attachments'
            ])->find($id);

            if (!$visit) {
                return $this->errorResponse('Visita no encontrada', null, 404);
            }

            return $this->successResponse($visit, 'Visita obtenida exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function createVisit(array $data): array
    {
        try {
            DB::beginTransaction();

            // Validar datos
            $validator = Validator::make($data, [
                'purpose' => 'required|string|max:255',
                'description' => 'nullable|string',
                'visit_date' => 'required|date|after_or_equal:today',
                'entry_time' => 'required|date_format:H:i',
                'exit_time' => 'nullable|date_format:H:i|after:entry_time',
                'visitor_name' => 'required|string|max:255',
                'visitor_email' => 'required|email|max:255',
                'visitor_phone' => 'required|string|max:20',
                'visitor_identification' => 'required|string|max:50',
                'visitor_company' => 'nullable|string|max:255',
                'employee_id' => 'required|exists:employees,id',
                'department_id' => 'required|exists:departments,id',
                'headquarter_id' => 'required|exists:headquarters,id',
                'priority' => 'required|in:low,normal,high,urgent',
                'has_vehicle' => 'boolean',
                'vehicle_plate' => 'nullable|string|max:20|required_if:has_vehicle,true',
                'vehicle_model' => 'nullable|string|max:100|required_if:has_vehicle,true',
                'vehicle_color' => 'nullable|string|max:50|required_if:has_vehicle,true',
                'created_by' => 'required|exists:users,id',
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                return $this->errorResponse('Error de validación', $validator->errors(), 422);
            }

            // Verificar que el empleado existe y está activo
            $employee = $this->employeeRepository->find($data['employee_id']);
            if (!$employee || !$employee->status) {
                DB::rollBack();
                return $this->errorResponse('El empleado no existe o está inactivo', null, 422);
            }

            // Generar código único de visita
            $visitCode = $this->generateVisitCode();

            // Crear visita
            $visitData = array_merge($data, [
                'visit_code' => $visitCode,
                'status' => 'pending',
                'approved_at' => null,
                'approved_by' => null,
                'rejection_reason' => null,
            ]);

            $visit = $this->visitRepository->create($visitData);

            // Cargar relaciones
            $visit->load(['employee', 'department', 'headquarter', 'creator']);

            DB::commit();

            return $this->successResponse($visit, 'Visita creada exitosamente', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function updateVisit(int $id, array $data): array
    {
        try {
            DB::beginTransaction();

            $visit = $this->visitRepository->find($id);

            if (!$visit) {
                DB::rollBack();
                return $this->errorResponse('Visita no encontrada', null, 404);
            }

            // No se pueden actualizar visitas aprobadas o rechazadas
            if (in_array($visit->status, ['approved', 'rejected'])) {
                DB::rollBack();
                return $this->errorResponse('No se puede actualizar una visita aprobada o rechazada', null, 422);
            }

            // Validar datos
            $validator = Validator::make($data, [
                'purpose' => 'nullable|string|max:255',
                'description' => 'nullable|string',
                'visit_date' => 'nullable|date|after_or_equal:today',
                'entry_time' => 'nullable|date_format:H:i',
                'exit_time' => 'nullable|date_format:H:i|after:entry_time',
                'visitor_name' => 'nullable|string|max:255',
                'visitor_email' => 'nullable|email|max:255',
                'visitor_phone' => 'nullable|string|max:20',
                'visitor_identification' => 'nullable|string|max:50',
                'visitor_company' => 'nullable|string|max:255',
                'employee_id' => 'nullable|exists:employees,id',
                'department_id' => 'nullable|exists:departments,id',
                'headquarter_id' => 'nullable|exists:headquarters,id',
                'priority' => 'nullable|in:low,normal,high,urgent',
                'has_vehicle' => 'boolean',
                'vehicle_plate' => 'nullable|string|max:20',
                'vehicle_model' => 'nullable|string|max:100',
                'vehicle_color' => 'nullable|string|max:50',
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                return $this->errorResponse('Error de validación', $validator->errors(), 422);
            }

            // Si se cambia el empleado, verificar que existe y está activo
            if (isset($data['employee_id'])) {
                $employee = $this->employeeRepository->find($data['employee_id']);
                if (!$employee || !$employee->status) {
                    DB::rollBack();
                    return $this->errorResponse('El empleado no existe o está inactivo', null, 422);
                }
            }

            // Actualizar visita
            $updatedVisit = $this->visitRepository->update($id, $data);

            // Cargar relaciones
            $updatedVisit->load(['employee', 'department', 'headquarter', 'creator']);

            DB::commit();

            return $this->successResponse($updatedVisit, 'Visita actualizada exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function deleteVisit(int $id): array
    {
        try {
            $visit = $this->visitRepository->find($id);

            if (!$visit) {
                return $this->errorResponse('Visita no encontrada', null, 404);
            }

            // No se pueden eliminar visitas aprobadas o rechazadas
            if (in_array($visit->status, ['approved', 'rejected'])) {
                return $this->errorResponse('No se puede eliminar una visita aprobada o rechazada', null, 422);
            }

            $this->visitRepository->delete($id);

            return $this->successResponse(null, 'Visita eliminada exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function approveVisit(int $id, int $approvedBy): array
    {
        try {
            DB::beginTransaction();

            $visit = $this->visitRepository->find($id);

            if (!$visit) {
                DB::rollBack();
                return $this->errorResponse('Visita no encontrada', null, 404);
            }

            if ($visit->status !== 'pending') {
                DB::rollBack();
                return $this->errorResponse('Solo se pueden aprobar visitas pendientes', null, 422);
            }

            // Verificar que el usuario que aprueba existe
            $approver = $this->userRepository->find($approvedBy);
            if (!$approver) {
                DB::rollBack();
                return $this->errorResponse('Usuario que aprueba no encontrado', null, 404);
            }

            // Actualizar visita
            $updatedVisit = $this->visitRepository->update($id, [
                'status' => 'approved',
                'approved_by' => $approvedBy,
                'approved_at' => now(),
            ]);

            // Cargar relaciones
            $updatedVisit->load(['employee', 'department', 'headquarter', 'creator', 'approver']);

            DB::commit();

            return $this->successResponse($updatedVisit, 'Visita aprobada exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function rejectVisit(int $id, string $reason, int $rejectedBy): array
    {
        try {
            DB::beginTransaction();

            $visit = $this->visitRepository->find($id);

            if (!$visit) {
                DB::rollBack();
                return $this->errorResponse('Visita no encontrada', null, 404);
            }

            if ($visit->status !== 'pending') {
                DB::rollBack();
                return $this->errorResponse('Solo se pueden rechazar visitas pendientes', null, 422);
            }

            if (empty(trim($reason))) {
                DB::rollBack();
                return $this->errorResponse('El motivo del rechazo es requerido', null, 422);
            }

            // Verificar que el usuario que rechaza existe
            $rejector = $this->userRepository->find($rejectedBy);
            if (!$rejector) {
                DB::rollBack();
                return $this->errorResponse('Usuario que rechaza no encontrado', null, 404);
            }

            // Actualizar visita
            $updatedVisit = $this->visitRepository->update($id, [
                'status' => 'rejected',
                'rejection_reason' => $reason,
                'approved_by' => $rejectedBy,
                'approved_at' => now(),
            ]);

            // Cargar relaciones
            $updatedVisit->load(['employee', 'department', 'headquarter', 'creator', 'approver']);

            DB::commit();

            return $this->successResponse($updatedVisit, 'Visita rechazada exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function searchVisits(string $term, int $limit = 10): array
    {
        try {
            $visits = $this->visitRepository->with(['employee', 'department', 'headquarter'])
                ->where(function ($query) use ($term) {
                    $query->where('visit_code', 'like', "%{$term}%")
                          ->orWhere('purpose', 'like', "%{$term}%")
                          ->orWhere('visitor_name', 'like', "%{$term}%")
                          ->orWhere('visitor_email', 'like', "%{$term}%");
                })
                ->limit($limit)
                ->get();

            return $this->successResponse($visits, 'Visitas encontradas exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getVisitsByStatus(string $status, int $perPage = 15): array
    {
        try {
            $visits = $this->visitRepository->with(['employee', 'department', 'headquarter'])
                ->where('status', $status)
                ->orderBy('visit_date', 'desc')
                ->paginate($perPage);

            return $this->successResponse($visits, 'Visitas obtenidas exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getVisitsByEmployee(int $employeeId, int $perPage = 15): array
    {
        try {
            $employee = $this->employeeRepository->find($employeeId);
            if (!$employee) {
                return $this->errorResponse('Empleado no encontrado', null, 404);
            }

            $visits = $this->visitRepository->with(['employee', 'department', 'headquarter'])
                ->where('employee_id', $employeeId)
                ->orderBy('visit_date', 'desc')
                ->paginate($perPage);

            return $this->successResponse($visits, 'Visitas del empleado obtenidas exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getVisitsByDateRange(string $startDate, string $endDate, int $perPage = 15): array
    {
        try {
            $visits = $this->visitRepository->with(['employee', 'department', 'headquarter'])
                ->whereBetween('visit_date', [$startDate, $endDate])
                ->orderBy('visit_date', 'desc')
                ->paginate($perPage);

            return $this->successResponse($visits, 'Visitas del rango de fechas obtenidas exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getVisitStatistics(array $filters = []): array
    {
        try {
            $query = $this->visitRepository->with(['employee', 'department', 'headquarter']);

            // Aplicar filtros
            if (!empty($filters['date_from'])) {
                $query->where('visit_date', '>=', $filters['date_from']);
            }

            if (!empty($filters['date_to'])) {
                $query->where('visit_date', '<=', $filters['date_to']);
            }

            if (!empty($filters['department_id'])) {
                $query->where('department_id', $filters['department_id']);
            }

            if (!empty($filters['headquarter_id'])) {
                $query->where('headquarter_id', $filters['headquarter_id']);
            }

            $visits = $query->get();

            $statistics = [
                'total' => $visits->count(),
                'by_status' => $visits->groupBy('status')->map->count(),
                'by_priority' => $visits->groupBy('priority')->map->count(),
                'by_department' => $visits->groupBy('department.name')->map->count(),
                'by_headquarter' => $visits->groupBy('headquarter.name')->map->count(),
                'this_month' => $visits->where('visit_date', '>=', now()->startOfMonth())->count(),
                'this_week' => $visits->where('visit_date', '>=', now()->startOfWeek())->count(),
                'today' => $visits->where('visit_date', now()->toDateString())->count(),
            ];

            return $this->successResponse($statistics, 'Estadísticas de visitas obtenidas exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Generar código único de visita
     *
     * @return string
     */
    private function generateVisitCode(): string
    {
        $prefix = 'VIS';
        $date = now()->format('Ymd');
        $random = strtoupper(substr(md5(uniqid(rand(), true)), 0, 6));
        
        return "{$prefix}-{$date}-{$random}";
    }
}