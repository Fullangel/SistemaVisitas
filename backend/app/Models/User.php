<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Illuminate\Support\Facades\Hash;
use App\Traits\LogsActivity;

class User extends Authenticatable implements JWTSubject
{
    use HasFactory, Notifiable, LogsActivity;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'username',
        'password',
        'status',
        'phone',
        'address',
        'last_login_at',
        'telegram_id',
        'role_id',
        'email_verified_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'two_factor_confirmed_at' => 'datetime',
        'two_factor_enabled' => 'boolean',
        'locked_until' => 'datetime',
    ];

    /**
     * Get the role that owns the user.
     */
    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    /**
     * Get the two factor codes for the user.
     */
    public function twoFactorCodes()
    {
        return $this->hasMany(TwoFactorCode::class);
    }

    /**
     * Get the trusted devices for the user.
     */
    public function trustedDevices()
    {
        return $this->hasMany(TrustedDevice::class);
    }

    /**
     * Get the authentication logs for the user.
     */
    public function authenticationLogs()
    {
        return $this->hasMany(AuthenticationLog::class);
    }

    /**
     * Get the employee associated with the user.
     */
    public function employee()
    {
        return $this->hasOne(Employee::class, 'email', 'email');
    }

    /**
     * Get the full name attribute.
     */
    public function getFullNameAttribute()
    {
        return "{$this->first_name} {$this->last_name}";
    }

    /**
     * Get the username for authentication.
     */
    public function username()
    {
        return 'username';
    }

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     * @return mixed
     */
    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims()
    {
        return [
            'role' => $this->role ? $this->role->name : 'user',
            'role_id' => $this->role_id,
            'username' => $this->username,
            'email' => $this->email,
            'full_name' => $this->full_name,
            'status' => $this->status,
            'issued_at' => now()->toISOString(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'two_factor_enabled' => $this->two_factor_enabled,
        ];
    }

    /**
     * Verificar si el usuario tiene 2FA habilitado
     */
    public function hasTwoFactorEnabled(): bool
    {
        return $this->two_factor_enabled && $this->two_factor_confirmed_at !== null;
    }

    /**
     * Verificar si el usuario está bloqueado
     */
    public function isLocked(): bool
    {
        return $this->locked_until && $this->locked_until->isFuture();
    }

    /**
     * Desbloquear cuenta
     */
    public function unlock(): void
    {
        $this->update([
            'locked_until' => null,
            'failed_login_attempts' => 0,
        ]);
    }

    /**
     * Incrementar intentos fallidos
     */
    public function incrementFailedAttempts(): void
    {
        $attempts = $this->failed_login_attempts + 1;
        $lockoutTime = null;

        // Bloquear cuenta después de 5 intentos fallidos
        if ($attempts >= 5) {
            $lockoutTime = now()->addMinutes(15);
        }

        $this->update([
            'failed_login_attempts' => $attempts,
            'locked_until' => $lockoutTime,
        ]);
    }

    /**
     * Resetear intentos fallidos
     */
    public function resetFailedAttempts(): void
    {
        $this->update([
            'failed_login_attempts' => 0,
            'locked_until' => null,
        ]);
    }

    /**
     * Generar códigos de recuperación
     */
    public function generateRecoveryCodes(): array
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = bin2hex(random_bytes(4));
        }

        $this->update([
            'two_factor_recovery_codes' => encrypt(json_encode($codes)),
        ]);

        return $codes;
    }

    /**
     * Obtener códigos de recuperación desencriptados
     */
    public function getRecoveryCodes(): array
    {
        if (!$this->two_factor_recovery_codes) {
            return [];
        }

        try {
            return json_decode(decrypt($this->two_factor_recovery_codes), true) ?? [];
        } catch (\Exception $e) {
            return [];
        }
    }

    /**
     * Verificar código de recuperación
     */
    public function validateRecoveryCode(string $code): bool
    {
        $codes = $this->getRecoveryCodes();
        
        if (in_array($code, $codes)) {
            // Eliminar el código usado
            $codes = array_diff($codes, [$code]);
            $this->update([
                'two_factor_recovery_codes' => encrypt(json_encode(array_values($codes))),
            ]);
            return true;
        }

        return false;
    }

    /**
     * Verificar dispositivo confiable
     */
    public function isTrustedDevice(string $fingerprint): bool
    {
        return $this->trustedDevices()
            ->where('device_fingerprint', $fingerprint)
            ->where('is_trusted', true)
            ->where('last_used_at', '>', now()->subDays(30))
            ->exists();
    }

    /**
     * Agregar dispositivo confiable
     */
    public function addTrustedDevice(string $name, string $fingerprint, string $ipAddress, string $userAgent): TrustedDevice
    {
        return $this->trustedDevices()->create([
            'device_name' => $name,
            'device_fingerprint' => $fingerprint,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'last_used_at' => now(),
            'is_trusted' => true,
        ]);
    }

    /**
     * Deshabilitar 2FA
     */
    public function disableTwoFactor(): void
    {
        $this->update([
            'two_factor_enabled' => false,
            'two_factor_confirmed_at' => null,
            'two_factor_secret' => null,
            'two_factor_recovery_codes' => null,
            'two_factor_method' => null,
        ]);
    }

    /**
     * Habilitar 2FA
     */
    public function enableTwoFactor(string $method = 'app'): void
    {
        $this->update([
            'two_factor_enabled' => true,
            'two_factor_method' => $method,
        ]);
    }

    /**
     * Confirmar 2FA
     */
    public function confirmTwoFactor(): void
    {
        $this->update([
            'two_factor_confirmed_at' => now(),
        ]);
    }

    /**
     * Verificar contraseña actual
     */
    public function verifyPassword(string $password): bool
    {
        return Hash::check($password, $this->password);
    }

    /**
     * Actualizar último login
     */
    public function updateLastLogin(): void
    {
        $this->update([
            'last_login_at' => now(),
            'last_login_ip' => request()->ip(),
        ]);
    }
}