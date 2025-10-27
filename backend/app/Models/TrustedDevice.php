<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TrustedDevice extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'device_name',
        'device_fingerprint',
        'ip_address',
        'user_agent',
        'last_used_at',
        'is_trusted',
    ];

    protected $casts = [
        'last_used_at' => 'datetime',
        'is_trusted' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generar fingerprint del dispositivo
     */
    public static function generateFingerprint(string $userAgent, string $ipAddress): string
    {
        $data = $userAgent . '|' . $ipAddress;
        return hash('sha256', $data);
    }

    /**
     * Verificar si el dispositivo es confiable
     */
    public function isStillTrusted(): bool
    {
        return $this->is_trusted && $this->last_used_at->gt(now()->subDays(30));
    }

    /**
     * Actualizar último uso
     */
    public function updateLastUsed(): void
    {
        $this->update(['last_used_at' => now()]);
    }

    /**
     * Revocar confianza del dispositivo
     */
    public function revoke(): void
    {
        $this->update(['is_trusted' => false]);
    }

    /**
     * Scope para dispositivos confiables
     */
    public function scopeTrusted($query)
    {
        return $query->where('is_trusted', true);
    }

    /**
     * Scope para dispositivos activos recientemente
     */
    public function scopeRecentlyUsed($query, $days = 30)
    {
        return $query->where('last_used_at', '>', now()->subDays($days));
    }

    /**
     * Limpiar dispositivos antiguos no utilizados
     */
    public static function cleanup(): void
    {
        self::where('last_used_at', '<', now()->subDays(90))
            ->orWhere('is_trusted', false)
            ->delete();
    }
}