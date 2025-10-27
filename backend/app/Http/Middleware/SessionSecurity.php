<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;

class SessionSecurity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Verificar si el usuario está autenticado
        if (Auth::check()) {
            $this->validateSessionSecurity($request);
            $this->checkConcurrentSessions($request);
            $this->checkSessionFingerprint($request);
        }

        // Establecer headers de seguridad adicionales
        $response = $next($request);
        
        return $this->addSecurityHeaders($response);
    }

    /**
     * Validar seguridad de la sesión
     */
    protected function validateSessionSecurity(Request $request): void
    {
        $user = Auth::user();
        $sessionId = Session::getId();
        
        // Verificar IP del usuario
        $currentIp = $request->ip();
        $sessionIp = Session::get('user_ip');
        
        if ($sessionIp && $sessionIp !== $currentIp) {
            // IP cambió, verificar si es una IP sospechosa
            $this->checkSuspiciousIpChange($user, $sessionIp, $currentIp);
        } else if (!$sessionIp) {
            // Primera vez, guardar IP
            Session::put('user_ip', $currentIp);
        }
        
        // Verificar User-Agent
        $currentUserAgent = $request->userAgent();
        $sessionUserAgent = Session::get('user_agent');
        
        if ($sessionUserAgent && $sessionUserAgent !== $currentUserAgent) {
            // User-Agent cambió, puede ser un intento de secuestro
            $this->handlePotentialHijacking($user, 'User-Agent changed');
        } else if (!$sessionUserAgent) {
            // Primera vez, guardar User-Agent
            Session::put('user_agent', $currentUserAgent);
        }
        
        // Verificar tiempo de inactividad
        $lastActivity = Session::get('last_activity');
        if ($lastActivity && (time() - $lastActivity) > config('session.lifetime') * 60) {
            Auth::logout();
            Session::flush();
            abort(419, 'Session expired due to inactivity');
        }
        
        Session::put('last_activity', time());
    }

    /**
     * Verificar sesiones concurrentes
     */
    protected function checkConcurrentSessions(Request $request): void
    {
        $user = Auth::user();
        $currentSessionId = Session::getId();
        
        // Obtener todas las sesiones activas del usuario
        $activeSessions = Cache::get("user_sessions_{$user->id}", []);
        
        // Limitar número de sesiones concurrentes
        $maxSessions = config('session.max_concurrent_sessions', 3);
        
        if (count($activeSessions) >= $maxSessions && !in_array($currentSessionId, $activeSessions)) {
            // Demasiadas sesiones activas
            $this->handleTooManySessions($user);
        }
        
        // Actualizar lista de sesiones activas
        if (!in_array($currentSessionId, $activeSessions)) {
            $activeSessions[] = $currentSessionId;
        }
        
        // Eliminar sesiones antiguas si excedemos el límite
        if (count($activeSessions) > $maxSessions) {
            $activeSessions = array_slice($activeSessions, -$maxSessions);
        }
        
        Cache::put("user_sessions_{$user->id}", $activeSessions, config('session.lifetime'));
    }

    /**
     * Verificar huella digital de la sesión
     */
    protected function checkSessionFingerprint(Request $request): void
    {
        $fingerprint = $this->generateFingerprint($request);
        $storedFingerprint = Session::get('session_fingerprint');
        
        if ($storedFingerprint && $storedFingerprint !== $fingerprint) {
            // Huella digital no coincide
            $this->handlePotentialHijacking(Auth::user(), 'Session fingerprint mismatch');
        } else if (!$storedFingerprint) {
            Session::put('session_fingerprint', $fingerprint);
        }
    }

    /**
     * Generar huella digital de la sesión
     */
    protected function generateFingerprint(Request $request): string
    {
        $components = [
            $request->ip(),
            $request->userAgent(),
            $request->header('Accept-Language'),
            $request->header('Accept-Encoding'),
        ];
        
        return hash('sha256', implode('|', $components));
    }

    /**
     * Verificar cambio de IP sospechoso
     */
    protected function checkSuspiciousIpChange($user, string $oldIp, string $newIp): void
    {
        // Verificar si el cambio es drástico (ej: diferente país)
        $oldLocation = $this->getIpLocation($oldIp);
        $newLocation = $this->getIpLocation($newIp);
        
        if ($oldLocation && $newLocation && $oldLocation['country'] !== $newLocation['country']) {
            // Cambio de país, muy sospechoso
            $this->handlePotentialHijacking($user, "IP changed from {$oldLocation['country']} to {$newLocation['country']}");
        }
        
        // Actualizar IP en sesión
        Session::put('user_ip', $newIp);
    }

    /**
     * Manejar posible secuestro de sesión
     */
    protected function handlePotentialHijacking($user, string $reason): void
    {
        // Log del incidente
        Log::channel('security')->warning('Potential session hijacking detected', [
            'user_id' => $user->id,
            'reason' => $reason,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'session_id' => Session::getId(),
        ]);
        
        // Invalidar todas las sesiones del usuario
        $this->invalidateAllUserSessions($user->id);
        
        // Cerrar sesión actual
        Auth::logout();
        Session::flush();
        
        // Notificar al usuario
        $this->notifySecurityBreach($user, $reason);
        
        abort(419, 'Session security violation detected');
    }

    /**
     * Manejar demasiadas sesiones
     */
    protected function handleTooManySessions($user): void
    {
        Log::channel('security')->warning('Too many concurrent sessions', [
            'user_id' => $user->id,
            'ip' => request()->ip(),
            'session_count' => count(Cache::get("user_sessions_{$user->id}", [])),
        ]);
        
        // Invalidar la sesión más antigua
        $this->invalidateOldestSession($user->id);
    }

    /**
     * Invalidar todas las sesiones de un usuario
     */
    protected function invalidateAllUserSessions(int $userId): void
    {
        $sessions = Cache::get("user_sessions_{$userId}", []);
        
        foreach ($sessions as $sessionId) {
            Cache::forget("session_{$sessionId}");
        }
        
        Cache::forget("user_sessions_{$userId}");
    }

    /**
     * Invalidar la sesión más antigua
     */
    protected function invalidateOldestSession(int $userId): void
    {
        $sessions = Cache::get("user_sessions_{$userId}", []);
        
        if (!empty($sessions)) {
            $oldestSession = array_shift($sessions);
            Cache::forget("session_{$oldestSession}");
            Cache::put("user_sessions_{$userId}", $sessions, config('session.lifetime'));
        }
    }

    /**
     * Notificar violación de seguridad
     */
    protected function notifySecurityBreach($user, string $reason): void
    {
        // Aquí puedes implementar notificaciones por email, SMS, etc.
        // Por ahora solo logueamos
        \Log::channel('security')->alert('Security breach notification sent', [
            'user_id' => $user->id,
            'email' => $user->email,
            'reason' => $reason,
        ]);
    }

    /**
     * Obtener ubicación de IP (mock implementation)
     */
    protected function getIpLocation(string $ip): ?array
    {
        // En producción, usar un servicio como ip-api, ipinfo, etc.
        // Por ahora retornamos null para evitar dependencias externas
        return null;
    }

    /**
     * Agregar headers de seguridad
     */
    protected function addSecurityHeaders($response)
    {
        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('X-XSS-Protection', '1; mode=block');
        $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        
        return $response;
    }
}