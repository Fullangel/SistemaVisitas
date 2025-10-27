<?php

namespace App\Services\Implementations;

use App\Services\BaseService;
use App\Services\Contracts\EmployeeServiceInterface;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use App\Repositories\Interfaces\DepartmentRepositoryInterface;
use App\Repositories\Interfaces\HeadquarterRepositoryInterface;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class EmployeeService extends BaseService implements EmployeeServiceInterface
{
    /**
     * @var EmployeeRepositoryInterface
     */
    protected $employeeRepository;

    /**
     * @var DepartmentRepositoryInterface
     */
    protected $departmentRepository;

    /**
     * @var HeadquarterRepositoryInterface
     */
    protected $headquarterRepository;

    /**
     * Constructor
     *
     * @param EmployeeRepositoryInterface $employeeRepository
     * @param DepartmentRepositoryInterface $departmentRepository
     * @param HeadquarterRepositoryInterface $headquarterRepository
     */
    public function __construct(
        EmployeeRepositoryInterface $employeeRepository,
        DepartmentRepositoryInterface $departmentRepository,
        HeadquarterRepositoryInterface $headquarterRepository
    ) {
        $this->employeeRepository = $employeeRepository;
        $this->departmentRepository = $departmentRepository;
        $this->headquarterRepository = $headquarterRepository;
    }

    /**
     * {@inheritdoc}
     */
    public function getAllEmployees(int $perPage = 15, array $filters = []): array
    {
        try {
            $query = $this->employeeRepository->with([
                'department', 
                'headquarter', 
                'visits'
            ]);

            // Aplicar filtros
            if (!empty($filters['status'])) {
                $query->where('status', $filters['status']);
            }

            if (!empty($filters['department_id'])) {
                $query->where('department_id', $filters['department_id']);
            }

            if (!empty($filters['headquarter_id'])) {
                $query->where('headquarter_id', $filters['headquarter_id']);
            }

            if (!empty($filters['search'])) {
                $searchTerm = $filters['search'];
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('first_name', 'like', "%{$searchTerm}%")
                      ->orWhere('last_name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%")
                      ->orWhere('identification', 'like', "%{$searchTerm}%")
                      ->orWhere('employee_code', 'like', "%{$searchTerm}%");
                });
            }

            // Ordenar por nombre
            $query->orderBy('first_name')->orderBy('last_name');

            $employees = $query->paginate($perPage);

            return $this->successResponse($employees, 'Empleados obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getEmployeeById(int $id): array
    {
        try {
            $employee = $this->employeeRepository->with([
                'department', 
                'headquarter', 
                'visits', 
                'logs'
            ])->find($id);

            if (!$employee) {
                return $this->errorResponse('Empleado no encontrado', null, 404);
            }

            return $this->successResponse($employee, 'Empleado obtenido exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function createEmployee(array $data): array
    {
        try {
            DB::beginTransaction();

            // Validar datos
            $validator = Validator::make($data, [
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|max:255|unique:employees,email',
                'phone' => 'nullable|string|max:20',
                'identification' => 'required|string|max:50|unique:employees,identification',
                'employee_code' => 'nullable|string|max:50|unique:employees,employee_code',
                'department_id' => 'required|exists:departments,id',
                'headquarter_id' => 'required|exists:headquarters,id',
                'position' => 'required|string|max:255',
                'hire_date' => 'nullable|date',
                'status' => 'boolean',
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                return $this->errorResponse('Error de validación', $validator->errors(), 422);
            }

            // Verificar que el departamento existe
            $department = $this->departmentRepository->find($data['department_id']);
            if (!$department) {
                DB::rollBack();
                return $this->errorResponse('Departamento no encontrado', null, 404);
            }

            // Verificar que la sede existe
            $headquarter = $this->headquarterRepository->find($data['headquarter_id']);
            if (!$headquarter) {
                DB::rollBack();
                return $this->errorResponse('Sede no encontrada', null, 404);
            }

            // Generar código de empleado si no se proporciona
            if (empty($data['employee_code'])) {
                $data['employee_code'] = $this->generateEmployeeCode($data['first_name'], $data['last_name']);
            }

            // Establecer estado por defecto
            $data['status'] = $data['status'] ?? true;

            // Crear empleado
            $employee = $this->employeeRepository->create($data);

            // Cargar relaciones
            $employee->load(['department', 'headquarter']);

            DB::commit();

            return $this->successResponse($employee, 'Empleado creado exitosamente', 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function updateEmployee(int $id, array $data): array
    {
        try {
            DB::beginTransaction();

            $employee = $this->employeeRepository->find($id);

            if (!$employee) {
                DB::rollBack();
                return $this->errorResponse('Empleado no encontrado', null, 404);
            }

            // Validar datos
            $validator = Validator::make($data, [
                'first_name' => 'nullable|string|max:255',
                'last_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255|unique:employees,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'identification' => 'nullable|string|max:50|unique:employees,identification,' . $id,
                'employee_code' => 'nullable|string|max:50|unique:employees,employee_code,' . $id,
                'department_id' => 'nullable|exists:departments,id',
                'headquarter_id' => 'nullable|exists:headquarters,id',
                'position' => 'nullable|string|max:255',
                'hire_date' => 'nullable|date',
                'status' => 'boolean',
            ]);

            if ($validator->fails()) {
                DB::rollBack();
                return $this->errorResponse('Error de validación', $validator->errors(), 422);
            }

            // Si se cambia el departamento, verificar que existe
            if (isset($data['department_id'])) {
                $department = $this->departmentRepository->find($data['department_id']);
                if (!$department) {
                    DB::rollBack();
                    return $this->errorResponse('Departamento no encontrado', null, 404);
                }
            }

            // Si se cambia la sede, verificar que existe
            if (isset($data['headquarter_id'])) {
                $headquarter = $this->headquarterRepository->find($data['headquarter_id']);
                if (!$headquarter) {
                    DB::rollBack();
                    return $this->errorResponse('Sede no encontrada', null, 404);
                }
            }

            // Actualizar empleado
            $updatedEmployee = $this->employeeRepository->update($id, $data);

            // Cargar relaciones
            $updatedEmployee->load(['department', 'headquarter']);

            DB::commit();

            return $this->successResponse($updatedEmployee, 'Empleado actualizado exitosamente');
        } catch (\Exception $e) {
            DB::rollBack();
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function deleteEmployee(int $id): array
    {
        try {
            $employee = $this->employeeRepository->find($id);

            if (!$employee) {
                return $this->errorResponse('Empleado no encontrado', null, 404);
            }

            // Verificar si el empleado tiene visitas asociadas
            if ($employee->visits()->count() > 0) {
                return $this->errorResponse('No se puede eliminar un empleado que tiene visitas asociadas', null, 422);
            }

            $this->employeeRepository->delete($id);

            return $this->successResponse(null, 'Empleado eliminado exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function searchEmployees(string $term, int $limit = 10): array
    {
        try {
            $employees = $this->employeeRepository->with(['department', 'headquarter'])
                ->where(function ($query) use ($term) {
                    $query->where('first_name', 'like', "%{$term}%")
                          ->orWhere('last_name', 'like', "%{$term}%")
                          ->orWhere('email', 'like', "%{$term}%")
                          ->orWhere('identification', 'like', "%{$term}%")
                          ->orWhere('employee_code', 'like', "%{$term}%");
                })
                ->limit($limit)
                ->get();

            return $this->successResponse($employees, 'Empleados encontrados exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getEmployeesByDepartment(int $departmentId, int $perPage = 15): array
    {
        try {
            $department = $this->departmentRepository->find($departmentId);
            if (!$department) {
                return $this->errorResponse('Departamento no encontrado', null, 404);
            }

            $employees = $this->employeeRepository->with(['department', 'headquarter'])
                ->where('department_id', $departmentId)
                ->orderBy('first_name')
                ->orderBy('last_name')
                ->paginate($perPage);

            return $this->successResponse($employees, 'Empleados del departamento obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getEmployeesByDesignation(string $designation, int $perPage = 15): array
    {
        try {
            $employees = $this->employeeRepository->with(['department', 'headquarter'])
                ->where('position', 'like', "%{$designation}%")
                ->orderBy('first_name')
                ->orderBy('last_name')
                ->paginate($perPage);

            return $this->successResponse($employees, 'Empleados por cargo obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getActiveEmployees(int $perPage = 15): array
    {
        try {
            $employees = $this->employeeRepository->with(['department', 'headquarter'])
                ->where('status', true)
                ->orderBy('first_name')
                ->orderBy('last_name')
                ->paginate($perPage);

            return $this->successResponse($employees, 'Empleados activos obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function getInactiveEmployees(int $perPage = 15): array
    {
        try {
            $employees = $this->employeeRepository->with(['department', 'headquarter'])
                ->where('status', false)
                ->orderBy('first_name')
                ->orderBy('last_name')
                ->paginate($perPage);

            return $this->successResponse($employees, 'Empleados inactivos obtenidos exitosamente');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function checkEmployeeEmailAvailability(string $email, int $excludeId = null): array
    {
        try {
            $exists = $this->employeeRepository->emailExists($email, $excludeId);
            
            return $this->successResponse([
                'available' => !$exists,
                'email' => $email
            ], 'Disponibilidad de email verificada');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * {@inheritdoc}
     */
    public function checkEmployeeIdentificationAvailability(string $identification, int $excludeId = null): array
    {
        try {
            $exists = $this->employeeRepository->identificationExists($identification, $excludeId);
            
            return $this->successResponse([
                'available' => !$exists,
                'identification' => $identification
            ], 'Disponibilidad de identificación verificada');
        } catch (\Exception $e) {
            return $this->handleException($e);
        }
    }

    /**
     * Generar código único de empleado
     *
     * @param string $firstName
     * @param string $lastName
     * @return string
     */
    private function generateEmployeeCode(string $firstName, string $lastName): string
    {
        $initials = strtoupper(substr($firstName, 0, 1) . substr($lastName, 0, 1));
        $date = now()->format('Ym');
        $random = strtoupper(substr(md5(uniqid(rand(), true)), 0, 4));
        
        return "EMP-{$initials}-{$date}-{$random}";
    }
}