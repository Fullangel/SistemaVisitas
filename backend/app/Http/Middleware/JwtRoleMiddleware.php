<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class JwtRoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$roles): Response
    {
        try {
            // Verificar que haya un token
            if (!$request->bearerToken()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token no proporcionado'
                ], 401);
            }

            // Autenticar con JWT
            $user = JWTAuth::parseToken()->authenticate();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario no encontrado'
                ], 401);
            }

            // Verificar que el usuario esté activo
            if ($user->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario inactivo'
                ], 403);
            }

            // Obtener el rol del usuario
            $userRole = $user->role->name ?? null;
            
            if (!$userRole) {
                return response()->json([
                    'success' => false,
                    'message' => 'Usuario sin rol asignado'
                ], 403);
            }

            // Verificar si el rol está en los roles permitidos
            if (!in_array($userRole, $roles)) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes permisos para acceder a este recurso',
                    'required_roles' => $roles,
                    'your_role' => $userRole
                ], 403);
            }

            return $next($request);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token inválido o expirado',
                'error' => $e->getMessage()
            ], 401);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de autenticación',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}