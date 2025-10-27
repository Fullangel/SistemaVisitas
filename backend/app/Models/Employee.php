<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Traits\LogsActivity;

class Employee extends Model
{
    use HasFactory, LogsActivity;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'phone',
        'identification',
        'employee_code',
        'department_id',
        'designation_id',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    public function department()
    {
        return $this->belongsTo(Department::class);
    }

    public function designation()
    {
        return $this->belongsTo(Designation::class);
    }

    public function user()
    {
        return $this->hasOne(User::class);
    }

    public function visits()
    {
        return $this->hasMany(Visit::class);
    }

    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
