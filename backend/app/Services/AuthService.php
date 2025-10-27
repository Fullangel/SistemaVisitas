<?php

namespace App\Services;

use App\Models\User;
use App\Models\AuthenticationLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthService
{
    protected TwoFactorService $twoFactorService;

    public function __construct(TwoFactorService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;
    }

    /**
     * Autenticar usuario con validación de credenciales
     */
    public function authenticate(string $username, string $password, bool $remember = false): array
    {
        // Buscar usuario por username o email
        $user = User::where('username', $username)
            ->orWhere('email', $username)
            ->first();

        if (!$user) {
            AuthenticationLog::log(
                AuthenticationLog::ACTION_FAILED_LOGIN,
                false,
                null,
                ['username' => $username]
            );
            
            return [
                'success' => false,
                'message' => 'Credenciales inválidas',
                'requires_2fa' => false,
            ];
        }

        // Verificar si la cuenta está bloqueada
        if ($user->isLocked()) {
            AuthenticationLog::log(
                AuthenticationLog::ACTION_ACCOUNT_LOCKED,
                false,
                $user,
                ['reason' => 'Account locked due to failed attempts']
            );
            
            return [
                'success' => false,
                'message' => 'Cuenta bloqueada temporalmente. Intente nuevamente en ' . $user->locked_until->diffForHumans(),
                'locked_until' => $user->locked_until,
                'requires_2fa' => false,
            ];
        }

        // Verificar contraseña
        if (!Hash::check($password, $user->password)) {
            $user->incrementFailedAttempts();
            
            AuthenticationLog::log(
                AuthenticationLog::ACTION_FAILED_LOGIN,
                false,
                $user,
                ['reason' => 'Invalid password']
            );
            
            return [
                'success' => false,
                'message' => 'Credenciales inválidas',
                'remaining_attempts' => 5 - $user->failed_login_attempts,
                'requires_2fa' => false,
            ];
        }

        // Resetear intentos fallidos
        $user->resetFailedAttempts();

        // Verificar si es un login sospechoso
        if ($this->isSuspiciousLogin($user, request())) {
            AuthenticationLog::log(
                'suspicious_login',
                true,
                $user,
                ['ip_address' => request()->ip(), 'user_agent' => request()->userAgent()]
            );
            
            // Log de login sospechoso (sin notificación por ahora)
        Log::warning('Login sospechoso detectado', [
            'user_id' => $user->id,
            'username' => $user->username,
            'email' => $user->email,
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'timestamp' => now()->toDateTimeString(),
        ]);
        }

        // Verificar si requiere 2FA (solo si está habilitado en configuración)
        // COMPLETAMENTE DESACTIVADO PARA DESARROLLO - NO REQUIERE 2FA
        if (config('app.enable_2fa', false) && $this->twoFactorService->requiresTwoFactor($user)) {
            // Generar token temporal para 2FA
            $tempToken = $this->generateTempToken($user);
            
            AuthenticationLog::log(
                AuthenticationLog::ACTION_LOGIN,
                true,
                $user,
                ['requires_2fa' => true, 'temp_token' => $tempToken]
            );
            
            return [
                'success' => true,
                'message' => 'Se requiere autenticación de dos factores',
                'requires_2fa' => true,
                'temp_token' => $tempToken,
                'user_id' => $user->id,
                'two_factor_method' => $user->two_factor_method,
            ];
        }

        // Login exitoso sin 2FA
        return $this->completeLogin($user, $remember);
    }

    /**
     * Completar login y generar JWT
     */
    private function completeLogin(User $user, bool $remember = false): array
    {
        // Actualizar último login
        $user->updateLastLogin();

        // Configurar tiempo de expiración antes de generar token
        $ttl = $remember ? 43200 : 1440; // 30 días o 1 día
        
        // Generar token JWT con TTL configurado
        $token = JWTAuth::customClaims(['exp' => now()->addMinutes($ttl)->timestamp])->fromUser($user);

        // Registrar login exitoso
        AuthenticationLog::log(
            AuthenticationLog::ACTION_LOGIN,
            true,
            $user,
            ['remember' => $remember]
        );

        return [
            'success' => true,
            'message' => 'Login exitoso',
            'requires_2fa' => false,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => JWTAuth::factory()->getTTL() * 60,
            'user' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'full_name' => $user->full_name,
                'role' => $user->role ? $user->role->name : 'user',
                'two_factor_enabled' => $user->hasTwoFactorEnabled(),
            ],
        ];
    }

    /**
     * Verificar código 2FA y completar login
     */
    public function verifyTwoFactor(string $tempToken, string $code, bool $trustDevice = false): array
    {
        // Verificar token temporal
        $userData = $this->verifyTempToken($tempToken);
        
        if (!$userData) {
            Log::error('Invalid temp token', ['temp_token' => $tempToken]);
            return [
                'success' => false,
                'message' => 'Token temporal inválido o expirado',
            ];
        }

        $user = User::find($userData['user_id']);
        
        if (!$user || !$user->hasTwoFactorEnabled()) {
            Log::error('Invalid user or 2FA not enabled', ['user_id' => $userData['user_id']]);
            return [
                'success' => false,
                'message' => 'Usuario no válido',
            ];
        }

        // Verificar código 2FA
        $isValid = false;
        
        // Debug logging
        Log::info('Verifying 2FA code', [
            'user_id' => $user->id,
            'code' => $code,
            'has_secret' => !empty($user->two_factor_secret),
            'secret_length' => strlen($user->two_factor_secret ?? ''),
        ]);
        
        // Primero intentar con código de recuperación
        if ($this->twoFactorService->validateRecoveryCode($user, $code)) {
            $isValid = true;
            Log::info('Recovery code validated successfully');
        }
        // Luego con código TOTP
        elseif ($user->two_factor_secret && $this->twoFactorService->verifyCode($user->two_factor_secret, $code)) {
            $isValid = true;
            Log::info('TOTP code validated successfully');
        }
        // Finalmente con código temporal
        else {
            $isValid = $this->twoFactorService->verifyVerificationCode($user, $code, $user->two_factor_method ?? 'email');
            Log::info('Verification code validation result', ['result' => $isValid]);
        }

        if (!$isValid) {
            Log::error('2FA verification failed', ['code' => $code]);
            return [
                'success' => false,
                'message' => 'Código de verificación inválido',
            ];
        }

        // Marcar dispositivo como confiable si se solicitó
        if ($trustDevice) {
            $fingerprint = TrustedDevice::generateFingerprint(
                request()->userAgent(),
                request()->ip()
            );
            
            $this->twoFactorService->addTrustedDevice(
                $user,
                'Dispositivo de ' . request()->ip(),
                $fingerprint,
                request()->ip(),
                request()->userAgent()
            );
        }

        // Limpiar token temporal
        $this->clearTempToken($tempToken);

        // Completar login
        return $this->completeLogin($user, $userData['remember'] ?? false);
    }

    /**
     * Generar token temporal para 2FA
     */
    private function generateTempToken(User $user): string
    {
        $token = Str::random(64);
        
        Cache::put(
            "2fa_temp_token:{$token}",
            [
                'user_id' => $user->id,
                'remember' => false,
                'created_at' => now(),
            ],
            300 // 5 minutos
        );
        
        return $token;
    }

    /**
     * Verificar token temporal
     */
    private function verifyTempToken(string $token): ?array
    {
        $data = Cache::get("2fa_temp_token:{$token}");
        Log::info('Verifying temp token', [
            'token' => $token,
            'data_found' => !empty($data),
            'data' => $data,
        ]);
        return $data;
    }

    /**
     * Limpiar token temporal
     */
    private function clearTempToken(string $token): void
    {
        Cache::forget("2fa_temp_token:{$token}");
    }

    /**
     * Cerrar sesión
     */
    public function logout(): bool
    {
        try {
            $user = Auth::user();
            
            if ($user) {
                AuthenticationLog::log(
                    AuthenticationLog::ACTION_LOGOUT,
                    true,
                    $user
                );
            }
            
            Auth::logout();
            JWTAuth::invalidate(JWTAuth::getToken());
            
            return true;
        } catch (\Exception $e) {
            Log::error('Logout failed: ' . $e->getMessage());
            return false;
        }
    }

    /**
     * Refrescar token
     */
    public function refreshToken(): array
    {
        try {
            $newToken = JWTAuth::refresh();
            $user = Auth::user();
            
            return [
                'success' => true,
                'token' => $newToken,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60,
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'full_name' => $user->full_name,
                    'role' => $user->role ? $user->role->name : 'user',
                    'two_factor_enabled' => $user->hasTwoFactorEnabled(),
                ],
            ];
        } catch (\Exception $e) {
            return [
                'success' => false,
                'message' => 'No se pudo refrescar el token',
            ];
        }
    }

    /**
     * Obtener usuario autenticado
     */
    public function getAuthenticatedUser(): ?User
    {
        return Auth::user();
    }

    /**
     * Verificar si el usuario está autenticado
     */
    public function check(): bool
    {
        return Auth::check();
    }

    /**
     * Solicitar restablecimiento de contraseña
     */
    public function requestPasswordReset(string $email): bool
    {
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            return false;
        }

        // Generar token de restablecimiento
        $token = Str::random(64);
        
        Cache::put(
            "password_reset:{$token}",
            ['user_id' => $user->id, 'created_at' => now()],
            3600 // 1 hora
        );

        AuthenticationLog::log(
            AuthenticationLog::ACTION_PASSWORD_RESET_REQUEST,
            true,
            $user
        );

        // Aquí se enviaría el email con el token
        // Por ahora solo registramos
        Log::info("Password reset token generated for {$email}: {$token}");
        
        return true;
    }

    /**
     * Restablecer contraseña
     */
    public function resetPassword(string $token, string $newPassword): bool
    {
        $resetData = Cache::get("password_reset:{$token}");
        
        if (!$resetData) {
            return false;
        }

        $user = User::find($resetData['user_id']);
        
        if (!$user) {
            return false;
        }

        // Actualizar contraseña
        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        // Limpiar token
        Cache::forget("password_reset:{$token}");

        AuthenticationLog::log(
            AuthenticationLog::ACTION_PASSWORD_RESET_SUCCESS,
            true,
            $user
        );

        return true;
    }

    /**
     * Cambiar contraseña
     */
    public function changePassword(User $user, string $currentPassword, string $newPassword): array
    {
        if (!Hash::check($currentPassword, $user->password)) {
            return [
                'success' => false,
                'message' => 'Contraseña actual incorrecta',
            ];
        }

        $user->update([
            'password' => Hash::make($newPassword),
        ]);

        AuthenticationLog::log(
            AuthenticationLog::ACTION_PASSWORD_CHANGED,
            true,
            $user
        );

        return [
            'success' => true,
            'message' => 'Contraseña actualizada exitosamente',
        ];
    }

    /**
     * Obtener estadísticas de autenticación
     */
    public function getAuthStats(User $user): array
    {
        return [
            'total_logins' => $user->authenticationLogs()
                ->where('action', AuthenticationLog::ACTION_LOGIN)
                ->count(),
            'failed_logins' => $user->authenticationLogs()
                ->where('action', AuthenticationLog::ACTION_FAILED_LOGIN)
                ->recent(24 * 60)
                ->count(),
            'last_login' => $user->authenticationLogs()
                ->where('action', AuthenticationLog::ACTION_LOGIN)
                ->latest()
                ->first(),
            'recent_activity' => $user->authenticationLogs()
                ->recent(7 * 24 * 60)
                ->orderBy('created_at', 'desc')
                ->take(10)
                ->get(),
            'two_factor_stats' => $this->twoFactorService->getStats($user),
        ];
    }

    /**
     * Verificar si el login es sospechoso
     */
    private function isSuspiciousLogin(User $user, $request): bool
    {
        // Verificar cambios significativos en el patrón de login
        $currentIp = $request->ip();
        $currentUserAgent = $request->userAgent();
        
        // Obtener últimos logins exitosos
        $recentLogins = AuthenticationLog::where('user_id', $user->id)
            ->where('action', AuthenticationLog::ACTION_LOGIN)
            ->where('success', true)
            ->where('created_at', '>', now()->subDays(30))
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get();

        if ($recentLogins->isEmpty()) {
            return false; // Primer login, no es sospechoso
        }

        // Verificar si es un patrón diferente
        $lastLogin = $recentLogins->first();
        
        // Cambio significativo de IP (diferente país/región)
        if ($this->isSignificantIpChange($lastLogin->ip_address, $currentIp)) {
            return true;
        }

        // Cambio de dispositivo/navegador
        if ($this->isDeviceChange($lastLogin->user_agent, $currentUserAgent)) {
            return true;
        }

        // Login desde ubicación geográfica inusual
        if ($this->isUnusualLocation($user, $currentIp)) {
            return true;
        }

        return false;
    }

    /**
     * Obtener ubicación desde IP
     */
    private function getLocationFromIp(string $ip): string
    {
        // En producción, aquí se usaría un servicio como IP Geolocation
        // Por ahora retornamos un valor simulado
        return 'Ubicación desconocida';
    }

    /**
     * Verificar si hay un cambio significativo de IP
     */
    private function isSignificantIpChange(string $lastIp, string $currentIp): bool
    {
        // En producción, aquí se usaría un servicio de geolocalización
        // para verificar si las IPs provienen de ubicaciones diferentes
        // Por ahora, simplemente verificamos si son IPs completamente diferentes
        return $lastIp !== $currentIp;
    }

    /**
     * Verificar si hay cambio de dispositivo/navegador
     */
    private function isDeviceChange(string $lastUserAgent, string $currentUserAgent): bool
    {
        // Comparar user agents para detectar cambios significativos
        // Esto es una implementación básica - en producción sería más sofisticada
        $lastHash = md5($lastUserAgent);
        $currentHash = md5($currentUserAgent);
        
        return $lastHash !== $currentHash;
    }

    /**
     * Verificar si la ubicación es inusual para el usuario
     */
    private function isUnusualLocation(User $user, string $currentIp): bool
    {
        // Verificar si esta IP ha sido usada anteriormente por el usuario
        $previousLogins = AuthenticationLog::where('user_id', $user->id)
            ->where('action', AuthenticationLog::ACTION_LOGIN)
            ->where('success', true)
            ->where('ip_address', $currentIp)
            ->where('created_at', '>', now()->subDays(90))
            ->exists();

        // Si nunca antes se ha logueado desde esta IP, podría ser inusual
        return !$previousLogins;
    }
}