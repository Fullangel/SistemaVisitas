<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class RateLimitByRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        try {
            // Obtener el token del encabezado Authorization
            $token = $request->bearerToken();
            $role = 'guest';
            $userId = null;
            
            if ($token) {
                // Buscar usuario por el token
                $user = User::where('web_token', $token)->first();
                
                if ($user) {
                    $role = $user->role->name ?? 'guest';
                    $userId = $user->id;
                    
                    // Establecer el usuario en la petición
                    $request->setUserResolver(function () use ($user) {
                        return $user;
                    });
                }
            }
            
            // Definir límites por rol
            $limits = [
                'admin' => 1000,      // 1000 requests por minuto
                'supervisor' => 500,  // 500 requests por minuto
                'recepcion' => 300,   // 300 requests por minuto
                'employee' => 200,    // 200 requests por minuto
                'visitor' => 100,     // 100 requests por minuto
                'guest' => 60,        // 60 requests por minuto
            ];

            $limit = $limits[$role] ?? $limits['guest'];
            $key = 'rate_limit_' . $role . '_' . ($userId ?? $request->ip());

            if (RateLimiter::tooManyAttempts($key, $limit)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demasiadas solicitudes. Por favor, intenta más tarde.',
                    'retry_after' => RateLimiter::availableIn($key)
                ], 429);
            }

            RateLimiter::hit($key, 60); // 60 segundos de ventana

            return $next($request);
        } catch (\Exception $e) {
            // Si hay error de autenticación, aplicar límite de invitado
            $key = 'rate_limit_guest_' . $request->ip();
            
            if (RateLimiter::tooManyAttempts($key, 60)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Demasiadas solicitudes. Por favor, intenta más tarde.',
                    'retry_after' => RateLimiter::availableIn($key)
                ], 429);
            }

            RateLimiter::hit($key, 60);
            return $next($request);
        }
    }
}