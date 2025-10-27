<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\AuthService;
use App\Services\TwoFactorService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Tymon\JWTAuth\Facades\JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class AuthController extends Controller
{
    protected AuthService $authService;
    protected TwoFactorService $twoFactorService;

    public function __construct(AuthService $authService, TwoFactorService $twoFactorService)
    {
        $this->authService = $authService;
        $this->twoFactorService = $twoFactorService;
    }
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
     * Login de usuario con soporte para 2FA
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'login' => 'required|string|max:191', // Puede ser username o email
                'password' => 'required|string|min:8|max:255',
                'remember' => 'boolean',
            ]);

            $result = $this->authService->authenticate(
                $request->login,
                $request->password,
                $request->boolean('remember', false)
            );

            if (!$result['success']) {
                return response()->json([
                    'success' => false,
                    'message' => $result['message'],
                    'locked_until' => $result['locked_until'] ?? null,
                    'remaining_attempts' => $result['remaining_attempts'] ?? null,
                ], 401);
            }

            // Si requiere 2FA, no enviar token completo aún
            // DESACTIVADO PARA DESARROLLO - SIEMPRE RETORNA FALSE
            if ($result['requires_2fa'] && config('app.enable_2fa', false)) {
                return response()->json([
                    'success' => true,
                    'requires_2fa' => true,
                    'temp_token' => $result['temp_token'],
                    'user_id' => $result['user_id'],
                    'two_factor_method' => $result['two_factor_method'],
                    'message' => $result['message'],
                ]);
            }

            return response()->json([
                'success' => true,
                'token' => $result['token'],
                'token_type' => $result['token_type'],
                'expires_in' => $result['expires_in'],
                'user' => $result['user'],
                'message' => $result['message'],
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
     * Verificar código 2FA
     */
    public function verifyTwoFactor(Request $request)
    {
        Log::info('verifyTwoFactor called', ['request_data' => $request->all()]);
        
        $validator = validator($request->all(), [
            'temp_token' => 'required|string',
            'code' => 'required|string',
            'trust_device' => 'boolean',
        ]);

        if ($validator->fails()) {
            Log::error('Validation failed', ['errors' => $validator->errors()->toArray()]);
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        Log::info('Calling authService->verifyTwoFactor', [
            'temp_token' => $request->temp_token,
            'code' => $request->code,
            'trust_device' => $request->boolean('trust_device', false)
        ]);

        $result = $this->authService->verifyTwoFactor(
            $request->temp_token,
            $request->code,
            $request->boolean('trust_device', false)
        );

        Log::info('authService->verifyTwoFactor result', ['result' => $result]);

        if (!$result['success']) {
            return response()->json([
                'success' => false,
                'message' => $result['message'],
            ], 401);
        }

        return response()->json([
            'success' => true,
            'token' => $result['token'],
            'token_type' => $result['token_type'],
            'expires_in' => $result['expires_in'],
            'user' => $result['user'],
            'message' => $result['message'],
        ]);
    }

    /**
     * Logout de usuario
     */
    public function logout(Request $request)
    {
        $this->authService->logout();
        
        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada exitosamente',
        ]);
    }

    /**
     * Refrescar token
     */
    public function refreshToken(Request $request)
    {
        try {
            $result = $this->authService->refreshToken();

            return response()->json([
                'success' => true,
                'data' => $result,
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al refrescar token',
                'error' => $e->getMessage(),
            ], 401);
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