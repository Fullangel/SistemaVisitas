<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AuthenticationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'username',
        'email',
        'action',
        'success',
        'ip_address',
        'user_agent',
        'country',
        'city',
        'latitude',
        'longitude',
        'device_fingerprint',
        'additional_data',
        'created_at',
    ];

    protected $casts = [
        'success' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8',
        'created_at' => 'datetime',
    ];

    protected $table = 'authentication_logs';

    public $timestamps = false;

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Acciones de autenticación
     */
    const ACTION_LOGIN = 'login';
    const ACTION_LOGOUT = 'logout';
    const ACTION_FAILED_LOGIN = 'failed_login';
    const ACTION_2FA_ATTEMPT = '2fa_attempt';
    const ACTION_2FA_SUCCESS = '2fa_success';
    const ACTION_2FA_FAILED = '2fa_failed';
    const ACTION_ACCOUNT_LOCKED = 'account_locked';
    const ACTION_PASSWORD_CHANGED = 'password_changed';
    const ACTION_PASSWORD_RESET_REQUEST = 'password_reset_request';
    const ACTION_PASSWORD_RESET_SUCCESS = 'password_reset_success';

    /**
     * Crear registro de autenticación
     */
    public static function log(string $action, bool $success, ?User $user = null, array $additionalData = []): self
    {
        $data = [
            'action' => $action,
            'success' => $success,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'created_at' => now(),
        ];

        if ($user) {
            $data['user_id'] = $user->id;
            $data['username'] = $user->username;
            $data['email'] = $user->email;
        }

        if (isset($additionalData['username'])) {
            $data['username'] = $additionalData['username'];
        }

        if (isset($additionalData['email'])) {
            $data['email'] = $additionalData['email'];
        }

        if (isset($additionalData['device_fingerprint'])) {
            $data['device_fingerprint'] = $additionalData['device_fingerprint'];
        }

        // Intentar obtener información geográfica
        if (isset($additionalData['country'])) {
            $data['country'] = $additionalData['country'];
            $data['city'] = $additionalData['city'] ?? null;
            $data['latitude'] = $additionalData['latitude'] ?? null;
            $data['longitude'] = $additionalData['longitude'] ?? null;
        }

        if (!empty($additionalData)) {
            $data['additional_data'] = json_encode($additionalData);
        }

        return self::create($data);
    }

    /**
     * Scope para acciones exitosas
     */
    public function scopeSuccessful($query)
    {
        return $query->where('success', true);
    }

    /**
     * Scope para acciones fallidas
     */
    public function scopeFailed($query)
    {
        return $query->where('success', false);
    }

    /**
     * Scope para acciones de login
     */
    public function scopeLoginAttempts($query)
    {
        return $query->where('action', self::ACTION_LOGIN);
    }

    /**
     * Scope para acciones de 2FA
     */
    public function scopeTwoFactorAttempts($query)
    {
        return $query->whereIn('action', [
            self::ACTION_2FA_ATTEMPT,
            self::ACTION_2FA_SUCCESS,
            self::ACTION_2FA_FAILED
        ]);
    }

    /**
     * Scope para intentos recientes
     */
    public function scopeRecent($query, $minutes = 60)
    {
        return $query->where('created_at', '>', now()->subMinutes($minutes));
    }

    /**
     * Verificar si es un intento sospechoso
     */
    public function isSuspicious(): bool
    {
        // Verificar múltiples intentos fallidos desde la misma IP
        $recentFailures = self::where('ip_address', $this->ip_address)
            ->where('action', self::ACTION_FAILED_LOGIN)
            ->where('created_at', '>', now()->subMinutes(30))
            ->count();

        return $recentFailures >= 5;
    }

    /**
     * Limpiar logs antiguos (mantener últimos 90 días)
     */
    public static function cleanup(): void
    {
        self::where('created_at', '<', now()->subDays(90))->delete();
    }
}