<?php

namespace App\Jobs;

use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class EnviarNotificacionJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Número de veces que el job puede ser reintentado.
     *
     * @var int
     */
    public $tries = 5;

    /**
     * Número de segundos que el job puede ejecutarse antes de ser considerado fallido.
     *
     * @var int
     */
    public $timeout = 60;

    /**
     * El usuario destinatario.
     *
     * @var \App\Models\User
     */
    protected $usuario;

    /**
     * El tipo de notificación.
     *
     * @var string
     */
    protected $tipo;

    /**
     * Los datos de la notificación.
     *
     * @var array
     */
    protected $datos;

    /**
     * Crear una nueva instancia del job.
     *
     * @param  \App\Models\User  $usuario
     * @param  string  $tipo
     * @param  array  $datos
     * @return void
     */
    public function __construct(User $usuario, string $tipo, array $datos = [])
    {
        $this->usuario = $usuario;
        $this->tipo = $tipo;
        $this->datos = $datos;
    }

    /**
     * Ejecutar el job.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    public function handle(NotificationService $notificationService)
    {
        Log::info('Enviando notificación', [
            'usuario_id' => $this->usuario->id,
            'tipo' => $this->tipo,
        ]);

        try {
            // Enviar notificación según el tipo
            switch ($this->tipo) {
                case 'nueva_visita':
                    $this->enviarNotificacionNuevaVisita($notificationService);
                    break;
                
                case 'visita_proxima_vencer':
                    $this->enviarNotificacionVisitaProximaVencer($notificationService);
                    break;
                
                case 'cambio_estado_visita':
                    $this->enviarNotificacionCambioEstado($notificationService);
                    break;
                
                case 'reporte_generado':
                    $this->enviarNotificacionReporteGenerado($notificationService);
                    break;
                
                case 'visita_vencida':
                    $this->enviarNotificacionVisitaVencida($notificationService);
                    break;
                
                default:
                    Log::warning('Tipo de notificación no reconocido', [
                        'tipo' => $this->tipo,
                        'usuario_id' => $this->usuario->id,
                    ]);
            }

            Log::info('Notificación enviada exitosamente', [
                'usuario_id' => $this->usuario->id,
                'tipo' => $this->tipo,
            ]);

        } catch (\Exception $e) {
            Log::error('Error al enviar notificación', [
                'usuario_id' => $this->usuario->id,
                'tipo' => $this->tipo,
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);

            throw $e;
        }
    }

    /**
     * Enviar notificación de nueva visita.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    protected function enviarNotificacionNuevaVisita(NotificationService $notificationService)
    {
        $visita = $this->datos['visita'];
        
        $titulo = 'Nueva Visita Registrada';
        $mensaje = "Se ha registrado una nueva visita para {$visita->entidad_visitada} el día " . 
                   \Carbon\Carbon::parse($visita->fecha_hora_ingreso)->format('d/m/Y H:i');
        
        $notificationService->enviarNotificacionUsuario(
            $this->usuario,
            $titulo,
            $mensaje,
            'info',
            [
                'visita_id' => $visita->id,
                'tipo' => 'nueva_visita',
                'fecha' => $visita->fecha_hora_ingreso,
            ]
        );
    }

    /**
     * Enviar notificación de visita próxima a vencer.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    protected function enviarNotificacionVisitaProximaVencer(NotificationService $notificationService)
    {
        $visita = $this->datos['visita'];
        $tiempoRestante = $this->datos['tiempo_restante'];
        
        $titulo = 'Visita Próxima a Vencer';
        $mensaje = "La visita de {$visita->visitante_nombre} vencerá en {$tiempoRestante} minutos";
        
        $notificationService->enviarNotificacionUsuario(
            $this->usuario,
            $titulo,
            $mensaje,
            'warning',
            [
                'visita_id' => $visita->id,
                'tipo' => 'visita_proxima_vencer',
                'tiempo_restante' => $tiempoRestante,
            ]
        );
    }

    /**
     * Enviar notificación de cambio de estado.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    protected function enviarNotificacionCambioEstado(NotificationService $notificationService)
    {
        $visita = $this->datos['visita'];
        $estadoAnterior = $this->datos['estado_anterior'];
        $estadoNuevo = $this->datos['estado_nuevo'];
        
        $titulo = 'Cambio de Estado en Visita';
        $mensaje = "La visita de {$visita->visitante_nombre} cambió de estado: " .
                   ucfirst(str_replace('_', ' ', $estadoAnterior)) . ' → ' .
                   ucfirst(str_replace('_', ' ', $estadoNuevo));
        
        $notificationService->enviarNotificacionUsuario(
            $this->usuario,
            $titulo,
            $mensaje,
            'info',
            [
                'visita_id' => $visita->id,
                'tipo' => 'cambio_estado_visita',
                'estado_anterior' => $estadoAnterior,
                'estado_nuevo' => $estadoNuevo,
            ]
        );
    }

    /**
     * Enviar notificación de reporte generado.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    protected function enviarNotificacionReporteGenerado(NotificationService $notificationService)
    {
        $reporte = $this->datos['reporte'];
        
        $titulo = 'Reporte Generado';
        $mensaje = "El reporte '{$reporte->titulo}' ha sido generado exitosamente";
        
        $notificationService->enviarNotificacionUsuario(
            $this->usuario,
            $titulo,
            $mensaje,
            'success',
            [
                'reporte_id' => $reporte->id,
                'tipo' => 'reporte_generado',
                'archivo_url' => $reporte->archivo_url,
            ]
        );
    }

    /**
     * Enviar notificación de visita vencida.
     *
     * @param  \App\Services\NotificationService  $notificationService
     * @return void
     */
    protected function enviarNotificacionVisitaVencida(NotificationService $notificationService)
    {
        $visita = $this->datos['visita'];
        
        $titulo = 'Visita Vencida';
        $mensaje = "La visita de {$visita->visitante_nombre} ha vencido. Por favor, tome las acciones necesarias.";
        
        $notificationService->enviarNotificacionUsuario(
            $this->usuario,
            $titulo,
            $mensaje,
            'error',
            [
                'visita_id' => $visita->id,
                'tipo' => 'visita_vencida',
                'fecha_vencimiento' => $visita->fecha_hora_ingreso,
            ]
        );
    }

    /**
     * Manejar un fallo en el job.
     *
     * @param  \Throwable  $exception
     * @return void
     */
    public function failed(\Throwable $exception)
    {
        Log::error('Job EnviarNotificacionJob falló', [
            'usuario_id' => $this->usuario->id,
            'tipo' => $this->tipo,
            'error' => $exception->getMessage(),
        ]);

        // Notificar al administrador sobre el fallo crítico
        if ($this->attempts() >= $this->tries) {
            dispatch(new NotificarErrorJob(
                'Error crítico al enviar notificación',
                [
                    'usuario_id' => $this->usuario->id,
                    'tipo_notificacion' => $this->tipo,
                    'error' => $exception->getMessage(),
                    'job' => 'EnviarNotificacionJob',
                    'intentos' => $this->attempts(),
                ]
            ))->onQueue('notificaciones');
        }
    }
}