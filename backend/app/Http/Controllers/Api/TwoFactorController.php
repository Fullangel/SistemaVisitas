<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\TwoFactorService;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class TwoFactorController extends Controller
{
    protected TwoFactorService $twoFactorService;

    public function __construct(TwoFactorService $twoFactorService)
    {
        $this->twoFactorService = $twoFactorService;
    }

    /**
     * Obtener estado del 2FA del usuario
     */
    public function status(Request $request)
    {
        $user = Auth::user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'two_factor_enabled' => $user->hasTwoFactorEnabled(),
                'two_factor_confirmed' => $user->two_factor_confirmed_at !== null,
                'two_factor_method' => $user->two_factor_method,
                'backup_codes_remaining' => count($user->getRecoveryCodes()),
            ],
        ]);
    }

    /**
     * Habilitar 2FA con aplicación autenticadora
     */
    public function enableWithApp(Request $request)
    {
        $user = Auth::user();

        if ($user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => 'El 2FA ya está habilitado',
            ], 400);
        }

        // Generar secreto
        $secret = $this->twoFactorService->generateSecret();
        
        // Guardar secreto temporalmente (no confirmado aún)
        $user->update([
            'two_factor_secret' => encrypt($secret),
            'two_factor_method' => 'app',
        ]);

        // Generar QR Code
        $qrCodeUrl = $this->twoFactorService->generateQrCodeUrl($user, $secret);
        $qrCodeImage = $this->twoFactorService->generateQrCodeImage($qrCodeUrl);

        // Generar códigos de recuperación
        $recoveryCodes = $this->twoFactorService->generateRecoveryCodes($user);

        return response()->json([
            'success' => true,
            'data' => [
                'secret' => $secret,
                'qr_code_url' => $qrCodeUrl,
                'qr_code_image' => $qrCodeImage,
                'recovery_codes' => $recoveryCodes,
            ],
            'message' => 'Escanea el código QR con tu aplicación autenticadora',
        ]);
    }

    /**
     * Confirmar 2FA con código de verificación
     */
    public function confirm(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'code' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();

        if (!$user->two_factor_secret) {
            return response()->json([
                'success' => false,
                'message' => 'No hay configuración de 2FA pendiente',
            ], 400);
        }

        if ($user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => 'El 2FA ya está habilitado',
            ], 400);
        }

        // Verificar código
        $secret = decrypt($user->two_factor_secret);
        
        if (!$this->twoFactorService->verifyCode($secret, $request->code)) {
            return response()->json([
                'success' => false,
                'message' => 'Código de verificación inválido',
            ], 400);
        }

        // Habilitar 2FA
        $user->enableTwoFactor('app');
        $user->confirmTwoFactor();

        return response()->json([
            'success' => true,
            'message' => 'Autenticación de dos factores habilitada exitosamente',
        ]);
    }

    /**
     * Deshabilitar 2FA
     */
    public function disable(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();

        if (!$user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => 'El 2FA no está habilitado',
            ], 400);
        }

        // Verificar contraseña
        if (!$user->verifyPassword($request->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Contraseña incorrecta',
            ], 400);
        }

        // Deshabilitar 2FA
        $user->disableTwoFactor();

        return response()->json([
            'success' => true,
            'message' => 'Autenticación de dos factores deshabilitada exitosamente',
        ]);
    }

    /**
     * Generar nuevo código de verificación
     */
    public function generateCode(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:email,sms',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();

        if (!$user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => 'El 2FA no está habilitado',
            ], 400);
        }

        // Generar código
        $twoFactorCode = $this->twoFactorService->generateVerificationCode($user, $request->type);

        // Enviar código
        $sent = false;
        if ($request->type === 'email') {
            $sent = $this->twoFactorService->sendEmailCode($user, $twoFactorCode->code);
        } elseif ($request->type === 'sms' && $user->phone_number) {
            $sent = $this->twoFactorService->sendSmsCode($user, $twoFactorCode->code);
        }

        if (!$sent) {
            return response()->json([
                'success' => false,
                'message' => 'No se pudo enviar el código',
            ], 500);
        }

        return response()->json([
            'success' => true,
            'message' => 'Código enviado exitosamente',
            'expires_in' => 900, // 15 minutos
        ]);
    }

    /**
     * Obtener dispositivos confiables
     */
    public function trustedDevices(Request $request)
    {
        $user = Auth::user();
        
        $devices = $user->trustedDevices()
            ->where('is_trusted', true)
            ->where('last_used_at', '>', now()->subDays(30))
            ->orderBy('last_used_at', 'desc')
            ->get()
            ->map(function ($device) {
                return [
                    'id' => $device->id,
                    'device_name' => $device->device_name,
                    'ip_address' => $device->ip_address,
                    'last_used_at' => $device->last_used_at,
                    'is_current_device' => $device->device_fingerprint === \App\Models\TrustedDevice::generateFingerprint(
                        request()->userAgent(),
                        request()->ip()
                    ),
                ];
            });

        return response()->json([
            'success' => true,
            'data' => $devices,
        ]);
    }

    /**
     * Revocar dispositivo confiable
     */
    public function revokeDevice(Request $request, $deviceId)
    {
        $user = Auth::user();
        
        $device = $user->trustedDevices()
            ->where('id', $deviceId)
            ->where('is_trusted', true)
            ->first();

        if (!$device) {
            return response()->json([
                'success' => false,
                'message' => 'Dispositivo no encontrado',
            ], 404);
        }

        $device->revoke();

        return response()->json([
            'success' => true,
            'message' => 'Dispositivo revocado exitosamente',
        ]);
    }

    /**
     * Generar nuevos códigos de recuperación
     */
    public function regenerateRecoveryCodes(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Datos de entrada inválidos',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = Auth::user();

        if (!$user->hasTwoFactorEnabled()) {
            return response()->json([
                'success' => false,
                'message' => 'El 2FA no está habilitado',
            ], 400);
        }

        // Verificar contraseña
        if (!$user->verifyPassword($request->password)) {
            return response()->json([
                'success' => false,
                'message' => 'Contraseña incorrecta',
            ], 400);
        }

        // Generar nuevos códigos
        $recoveryCodes = $this->twoFactorService->generateRecoveryCodes($user);

        return response()->json([
            'success' => true,
            'data' => [
                'recovery_codes' => $recoveryCodes,
            ],
            'message' => 'Nuevos códigos de recuperación generados',
        ]);
    }
}