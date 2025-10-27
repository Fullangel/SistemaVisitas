<?php

namespace App\Services;

use App\Models\User;
use App\Models\TwoFactorCode;
use App\Models\TrustedDevice;
use App\Models\AuthenticationLog;
use PragmaRX\Google2FA\Google2FA;
use BaconQrCode\Renderer\ImageRenderer;
use BaconQrCode\Renderer\Image\ImagickImageBackEnd;
use BaconQrCode\Renderer\RendererStyle\RendererStyle;
use BaconQrCode\Writer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class TwoFactorService
{
    protected Google2FA $google2fa;

    public function __construct()
    {
        $this->google2fa = new Google2FA();
    }

    /**
     * Generar secreto para 2FA
     */
    public function generateSecret(): string
    {
        return $this->google2fa->generateSecretKey();
    }

    /**
     * Generar QR Code para autenticador
     */
    public function generateQrCodeUrl(User $user, string $secret): string
    {
        $companyName = config('app.name', 'Sistema de Visitas');
        $email = $user->email;
        
        return $this->google2fa->getQRCodeUrl(
            $companyName,
            $email,
            $secret
        );
    }

    /**
     * Generar imagen QR Code
     */
    public function generateQrCodeImage(string $url): string
    {
        $renderer = new ImageRenderer(
            new RendererStyle(400),
            new ImagickImageBackEnd()
        );
        $writer = new Writer($renderer);
        
        return base64_encode($writer->writeString($url));
    }

    /**
     * Verificar código TOTP
     */
    public function verifyCode(string $secret, string $code): bool
    {
        return $this->google2fa->verifyKey($secret, $code);
    }

    /**
     * Generar código de verificación temporal
     */
    public function generateVerificationCode(User $user, string $type = 'email', int $length = 6): TwoFactorCode
    {
        // Limpiar códigos anteriores del mismo tipo
        $this->cleanupUserCodes($user, $type);

        $code = $this->generateNumericCode($length);
        $expiresAt = now()->addMinutes(15);

        return $user->twoFactorCodes()->create([
            'code' => Hash::make($code),
            'type' => $type,
            'expires_at' => $expiresAt,
            'used' => false,
            'attempts' => 0,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ]);
    }

    /**
     * Generar código numérico
     */
    private function generateNumericCode(int $length = 6): string
    {
        $min = pow(10, $length - 1);
        $max = pow(10, $length) - 1;
        return strval(random_int($min, $max));
    }

    /**
     * Verificar código de verificación
     */
    public function verifyVerificationCode(User $user, string $code, string $type = 'email'): bool
    {
        $twoFactorCode = $user->twoFactorCodes()
            ->where('type', $type)
            ->where('used', false)
            ->where('expires_at', '>', now())
            ->where('attempts', '<', 3)
            ->latest()
            ->first();

        if (!$twoFactorCode) {
            AuthenticationLog::log(
                AuthenticationLog::ACTION_2FA_FAILED,
                false,
                $user,
                ['reason' => 'No valid code found', 'type' => $type]
            );
            return false;
        }

        // Verificar el código
        if (Hash::check($code, $twoFactorCode->code)) {
            $twoFactorCode->markAsUsed();
            
            AuthenticationLog::log(
                AuthenticationLog::ACTION_2FA_SUCCESS,
                true,
                $user,
                ['type' => $type]
            );
            
            return true;
        }

        // Incrementar intentos
        $twoFactorCode->incrementAttempts();
        
        AuthenticationLog::log(
            AuthenticationLog::ACTION_2FA_FAILED,
            false,
            $user,
            ['reason' => 'Invalid code', 'type' => $type, 'attempts' => $twoFactorCode->attempts]
        );

        return false;
    }

    /**
     * Limpiar códigos antiguos del usuario
     */
    private function cleanupUserCodes(User $user, string $type = null): void
    {
        $query = $user->twoFactorCodes();
        
        if ($type) {
            $query->where('type', $type);
        }
        
        $query->where(function ($q) {
            $q->where('expires_at', '<', now())
              ->orWhere('used', true)
              ->orWhere('attempts', '>=', 3);
        })->delete();
    }

    /**
     * Verificar dispositivo confiable
     */
    public function isTrustedDevice(User $user, string $fingerprint): bool
    {
        return $user->trustedDevices()
            ->where('device_fingerprint', $fingerprint)
            ->where('is_trusted', true)
            ->where('last_used_at', '>', now()->subDays(30))
            ->exists();
    }

    /**
     * Agregar dispositivo confiable
     */
    public function addTrustedDevice(User $user, string $name, string $fingerprint, string $ipAddress, string $userAgent): TrustedDevice
    {
        // Limpiar dispositivos antiguos
        $this->cleanupOldDevices($user);

        return $user->trustedDevices()->updateOrCreate(
            ['device_fingerprint' => $fingerprint],
            [
                'device_name' => $name,
                'ip_address' => $ipAddress,
                'user_agent' => $userAgent,
                'last_used_at' => now(),
                'is_trusted' => true,
            ]
        );
    }

    /**
     * Limpiar dispositivos antiguos
     */
    private function cleanupOldDevices(User $user): void
    {
        $user->trustedDevices()
            ->where('last_used_at', '<', now()->subDays(90))
            ->delete();
    }

    /**
     * Generar códigos de recuperación
     */
    public function generateRecoveryCodes(User $user): array
    {
        $codes = [];
        for ($i = 0; $i < 8; $i++) {
            $codes[] = strtoupper(bin2hex(random_bytes(4)));
        }

        $user->update([
            'two_factor_recovery_codes' => encrypt(json_encode($codes)),
        ]);

        return $codes;
    }

    /**
     * Verificar código de recuperación
     */
    public function validateRecoveryCode(User $user, string $code): bool
    {
        return $user->validateRecoveryCode($code);
    }

    /**
     * Enviar código por SMS (simulado)
     */
    public function sendSmsCode(User $user, string $code): bool
    {
        // Implementar integración con servicio SMS
        \Log::info("Código SMS enviado a {$user->phone}: $code");
        return true;
    }

    /**
     * Enviar código por email
     */
    public function sendEmailCode(User $user, string $code): bool
    {
        try {
            \Mail::raw("Tu código de verificación es: $code", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Código de verificación - ' . config('app.name'));
            });
            return true;
        } catch (\Exception $e) {
            \Log::error('Error al enviar código 2FA por email: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Verificar si el usuario necesita 2FA
     */
    public function requiresTwoFactor(User $user): bool
    {
        // COMPLETAMENTE DESACTIVADO PARA DESARROLLO
        if (!config('app.enable_2fa', false)) {
            return false;
        }

        if (!$user->hasTwoFactorEnabled()) {
            return false;
        }

        // Verificar dispositivo confiable
        $fingerprint = TrustedDevice::generateFingerprint(
            request()->userAgent(),
            request()->ip()
        );

        if ($this->isTrustedDevice($user, $fingerprint)) {
            return false;
        }

        return true;
    }

    /**
     * Limpiar códigos antiguos
     */
    public function cleanup(): void
    {
        TwoFactorCode::cleanup();
        TrustedDevice::cleanup();
        AuthenticationLog::cleanup();
    }

    /**
     * Obtener estadísticas de 2FA
     */
    public function getStats(User $user): array
    {
        return [
            'total_codes_sent' => $user->twoFactorCodes()->count(),
            'active_codes' => $user->twoFactorCodes()->valid()->count(),
            'trusted_devices' => $user->trustedDevices()->trusted()->count(),
            'recent_login_attempts' => $user->authenticationLogs()
                ->recent(60)
                ->count(),
            'failed_login_attempts' => $user->authenticationLogs()
                ->recent(60)
                ->failed()
                ->count(),
        ];
    }
}