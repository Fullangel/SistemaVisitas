<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class VisitArchive extends Model
{
    use SoftDeletes;

    protected $table = 'visit_partitions';

    protected $fillable = [
        'visit_code',
        'purpose',
        'description',
        'visit_date',
        'entry_time',
        'exit_time',
        'status',
        'priority',
        'visitor_name',
        'visitor_email',
        'visitor_phone',
        'visitor_identification',
        'visitor_company',
        'employee_id',
        'department_id',
        'headquarter_id',
        'created_by',
        'approved_by',
        'approved_at',
        'rejection_reason',
        'has_vehicle',
        'vehicle_plate',
        'vehicle_model',
        'vehicle_color',
    ];

    protected $casts = [
        'visit_date' => 'date',
        'entry_time' => 'datetime:H:i',
        'exit_time' => 'datetime:H:i',
        'approved_at' => 'datetime',
        'has_vehicle' => 'boolean',
    ];

    protected $dates = ['deleted_at'];

    /**
     * Obtener las visitas archivadas por rango de fechas
     */
    public function scopeByDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('visit_date', [$startDate, $endDate]);
    }

    /**
     * Obtener visitas archivadas por estado
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Obtener visitas archivadas por empleado
     */
    public function scopeByEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Obtener visitas archivadas por departamento
     */
    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    /**
     * Obtener visitas archivadas por sede
     */
    public function scopeByHeadquarter($query, $headquarterId)
    {
        return $query->where('headquarter_id', $headquarterId);
    }

    /**
     * Obtener estadísticas de visitas archivadas por mes
     */
    public static function getMonthlyStats($year = null)
    {
        $year = $year ?? now()->year;
        
        return self::selectRaw('
                MONTH(visit_date) as month,
                COUNT(*) as total_visits,
                COUNT(CASE WHEN status = "completed" THEN 1 END) as completed_visits,
                COUNT(CASE WHEN status = "cancelled" THEN 1 END) as cancelled_visits,
                COUNT(CASE WHEN status = "pending" THEN 1 END) as pending_visits
            ')
            ->whereYear('visit_date', $year)
            ->groupBy('month')
            ->orderBy('month')
            ->get();
    }

    /**
     * Obtener estadísticas de visitas archivadas por año
     */
    public static function getYearlyStats()
    {
        return self::selectRaw('
                YEAR(visit_date) as year,
                COUNT(*) as total_visits,
                COUNT(CASE WHEN status = "completed" THEN 1 END) as completed_visits,
                COUNT(CASE WHEN status = "cancelled" THEN 1 END) as cancelled_visits
            ')
            ->groupBy('year')
            ->orderBy('year', 'desc')
            ->get();
    }
}