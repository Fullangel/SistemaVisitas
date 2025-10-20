<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    /**
     * Registro de nuevo usuario
     */
    public function register(Request $request)
    {
        try {
            $request->validate([
                'first_name' => 'required|string|max:100',
                'last_name' => 'required|string|max:100',
                'email' => 'required|string|email|max:191|unique:users',
                'username' => 'required|string|max:191|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'phone' => 'nullable|string|max:50',
                'address' => 'nullable|string|max:512',
            ]);

            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'username' => $request->username,
                'password' => Hash::make($request->password),
                'phone' => $request->phone,
                'address' => $request->address,
                'status' => 1,
            ]);

            // Generar token JWT
            $token = JWTAuth::fromUser($user);

            return response()->json([
                'success' => true,
                'message' => 'Usuario registrado exitosamente',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => JWTAuth::factory()->getTTL() * 60
                ]
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al registrar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login de usuario
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'login' => 'required|string|max:191', // Puede ser username o email
                'password' => 'required|string|min:8|max:255',
            ]);

            // Determinar si es email o username
            $loginField = filter_var($request->login, FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
            
            // Verificar si el usuario existe y está activo
            $user = User::where($loginField, $request->login)->first();
            
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

            $credentials = [
                $loginField => $request->login,
                'password' => $request->password
            ];

            // Intentar autenticar con JWT
            if (!$token = JWTAuth::attempt($credentials)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Credenciales inválidas',
                    'error' => 'Invalid credentials'
                ], 401);
            }

            // Actualizar último login
            $user->update(['last_login_at' => now()]);

            // Cargar relaciones del usuario
            $user->load(['role', 'employee']);

            return response()->json([
                'success' => true,
                'message' => 'Login exitoso',
                'data' => [
                    'user' => $user,
                    'access_token' => $token,
                    'token_type' => 'bearer',
                    'expires_in' => JWTAuth::factory()->getTTL() * 60,
                    'issued_at' => now()->toISOString(),
                    'expires_at' => now()->addMinutes(JWTAuth::factory()->getTTL())->toISOString()
                ]
            ]);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error de validación',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al iniciar sesión',
                'error' => 'Login failed',
                'details' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Logout de usuario
     */
    public function logout(Request $request)
    {
        try {
            // Invalidar el token JWT
            JWTAuth::invalidate(JWTAuth::getToken());

            return response()->json([
                'success' => true,
                'message' => 'Logout exitoso'
            ]);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al cerrar sesión',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Refrescar token
     */
    public function refreshToken(Request $request)
    {
        try {
            // Refrescar el token JWT
            $token = JWTAuth::refresh(JWTAuth::getToken());

            return response()->json([
                'success' => true,
                'message' => 'Token refrescado exitosamente',
                'data' => [
                    'token' => $token,
                    'token_type' => 'Bearer'
                ]
            ]);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al refrescar token',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Obtener perfil del usuario autenticado
     */
    public function profile(Request $request)
    {
        try {
            // Obtener usuario desde el token JWT
            $user = JWTAuth::parseToken()->authenticate();
            
            // Cargar relaciones si existen
            $user->load(['role', 'employee']);

            return response()->json([
                'success' => true,
                'message' => 'Perfil obtenido exitosamente',
                'data' => [
                    'user' => $user
                ]
            ]);

        } catch (JWTException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener perfil',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Formatear respuesta con token JWT
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'success' => true,
            'message' => 'Operación exitosa',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => JWTAuth::factory()->getTTL() * 60
            ]
        ]);
    }
}