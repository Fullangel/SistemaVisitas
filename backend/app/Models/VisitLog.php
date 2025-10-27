<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VisitLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'visit_id',
        'action',
        'status_from',
        'status_to',
        'user_id',
        'notes',
        'log_date',
    ];

    protected $casts = [
        'log_date' => 'date',
    ];

    public function visit()
    {
        return $this->belongsTo(Visit::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
