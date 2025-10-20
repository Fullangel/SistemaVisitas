<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Department extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'code',
        'headquarter_id',
    ];

    public function headquarter()
    {
        return $this->belongsTo(Headquarter::class);
    }

    public function employees()
    {
        return $this->hasMany(Employee::class);
    }

    public function visits()
    {
        return $this->hasMany(Visit::class);
    }
}
