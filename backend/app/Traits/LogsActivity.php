<?php

namespace App\Traits;

use App\Services\AuditService;
use App\Services\MonitoringService;
use Illuminate\Support\Facades\Log;

trait LogsActivity
{
    /**
     * Servicio de auditoría
     */
    protected $auditService;

    /**
     * Servicio de monitoreo
     */
    protected $monitoringService;

    /**
     * Inicializar servicios de logging
     */
    protected function initializeLogging(): void
    {
        $this->auditService = app(AuditService::class);
        $this->monitoringService = app(MonitoringService::class);
    }

    /**
     * Loguear actividad de auditoría
     */
    protected function logAudit(string $action, string $model, $modelId = null, array $changes = [], string $description = null): void
    {
        if (!$this->auditService) {
            $this->initializeLogging();
        }

        $this->auditService->logActivity($action, $model, $modelId, $changes, $description);
    }

    /**
     * Loguear evento de monitoreo
     */
    protected function logMonitoring(string $event, array $data = [], string $level = 'info', string $channel = 'single'): void
    {
        if (!$this->monitoringService) {
            $this->initializeLogging();
        }

        $this->monitoringService->logEvent($event, $data, $level, $channel);
    }

    /**
     * Loguear información general
     */
    protected function logInfo(string $message, array $context = [], string $channel = 'single'): void
    {
        Log::channel($channel)->info($message, $context);
    }

    /**
     * Loguear advertencia
     */
    protected function logWarning(string $message, array $context = [], string $channel = 'single'): void
    {
        Log::channel($channel)->warning($message, $context);
    }

    /**
     * Loguear error
     */
    protected function logError(string $message, array $context = [], string $channel = 'single'): void
    {
        Log::channel($channel)->error($message, $context);
    }

    /**
     * Loguear actividad sospechosa
     */
    protected function logSuspiciousActivity(string $type, array $context = []): void
    {
        if (!$this->monitoringService) {
            $this->initializeLogging();
        }

        $this->monitoringService->logSuspiciousActivity($type, $context);
    }

    /**
     * Loguear intento de acceso
     */
    protected function logAccessAttempt(string $identifier, bool $success, array $context = []): void
    {
        if (!$this->monitoringService) {
            $this->initializeLogging();
        }

        $this->monitoringService->logAccessAttempt($identifier, $success, $context);
    }

    /**
     * Obtener contexto de request para logging
     */
    protected function getRequestContext(): array
    {
        return [
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'method' => request()->method(),
            'user_id' => auth()->id(),
            'timestamp' => now()->toIso8601String(),
        ];
    }

    /**
     * Sanitizar datos sensibles
     */
    protected function sanitizeData(array $data): array
    {
        $sensitiveKeys = ['password', 'password_confirmation', 'token', 'api_key', 'secret', 'pin', 'cvv'];
        
        foreach ($data as $key => $value) {
            foreach ($sensitiveKeys as $sensitiveKey) {
                if (stripos($key, $sensitiveKey) !== false) {
                    $data[$key] = '***REDACTED***';
                    break;
                }
            }
        }

        return $data;
    }
}