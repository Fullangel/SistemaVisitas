<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TwoFactorCode extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'code',
        'type',
        'expires_at',
        'used',
        'attempts',
        'ip_address',
        'user_agent',
    ];

    protected $casts = [
        'expires_at' => 'datetime',
        'used' => 'boolean',
        'attempts' => 'integer',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Verificar si el código ha expirado
     */
    public function hasExpired(): bool
    {
        return $this->expires_at->isPast();
    }

    /**
     * Verificar si el código es válido
     */
    public function isValid(): bool
    {
        return !$this->used && !$this->hasExpired() && $this->attempts < 3;
    }

    /**
     * Marcar código como usado
     */
    public function markAsUsed(): void
    {
        $this->update(['used' => true]);
    }

    /**
     * Incrementar intentos
     */
    public function incrementAttempts(): void
    {
        $this->increment('attempts');
    }

    /**
     * Scope para códigos no expirados
     */
    public function scopeNotExpired($query)
    {
        return $query->where('expires_at', '>', now());
    }

    /**
     * Scope para códigos no usados
     */
    public function scopeNotUsed($query)
    {
        return $query->where('used', false);
    }

    /**
     * Scope para códigos válidos
     */
    public function scopeValid($query)
    {
        return $query->notExpired()->notUsed()->where('attempts', '<', 3);
    }

    /**
     * Limpiar códigos antiguos
     */
    public static function cleanup(): void
    {
        self::where('expires_at', '<', now()->subDay())
            ->orWhere('used', true)
            ->orWhere('attempts', '>=', 3)
            ->delete();
    }
}