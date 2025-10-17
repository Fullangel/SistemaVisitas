<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    use HasFactory;

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
}
