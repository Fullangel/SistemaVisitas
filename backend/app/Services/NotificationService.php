<?php

namespace App\Services;

use App\Models\User;
use App\Models\Notificacion;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Cache;
use App\Mail\NotificacionMail;

class NotificationService
{
    /**
     * Enviar notificación a un usuario específico.
     *
     * @param  \App\Models\User  $usuario
     * @param  string  $titulo
     * @param  string  $mensaje
     * @param  string  $tipo
     * @param  array  $datos
     * @return \App\Models\Notificacion
     */
    public function enviarNotificacionUsuario(User $usuario, string $titulo, string $mensaje, string $tipo = 'info', array $datos = [])
    {
        try {
            // Crear notificación en base de datos
            $notificacion = Notificacion::create([
                'user_id' => $usuario->id,
                'titulo' => $titulo,
                'mensaje' => $mensaje,
                'tipo' => $tipo,
                'data' => $datos,
                'leido' => false,
            ]);

            // Enviar notificación en tiempo real si el usuario está conectado
            $this->enviarNotificacionRealtime($usuario, $notificacion);

            // Enviar email si el usuario tiene habilitado
            if ($usuario->notificaciones_email) {
                $this->enviarNotificacionEmail($usuario, $notificacion);
            }

            // Limpiar caché de notificaciones del usuario
            Cache::tags(['notificaciones', 'usuario_' . $usuario->id])->flush();

            Log::info('Notificación enviada exitosamente', [
                'usuario_id' => $usuario->id,
                'notificacion_id' => $notificacion->id,
                'tipo' => $tipo,
            ]);

            return $notificacion;

        } catch (\Exception $e) {
            Log::error('Error al enviar notificación', [
                'usuario_id' => $usuario->id,
                'titulo' => $titulo,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Enviar notificación a múltiples usuarios.
     *
     * @param  array  $usuarios
     * @param  string  $titulo
     * @param  string  $mensaje
     * @param  string  $tipo
     * @param  array  $datos
     * @return array
     */
    public function enviarNotificacionMasiva(array $usuarios, string $titulo, string $mensaje, string $tipo = 'info', array $datos = [])
    {
        $notificaciones = [];

        foreach ($usuarios as $usuario) {
            try {
                $notificacion = $this->enviarNotificacionUsuario($usuario, $titulo, $mensaje, $tipo, $datos);
                $notificaciones[] = $notificacion;
            } catch (\Exception $e) {
                Log::error('Error al enviar notificación masiva a usuario', [
                    'usuario_id' => $usuario->id,
                    'titulo' => $titulo,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        return $notificaciones;
    }

    /**
     * Enviar notificación a usuarios por rol.
     *
     * @param  string  $rol
     * @param  string  $titulo
     * @param  string  $mensaje
     * @param  string  $tipo
     * @param  array  $datos
     * @return array
     */
    public function enviarNotificacionPorRol(string $rol, string $titulo, string $mensaje, string $tipo = 'info', array $datos = [])
    {
        $usuarios = User::where('role', $rol)->where('activo', true)->get();

        return $this->enviarNotificacionMasiva($usuarios->toArray(), $titulo, $mensaje, $tipo, $datos);
    }

    /**
     * Enviar notificación a entidad específica.
     *
     * @param  string  $entidadCodigo
     * @param  string  $titulo
     * @param  string  $mensaje
     * @param  string  $tipo
     * @param  array  $datos
     * @return array
     */
    public function notificarEntidad(string $entidadCodigo, string $titulo, string $mensaje, string $tipo = 'info', array $datos = [])
    {
        // Obtener usuarios responsables de la entidad
        $usuarios = User::whereHas('entidades', function ($query) use ($entidadCodigo) {
            $query->where('codigo', $entidadCodigo);
        })->where('activo', true)->get();

        return $this->enviarNotificacionMasiva($usuarios->toArray(), $titulo, $mensaje, $tipo, $datos);
    }

    /**
     * Marcar notificación como leída.
     *
     * @param  \App\Models\Notificacion  $notificacion
     * @return bool
     */
    public function marcarComoLeida(Notificacion $notificacion)
    {
        $notificacion->update(['leido' => true]);

        // Limpiar caché
        Cache::tags(['notificaciones', 'usuario_' . $notificacion->user_id])->flush();

        return true;
    }

    /**
     * Marcar todas las notificaciones de un usuario como leídas.
     *
     * @param  \App\Models\User  $usuario
     * @return int
     */
    public function marcarTodasComoLeidas(User $usuario)
    {
        $cantidad = Notificacion::where('user_id', $usuario->id)
            ->where('leido', false)
            ->update(['leido' => true]);

        // Limpiar caché
        Cache::tags(['notificaciones', 'usuario_' . $usuario->id])->flush();

        return $cantidad;
    }

    /**
     * Obtener notificaciones de un usuario.
     *
     * @param  \App\Models\User  $usuario
     * @param  int  $limite
     * @param  bool  $soloNoLeidas
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public function obtenerNotificaciones(User $usuario, int $limite = 20, bool $soloNoLeidas = false)
    {
        $cacheKey = "notificaciones_usuario_{$usuario->id}_" . ($soloNoLeidas ? 'no_leidas' : 'todas');

        return Cache::tags(['notificaciones', 'usuario_' . $usuario->id])->remember(
            $cacheKey,
            300, // 5 minutos
            function () use ($usuario, $limite, $soloNoLeidas) {
                $query = Notificacion::where('user_id', $usuario->id)
                    ->orderBy('created_at', 'desc');

                if ($soloNoLeidas) {
                    $query->where('leido', false);
                }

                return $query->limit($limite)->get();
            }
        );
    }

    /**
     * Contar notificaciones no leídas.
     *
     * @param  \App\Models\User  $usuario
     * @return int
     */
    public function contarNoLeidas(User $usuario)
    {
        $cacheKey = "notificaciones_no_leidas_usuario_{$usuario->id}";

        return Cache::tags(['notificaciones', 'usuario_' . $usuario->id])->remember(
            $cacheKey,
            60, // 1 minuto
            function () use ($usuario) {
                return Notificacion::where('user_id', $usuario->id)
                    ->where('leido', false)
                    ->count();
            }
        );
    }

    /**
     * Eliminar notificaciones antiguas.
     *
     * @param  int  $dias
     * @return int
     */
    public function limpiarNotificacionesAntiguas(int $dias = 30)
    {
        $fechaLimite = now()->subDays($dias);

        $cantidad = Notificacion::where('created_at', '<', $fechaLimite)->delete();

        Log::info('Notificaciones antiguas eliminadas', [
            'dias' => $dias,
            'cantidad_eliminada' => $cantidad,
        ]);

        return $cantidad;
    }

    /**
     * Enviar notificación en tiempo real.
     *
     * @param  \App\Models\User  $usuario
     * @param  \App\Models\Notificacion  $notificacion
     * @return void
     */
    protected function enviarNotificacionRealtime(User $usuario, Notificacion $notificacion)
    {
        // Aquí iría la lógica para enviar notificaciones en tiempo real
        // Por ejemplo, usando Pusher, WebSockets, etc.
        
        // Por ahora, solo logueamos
        Log::info('Notificación en tiempo real simulada', [
            'usuario_id' => $usuario->id,
            'notificacion_id' => $notificacion->id,
        ]);
    }

    /**
     * Enviar notificación por email.
     *
     * @param  \App\Models\User  $usuario
     * @param  \App\Models\Notificacion  $notificacion
     * @return void
     */
    protected function enviarNotificacionEmail(User $usuario, Notificacion $notificacion)
    {
        try {
            Mail::to($usuario->email)->send(new NotificacionMail($usuario, $notificacion));

            Log::info('Email de notificación enviado', [
                'usuario_id' => $usuario->id,
                'notificacion_id' => $notificacion->id,
                'email' => $usuario->email,
            ]);

        } catch (\Exception $e) {
            Log::error('Error al enviar email de notificación', [
                'usuario_id' => $usuario->id,
                'notificacion_id' => $notificacion->id,
                'error' => $e->getMessage(),
            ]);
        }
    }
}