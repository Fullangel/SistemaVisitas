<?php

namespace App\Repositories\Eloquent;

use App\Models\Visit;
use App\Repositories\Interfaces\VisitRepositoryInterface;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Carbon\Carbon;

class VisitRepository extends BaseRepository implements VisitRepositoryInterface
{
    /**
     * VisitRepository constructor.
     *
     * @param Visit $model
     */
    public function __construct(Visit $model)
    {
        parent::__construct($model);
    }

    /**
     * Obtener visitas por fecha
     */
    public function getByDate(string $date, int $limit = 15)
    {
        return $this->model
            ->whereDate('scheduled_date', $date)
            ->orderBy('scheduled_time', 'asc')
            ->paginate($limit);
    }

    /**
     * Obtener visitas por estado
     */
    public function getByStatus(string $status, int $limit = 15)
    {
        return $this->model
            ->where('status', $status)
            ->orderBy('created_at', 'desc')
            ->paginate($limit);
    }

    /**
     * Obtener visitas de un empleado específico
     */
    public function getByEmployee(int $employeeId, int $limit = 15)
    {
        return $this->model
            ->where('employee_id', $employeeId)
            ->orderBy('scheduled_date', 'desc')
            ->orderBy('scheduled_time', 'desc')
            ->paginate($limit);
    }

    /**
     * Buscar visitas por término
     */
    public function search(string $term, int $limit = 10): Collection
    {
        return $this->model
            ->where(function ($query) use ($term) {
                $query->where('visitor_name', 'like', "%{$term}%")
                      ->orWhere('visitor_dni', 'like', "%{$term}%")
                      ->orWhere('purpose', 'like', "%{$term}%")
                      ->orWhere('company', 'like', "%{$term}%");
            })
            ->limit($limit)
            ->get();
    }

    /**
     * Obtener visitas activas (pendientes o en progreso)
     */
    public function getActiveVisits(int $limit = 15)
    {
        return $this->model
            ->whereIn('status', ['pending', 'in_progress'])
            ->whereDate('scheduled_date', '>=', Carbon::today())
            ->orderBy('scheduled_date', 'asc')
            ->orderBy('scheduled_time', 'asc')
            ->paginate($limit);
    }

    /**
     * Obtener estadísticas de visitas por fecha
     */
    public function getStatisticsByDate(string $date): array
    {
        $visits = $this->model
            ->whereDate('scheduled_date', $date)
            ->selectRaw('
                COUNT(*) as total,
                SUM(CASE WHEN status = "pending" THEN 1 ELSE 0 END) as pending,
                SUM(CASE WHEN status = "in_progress" THEN 1 ELSE 0 END) as in_progress,
                SUM(CASE WHEN status = "completed" THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = "cancelled" THEN 1 ELSE 0 END) as cancelled
            ')
            ->first();

        return [
            'total' => $visits->total ?? 0,
            'pending' => $visits->pending ?? 0,
            'in_progress' => $visits->in_progress ?? 0,
            'completed' => $visits->completed ?? 0,
            'cancelled' => $visits->cancelled ?? 0,
        ];
    }

    /**
     * Verificar límite de visitas por día
     */
    public function hasReachedDailyLimit(string $date): bool
    {
        $maxVisits = config('app.max_visitas_por_dia', 1000);
        
        $count = $this->model
            ->whereDate('scheduled_date', $date)
            ->count();

        return $count >= $maxVisits;
    }

    /**
     * Obtener visitas próximas a vencer
     */
    public function getExpiringVisits(int $minutes = 30): Collection
    {
        $now = Carbon::now();
        $future = Carbon::now()->addMinutes($minutes);

        return $this->model
            ->where('status', 'in_progress')
            ->where('expires_at', '<=', $future)
            ->where('expires_at', '>', $now)
            ->orderBy('expires_at', 'asc')
            ->get();
    }

    /**
     * Actualizar estado de visita
     */
    public function updateStatus(int $visitId, string $status, array $additionalData = [])
    {
        $visit = $this->find($visitId);
        
        if (!$visit) {
            return false;
        }

        $updateData = array_merge(['status' => $status], $additionalData);

        // Si se completa la visita, registrar hora de finalización
        if ($status === 'completed') {
            $updateData['completed_at'] = now();
        }

        // Si se cancela, registrar hora de cancelación
        if ($status === 'cancelled') {
            $updateData['cancelled_at'] = now();
        }

        return $this->update($visitId, $updateData);
    }
}