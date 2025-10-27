<?php

namespace App\Services;

use App\Models\User;
use App\Models\TwoFactorCode;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class TwoFactorNotificationService
{
    /**
     * Enviar código 2FA por email
     */
    public function sendTwoFactorCodeByEmail(User $user, string $code): bool
    {
        try {
            // Aquí puedes usar un Mailable personalizado
            Mail::raw(
                "Tu código de verificación es: {$code}\n\n" .
                "Este código expirará en 15 minutos.\n" .
                "Si no solicitaste este código, por favor ignora este mensaje.",
                function ($message) use ($user) {
                    $message->to($user->email)
                        ->subject('Código de verificación de dos factores');
                }
            );

            Log::info('Código 2FA enviado por email', [
                'user_id' => $user->id,
                'email' => $user->email,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar código 2FA por email', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Enviar código 2FA por SMS (simulado)
     */
    public function sendTwoFactorCodeBySms(User $user, string $code): bool
    {
        try {
            // En producción, aquí se integraría con un servicio de SMS como Twilio, AWS SNS, etc.
            // Por ahora, simplemente registramos el código en los logs
            Log::info('Código 2FA enviado por SMS (simulado)', [
                'user_id' => $user->id,
                'phone' => $user->phone_number,
                'code' => $code,
            ]);

            // En desarrollo, podrías guardar el código en un archivo temporal
            if (config('app.debug')) {
                $this->saveSmsCodeToFile($user, $code);
            }

            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar código 2FA por SMS', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Guardar código SMS en archivo temporal (solo desarrollo)
     */
    private function saveSmsCodeToFile(User $user, string $code): void
    {
        $smsLogPath = storage_path('logs/sms_codes.log');
        $timestamp = now()->format('Y-m-d H:i:s');
        $message = "[{$timestamp}] SMS para {$user->phone_number}: Código: {$code}\n";
        
        file_put_contents($smsLogPath, $message, FILE_APPEND | LOCK_EX);
    }

    /**
     * Enviar notificación de inicio de sesión sospechoso
     */
    public function sendSuspiciousLoginAlert(User $user, array $loginData): bool
    {
        try {
            $subject = 'Alerta de inicio de sesión sospechoso';
            $body = "Se detectó un inicio de sesión sospechoso en tu cuenta:\n\n";
            $body .= "Fecha: {$loginData['timestamp']}\n";
            $body .= "IP: {$loginData['ip_address']}\n";
            $body .= "Ubicación: {$loginData['location']}\n";
            $body .= "Dispositivo: {$loginData['user_agent']}\n\n";
            $body .= "Si no fuiste tú, por favor cambia tu contraseña inmediatamente.";

            Mail::raw($body, function ($message) use ($user, $subject) {
                $message->to($user->email)
                    ->subject($subject);
            });

            Log::info('Alerta de login sospechoso enviada', [
                'user_id' => $user->id,
                'ip' => $loginData['ip_address'],
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar alerta de login sospechoso', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Enviar notificación de cambio de contraseña
     */
    public function sendPasswordChangedNotification(User $user): bool
    {
        try {
            $subject = 'Tu contraseña ha sido cambiada';
            $body = "Tu contraseña ha sido cambiada exitosamente.\n\n";
            $body .= "Si no realizaste este cambio, por favor contacta al soporte inmediatamente.";

            Mail::raw($body, function ($message) use ($user, $subject) {
                $message->to($user->email)
                    ->subject($subject);
            });

            Log::info('Notificación de cambio de contraseña enviada', [
                'user_id' => $user->id,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error('Error al enviar notificación de cambio de contraseña', [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }

    /**
     * Enviar notificación de 2FA habilitado/deshabilitado
     */
    public function sendTwoFactorStatusNotification(User $user, bool $enabled): bool
    {
        try {
            $status = $enabled ? 'habilitada' : 'deshabilitada';
            $subject = "Autenticación de dos factores {$status}";
            $body = "La autenticación de dos factores ha sido {$status} en tu cuenta.\n\n";
            $body .= "Si no realizaste este cambio, por favor contacta al soporte inmediatamente.";

            Mail::raw($body, function ($message) use ($user, $subject) {
                $message->to($user->email)
                    ->subject($subject);
            });

            Log::info("Notificación de 2FA {$status} enviada", [
                'user_id' => $user->id,
                'enabled' => $enabled,
            ]);

            return true;
        } catch (\Exception $e) {
            Log::error("Error al enviar notificación de 2FA {$status}", [
                'user_id' => $user->id,
                'error' => $e->getMessage(),
            ]);

            return false;
        }
    }
}