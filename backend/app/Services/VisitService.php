<?php

namespace App\Services;

use App\Repositories\Interfaces\VisitRepositoryInterface;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VisitService extends BaseService
{
    protected $visitRepository;
    protected $employeeRepository;

    public function __construct(
        VisitRepositoryInterface $visitRepository,
        EmployeeRepositoryInterface $employeeRepository
    ) {
        $this->visitRepository = $visitRepository;
        $this->employeeRepository = $employeeRepository;
    }

    /**
     * Programar una nueva visita
     *
     * @param array $data
     * @return array
     */
    public function scheduleVisit(array $data)
    {
        try {
            DB::beginTransaction();

            // Validar que el empleado existe y está activo
            $employee = $this->employeeRepository->find($data['employee_id']);
            if (!$employee || $employee->status !== 'active') {
                return $this->errorResponse('El empleado no existe o no está activo');
            }

            // Validar límite diario de visitas
            $visitLimit = config('app.max_daily_visits', 10);
            $todayVisits = $this->visitRepository->getByDate(Carbon::today());
            
            if ($todayVisits->count() >= $visitLimit) {
                return $this->errorResponse('Se ha alcanzado el límite diario de visitas');
            }

            // Crear la visita
            $visit = $this->visitRepository->create([
                'employee_id' => $data['employee_id'],
                'visitor_name' => $data['visitor_name'],
                'visitor_email' => $data['visitor_email'] ?? null,
                'visitor_phone' => $data['visitor_phone'] ?? null,
                'visitor_company' => $data['visitor_company'] ?? null,
                'visit_date' => $data['visit_date'],
                'visit_time' => $data['visit_time'],
                'purpose' => $data['purpose'],
                'status' => 'scheduled',
                'notes' => $data['notes'] ?? null,
                'created_by' => auth()->id()
            ]);

            DB::commit();

            Log::info('Visita programada exitosamente', [
                'visit_id' => $visit->id,
                'employee_id' => $data['employee_id'],
                'visitor_name' => $data['visitor_name']
            ]);

            return $this->successResponse($visit, 'Visita programada exitosamente');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al programar visita', [
                'error' => $e->getMessage(),
                'data' => $data
            ]);
            return $this->handleException($e);
        }
    }

    /**
     * Completar una visita
     *
     * @param int $visitId
     * @param array $data
     * @return array
     */
    public function completeVisit($visitId, array $data)
    {
        try {
            $visit = $this->visitRepository->find($visitId);
            
            if (!$visit) {
                return $this->errorResponse('Visita no encontrada');
            }

            if ($visit->status !== 'scheduled') {
                return $this->errorResponse('Solo se pueden completar visitas programadas');
            }

            $updatedVisit = $this->visitRepository->updateStatus($visitId, 'completed', [
                'completion_notes' => $data['completion_notes'] ?? null,
                'completed_at' => Carbon::now()
            ]);

            Log::info('Visita completada', [
                'visit_id' => $visitId,
                'completed_by' => auth()->id()
            ]);

            return $this->successResponse($updatedVisit, 'Visita completada exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al completar visita', [
                'visit_id' => $visitId,
                'error' => $e->getMessage()
            ]);
            return $this->handleException($e);
        }
    }

    /**
     * Cancelar una visita
     *
     * @param int $visitId
     * @param string $reason
     * @return array
     */
    public function cancelVisit($visitId, $reason)
    {
        try {
            $visit = $this->visitRepository->find($visitId);
            
            if (!$visit) {
                return $this->errorResponse('Visita no encontrada');
            }

            if (!in_array($visit->status, ['scheduled', 'confirmed'])) {
                return $this->errorResponse('No se puede cancelar una visita en este estado');
            }

            $updatedVisit = $this->visitRepository->updateStatus($visitId, 'cancelled', [
                'cancellation_reason' => $reason,
                'cancelled_at' => Carbon::now(),
                'cancelled_by' => auth()->id()
            ]);

            Log::info('Visita cancelada', [
                'visit_id' => $visitId,
                'reason' => $reason,
                'cancelled_by' => auth()->id()
            ]);

            return $this->successResponse($updatedVisit, 'Visita cancelada exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al cancelar visita', [
                'visit_id' => $visitId,
                'error' => $e->getMessage()
            ]);
            return $this->handleException($e);
        }
    }

    /**
     * Obtener estadísticas de visitas
     *
     * @param \DateTime|null $startDate
     * @param \DateTime|null $endDate
     * @return array
     */
    public function getVisitStatistics($startDate = null, $endDate = null)
    {
        try {
            $stats = $this->visitRepository->getStatisticsByDate($startDate, $endDate);

            return $this->successResponse($stats, 'Estadísticas obtenidas exitosamente');

        } catch (\Exception $e) {
            Log::error('Error al obtener estadísticas de visitas', [
                'error' => $e->getMessage()
            ]);
            return $this->handleException($e);
        }
    }

    /**
     * Obtener visitas próximas a vencer
     *
     * @param int $minutes
     * @return array
     */
    public function getExpiringVisits($minutes = 30)
    {
        try {
            $visits = $this->visitRepository->getExpiringVisits($minutes);

            return $this->successResponse($visits, 'Visitas próximas a vencer obtenidas');

        } catch (\Exception $e) {
            Log::error('Error al obtener visitas próximas a vencer', [
                'error' => $e->getMessage()
            ]);
            return $this->handleException($e);
        }
    }
}