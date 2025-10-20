<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\User;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$permissions): Response
    {
        try {
            // Obtener el token del encabezado Authorization
            $token = $request->bearerToken();
            
            if (!$token) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token no proporcionado'
                ], 401);
            }

            // Buscar usuario por el token
            $user = User::where('web_token', $token)->first();
            
            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'Token inválido'
                ], 401);
            }

            // Establecer el usuario en la petición
            $request->setUserResolver(function () use ($user) {
                return $user;
            });

            $userPermissions = $user->role->permissions ?? [];
            
            // Verificar si el usuario tiene al menos uno de los permisos requeridos
            $hasPermission = false;
            foreach ($permissions as $permission) {
                if (in_array($permission, $userPermissions)) {
                    $hasPermission = true;
                    break;
                }
            }

            if (!$hasPermission) {
                return response()->json([
                    'success' => false,
                    'message' => 'No tienes los permisos necesarios para esta acción',
                    'required_permissions' => $permissions,
                    'your_permissions' => $userPermissions
                ], 403);
            }

            return $next($request);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de autenticación: ' . $e->getMessage()
            ], 401);
        }
    }
}