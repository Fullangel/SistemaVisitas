<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;
use Tymon\JWTAuth\Exceptions\TokenExpiredException;
use Tymon\JWTAuth\Exceptions\TokenInvalidException;

class JwtMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        try {
            // Verificar si hay token en el header
            if (!$request->headers->has('Authorization')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token no proporcionado',
                    'error' => 'Authorization header missing'
                ], 401);
            }

            // Extraer el token del header Bearer
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token Bearer no encontrado',
                    'error' => 'Bearer token missing'
                ], 401);
            }

            // Validar formato del token (debe tener 3 partes separadas por puntos)
            $tokenParts = explode('.', $token);
            if (count($tokenParts) !== 3) {
                return response()->json([
                    'success' => false,
                    'message' => 'Formato de token inválido',
                    'error' => 'Invalid token format'
                ], 401);
            }

            // Autenticar el token
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado',
                    'error' => 'User not found'
                ], 404);
            }

            // Verificar que el usuario esté activo
            if ($user->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario inactivo',
                    'error' => 'User inactive'
                ], 403);
            }

            // Establecer el usuario autenticado en la request
            $request->merge(['user' => $user]);
            auth()->setUser($user);

        } catch (TokenExpiredException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token expirado',
                'error' => 'TokenExpired',
                'timestamp' => now()->toISOString()
            ], 401);
        } catch (TokenInvalidException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido',
                'error' => 'TokenInvalid',
                'timestamp' => now()->toISOString()
            ], 401);
        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el token',
                'error' => 'JWTException',
                'details' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de autenticación',
                'error' => 'AuthenticationException',
                'details' => $e->getMessage(),
                'timestamp' => now()->toISOString()
            ], 500);
        }

        return $next($request);
    }
}