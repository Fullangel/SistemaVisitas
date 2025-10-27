<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;
    use App\Traits\OptimizesQueries;

class Visit extends Model
{
    use HasFactory, LogsActivity;

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

    public function employee()
    {
        return $this->belongsTo(Employee::class);
    }

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function headquarter()
    {
        return $this->belongsTo(Headquarter::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function logs()
    {
        return $this->hasMany(VisitLog::class);
    }

    public function attachments()
    {
        return $this->hasMany(VisitAttachment::class);
    }

    public function getStatusLabelAttribute()
    {
        return [
            'pending' => 'Pendiente',
            'approved' => 'Aprobada',
            'rejected' => 'Rechazada',
            'in_progress' => 'En Progreso',
            'completed' => 'Completada',
            'cancelled' => 'Cancelada',
        ][$this->status] ?? $this->status;
    }

    public function getPriorityLabelAttribute()
    {
        return [
            'low' => 'Baja',
            'normal' => 'Normal',
            'high' => 'Alta',
            'urgent' => 'Urgente',
        ][$this->priority] ?? $this->priority;
    }

    /**
     * Scope para filtrar por rango de fechas
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('visit_date', [$startDate, $endDate]);
    }
    
    /**
     * Scope para cargar relaciones comunes de forma optimizada
     */
    public function scopeWithCommonRelations($query)
    {
        return $query->with([
            'employee' => function($q) {
                $q->select('id', 'first_name', 'last_name', 'email', 'department_id');
            },
            'department' => function($q) {
                $q->select('id', 'name', 'code');
            },
            'headquarter' => function($q) {
                $q->select('id', 'name', 'code');
            },
            'creator' => function($q) {
                $q->select('id', 'first_name', 'last_name', 'email');
            }
        ]);
    }
    
    /**
     * Scope para cargar relaciones solo si se solicitan
     */
    public function scopeWithOptionalRelations($query)
    {
        return $query
            ->withIfRequested('approver', function($q) {
                $q->select('id', 'first_name', 'last_name', 'email');
            })
            ->withIfRequested('logs.user', function($q) {
                $q->select('id', 'first_name', 'last_name');
            })
            ->withIfRequested('attachments');
    }

    /**
     * Scope para filtrar por estado
     */
    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope para filtrar por empleado
     */
    public function scopeByEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope para filtrar por departamento
     */
    public function scopeByDepartment($query, $departmentId)
    {
        return $query->where('department_id', $departmentId);
    }

    /**
     * Scope para filtrar por sede
     */
    public function scopeByHeadquarter($query, $headquarterId)
    {
        return $query->where('headquarter_id', $headquarterId);
    }

    /**
     * Verificar si la visita es archivable (antigua y en estado final)
     */
    public function isArchivable($daysOld = 365)
    {
        return $this->visit_date < now()->subDays($daysOld) &&
               in_array($this->status, ['completed', 'cancelled']);
    }

    /**
     * Archivar la visita y sus relaciones
     */
    public function archive()
    {
        $archivingService = app(\App\Services\VisitArchivingService::class);
        return $archivingService->archiveSingleVisit($this);
    }
}
