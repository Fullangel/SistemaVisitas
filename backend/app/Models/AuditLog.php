<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class AuditLog extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'audit_logs';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'action',
        'model',
        'model_id',
        'user_id',
        'user_name',
        'ip_address',
        'user_agent',
        'url',
        'changes',
        'created_at'
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'changes' => 'array',
        'created_at' => 'datetime'
    ];

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * Get the user that performed the action.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include logs for a specific model.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $model
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForModel($query, $model)
    {
        return $query->where('model', $model);
    }

    /**
     * Scope a query to only include logs for a specific action.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  string  $action
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForAction($query, $action)
    {
        return $query->where('action', $action);
    }

    /**
     * Scope a query to only include logs for a specific user.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  int  $userId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeForUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope a query to only include logs within a date range.
     *
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  \DateTime  $startDate
     * @param  \DateTime  $endDate
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithinDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('created_at', [$startDate, $endDate]);
    }
}