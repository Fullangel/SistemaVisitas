<?php

namespace App\Jobs;

use App\Models\Visita;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\Middleware\RateLimited;
use Illuminate\Support\Facades\Log;

class ProcesarVisitaJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Número de veces que el job puede ser reintentado.
     *
     * @var int
     */
    public $tries = 3;

    /**
     * Número de segundos que el job puede ejecutarse antes de ser considerado fallido.
     *
     * @var int
     */
    public $timeout = 120;

    /**
     * Número de segundos de espera antes de reintentar el job.
     *
     * @var int
     */
    public $backoff = 60;

    /**
     * La visita a procesar.
     *
     * @var \App\Models\Visita
     */
    protected $visita;

    /**
     * El usuario que creó la visita.
     *
     * @var \App\Models\User
     */
    protected $usuario;

    /**
     * Crear una nueva instancia del job.
     *
     * @param  \App\Models\Visita  $visita
     * @param  \App\Models\User  $usuario
     * @return void
     */
    public function __construct(Visita $visita, User $usuario)
    {
        $this->visita = $visita;
        $this->usuario = $usuario;
    }

    /**
     * Obtener los middleware de la cola para el job.
     *
     * @return array
     */
    public function middleware()
    {
        return [
            new RateLimited('procesar-visita'),
        ];
    }

    /**
     * Ejecutar el job.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    public function handle(NotificationService $notificationService)
    {
        Log::info('Procesando visita', [
            'visita_id' => $this->visita->id,
            'usuario_id' => $this->usuario->id,
        ]);

        try {
            // Validar que la visita aún existe y está en estado válido
            if (!$this->visita->exists()) {
                Log::warning('La visita ya no existe', ['visita_id' => $this->visita->id]);
                return;
            }

            // Verificar si la visita está próxima a vencer
            $this->verificarVencimientoProximo();

            // Enviar notificaciones si es necesario
            $this->enviarNotificaciones($notificationService);

            // Actualizar estadísticas en caché
            $this->actualizarEstadisticas();

            // Registrar en log de auditoría
            $this->registrarAuditoria();

            Log::info('Visita procesada exitosamente', [
                'visita_id' => $this->visita->id,
                'estado' => $this->visita->estado,
            ]);

        } catch (\Exception $e) {
            Log::error('Error al procesar visita', [
                'visita_id' => $this->visita->id,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            // Re-lanzar la excepción para que el job sea reintentado
            throw $e;
        }
    }

    /**
     * Verificar si la visita está próxima a vencer.
     *
     * @return void
     */
    protected function verificarVencimientoProximo()
    {
        $fechaIngreso = \Carbon\Carbon::parse($this->visita->fecha_hora_ingreso);
        $ahora = now();
        
        // Si la visita está en curso y ha pasado más del 80% del tiempo límite
        if ($this->visita->estado === 'en_curso') {
            $tiempoTranscurrido = $ahora->diffInMinutes($fechaIngreso);
            $tiempoLimite = config('visitas.tiempo_limite_visita', 120); // 2 horas por defecto
            
            if ($tiempoTranscurrido > ($tiempoLimite * 0.8)) {
                // Programar notificación de advertencia
                dispatch(new EnviarNotificacionJob(
                    $this->usuario,
                    'visita_proxima_vencer',
                    [
                        'visita' => $this->visita,
                        'tiempo_restante' => $tiempoLimite - $tiempoTranscurrido,
                    ]
                ))->onQueue('notificaciones');
            }
        }
    }

    /**
     * Enviar notificaciones relacionadas con la visita.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    protected function enviarNotificaciones(NotificationService $notificationService)
    {
        // Notificar a los responsables de la entidad visitada
        if ($this->visita->estado === 'pendiente') {
            $notificationService->notificarEntidad(
                $this->visita->entidad_visitada,
                'nueva_visita_pendiente',
                [
                    'visita' => $this->visita,
                    'usuario' => $this->usuario,
                ]
            );
        }

        // Notificar al usuario creador sobre cambios de estado
        if ($this->visita->wasChanged('estado')) {
            dispatch(new EnviarNotificacionJob(
                $this->usuario,
                'cambio_estado_visita',
                [
                    'visita' => $this->visita,
                    'estado_anterior' => $this->visita->getOriginal('estado'),
                    'estado_nuevo' => $this->visita->estado,
                ]
            ))->onQueue('notificaciones');
        }
    }

    /**
     * Actualizar estadísticas en caché.
     *
     * @return void
     */
    protected function actualizarEstadisticas()
    {
        // Actualizar contadores de visitas por estado
        $cacheKey = 'estadisticas_visitas_' . date('Y-m-d');
        \Cache::tags(['estadisticas', 'visitas'])->forget($cacheKey);

        // Actualizar estadísticas del usuario
        $userStatsKey = 'estadisticas_usuario_' . $this->usuario->id;
        \Cache::tags(['estadisticas', 'usuarios'])->forget($userStatsKey);
    }

    /**
     * Registrar en log de auditoría.
     *
     * @return void
     */
    protected function registrarAuditoria()
    {
        \DB::table('auditoria_visitas')->insert([
            'visita_id' => $this->visita->id,
            'usuario_id' => $this->usuario->id,
            'accion' => 'procesamiento_automatico',
            'estado_anterior' => $this->visita->getOriginal('estado'),
            'estado_nuevo' => $this->visita->estado,
            'cambios' => json_encode($this->visita->getChanges()),
            'ip_address' => request()->ip() ?? '127.0.0.1',
            'user_agent' => request()->userAgent() ?? 'Horizon Worker',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    /**
     * Manejar un fallo en el job.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed(\Throwable $exception)
    {
        Log::error('Job ProcesarVisitaJob falló', [
            'visita_id' => $this->visita->id,
            'usuario_id' => $this->usuario->id,
            'error' => $exception->getMessage(),
        ]);

        // Notificar al administrador sobre el fallo
        dispatch(new NotificarErrorJob(
            'Error al procesar visita',
            [
                'visita_id' => $this->visita->id,
                'error' => $exception->getMessage(),
                'job' => 'ProcesarVisitaJob',
            ]
        ))->onQueue('notificaciones');
    }
}