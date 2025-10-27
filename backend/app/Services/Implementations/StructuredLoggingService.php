<?php

namespace App\Services\Implementations;

use App\Services\BaseService;
use App\Models\AuditLog;
use App\Models\AuthenticationLog;
use App\Models\VisitLog;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Throwable;
use App\Services\Contracts\StructuredLoggingServiceInterface;

class StructuredLoggingService extends BaseService implements StructuredLoggingServiceInterface
{
    /**
     * Niveles de log
     */
    const LEVEL_EMERGENCY = 'emergency';
    const LEVEL_ALERT = 'alert';
    const LEVEL_CRITICAL = 'critical';
    const LEVEL_ERROR = 'error';
    const LEVEL_WARNING = 'warning';
    const LEVEL_NOTICE = 'notice';
    const LEVEL_INFO = 'info';
    const LEVEL_DEBUG = 'debug';

    /**
     * Categorías de log
     */
    const CATEGORY_AUTH = 'authentication';
    const CATEGORY_VISIT = 'visit';
    const CATEGORY_USER = 'user';
    const CATEGORY_EMPLOYEE = 'employee';
    const CATEGORY_SYSTEM = 'system';
    const CATEGORY_PERFORMANCE = 'performance';
    const CATEGORY_SECURITY = 'security';
    const CATEGORY_AUDIT = 'audit';
    const CATEGORY_ERROR = 'error';

    /**
     * Log estructurado para auditoría
     */
    public function logAudit(string $action, string $resourceType, $resourceId, array $data = []): void
    {
        $context = $this->buildContext($data);
        $context['category'] = self::CATEGORY_AUDIT;
        $context['action'] = $action;
        $context['resource_type'] = $resourceType;
        $context['resource_id'] = $resourceId;

        try {
            AuditLog::create([
                'user_id' => Auth::id(),
                'action' => $action,
                'resource_type' => $resourceType,
                'resource_id' => $resourceId,
                'description' => $data['description'] ?? $this->generateAuditDescription($action, $resourceType),
                'old_values' => $data['old_values'] ?? null,
                'new_values' => $data['new_values'] ?? null,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'status' => $data['status'] ?? 'success',
            ]);
        } catch (Throwable $e) {
            $this->logError('Failed to create audit log', ['exception' => $e->getMessage(), 'context' => $context]);
        }

        Log::channel('audit')->info("AUDIT: {$action} on {$resourceType}", $context);
    }

    /**
     * Log estructurado para autenticación
     */
    public function logAuthentication(string $action, ?int $userId, array $data = []): void
    {
        $context = $this->buildContext($data);
        $context['category'] = self::CATEGORY_AUTH;
        $context['action'] = $action;
        $context['user_id'] = $userId;

        try {
            AuthenticationLog::create([
                'user_id' => $userId,
                'action' => $action,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'status' => $data['status'] ?? 'success',
                'failure_reason' => $data['failure_reason'] ?? null,
                'session_id' => session()->getId() ?? null,
            ]);
        } catch (Throwable $e) {
            $this->logError('Failed to create authentication log', ['exception' => $e->getMessage(), 'context' => $context]);
        }

        Log::channel('security')->info("AUTH: {$action}", $context);
    }

    /**
     * Log estructurado para visitas
     */
    public function logVisit(string $action, $visitId, array $data = []): void
    {
        $context = $this->buildContext($data);
        $context['category'] = self::CATEGORY_VISIT;
        $context['action'] = $action;
        $context['visit_id'] = $visitId;

        try {
            VisitLog::create([
                'visit_id' => $visitId,
                'action' => $action,
                'user_id' => Auth::id(),
                'employee_id' => $data['employee_id'] ?? null,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
                'notes' => $data['notes'] ?? null,
            ]);
        } catch (Throwable $e) {
            $this->logError('Failed to create visit log', ['exception' => $e->getMessage(), 'context' => $context]);
        }

        Log::channel('visits')->info("VISIT: {$action}", $context);
    }

    /**
     * Log estructurado para errores
     */
    public function logError(string $message, array $data = []): void
    {
        $context = $this->buildContext($data);
        $context['category'] = self::CATEGORY_ERROR;
        $context['level'] = self::LEVEL_ERROR;

        if (isset($data['exception']) && $data['exception'] instanceof Throwable) {
            $exception = $data['exception'];
            $context['exception'] = [
                'class' => get_class($exception),
                'message' => $exception->getMessage(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ];
        }

        Log::channel('security')->error("ERROR: {$message}", $context);
    }

    /**
     * Log estructurado para performance
     */
    public function logPerformance(string $operation, float $duration, array $data = []): void
    {
        $context = $this->buildContext($data);
        $context['category'] = self::CATEGORY_PERFORMANCE;
        $context['operation'] = $operation;
        $context['duration_ms'] = $duration;
        $context['memory_usage'] = memory_get_usage(true);
        $context['memory_peak'] = memory_get_peak_usage(true);

        // Alertar si la operación es muy lenta
        if ($duration > 5000) { // 5 segundos
            Log::channel('security')->warning("SLOW_OPERATION: {$operation} took {$duration}ms", $context);
        } else {
            Log::channel('performance')->info("PERFORMANCE: {$operation}", $context);
        }
    }

    /**
     * Log estructurado para seguridad
     */
    public function logSecurity(string $action, array $data = []): void
    {
        $context = $this->buildContext($data);
        $context['category'] = self::CATEGORY_SECURITY;
        $context['action'] = $action;

        Log::channel('security')->warning("SECURITY: {$action}", $context);
    }

    /**
     * Log estructurado para sistema
     */
    public function logSystem(string $action, array $data = []): void
    {
        $context = $this->buildContext($data);
        $context['category'] = self::CATEGORY_SYSTEM;
        $context['action'] = $action;

        Log::channel('single')->info("SYSTEM: {$action}", $context);
    }

    /**
     * Construir contexto base para logs
     */
    protected function buildContext(array $data = []): array
    {
        $context = [
            'timestamp' => now()->toIso8601String(),
            'environment' => app()->environment(),
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ];

        if (Auth::check()) {
            $context['user_id'] = Auth::id();
            $context['user_email'] = Auth::user()->email;
            $context['user_role'] = Auth::user()->role->name ?? null;
        }

        if (request()->has('request_id')) {
            $context['request_id'] = request()->attributes->get('request_id');
        }

        // Sanitizar datos sensibles
        $data = $this->sanitizeSensitiveData($data);
        
        return array_merge($context, $data);
    }

    /**
     * Sanitizar datos sensibles
     */
    protected function sanitizeSensitiveData(array $data): array
    {
        $sensitiveKeys = [
            'password', 'password_confirmation', 'token', 'api_key', 'secret', 
            'pin', 'cvv', 'credit_card', 'card_number', 'ssn', 'social_security'
        ];
        
        foreach ($data as $key => $value) {
            foreach ($sensitiveKeys as $sensitiveKey) {
                if (stripos($key, $sensitiveKey) !== false) {
                    $data[$key] = '***REDACTED***';
                    break;
                }
            }
            
            // Recursivamente sanitizar arrays
            if (is_array($value)) {
                $data[$key] = $this->sanitizeSensitiveData($value);
            }
        }

        return $data;
    }

    /**
     * Generar descripción para auditoría
     */
    protected function generateAuditDescription(string $action, string $resourceType): string
    {
        $descriptions = [
            'created' => "Se creó un nuevo {$resourceType}",
            'updated' => "Se actualizó un {$resourceType}",
            'deleted' => "Se eliminó un {$resourceType}",
            'viewed' => "Se visualizó un {$resourceType}",
            'approved' => "Se aprobó un {$resourceType}",
            'rejected' => "Se rechazó un {$resourceType}",
            'cancelled' => "Se canceló un {$resourceType}",
            'completed' => "Se completó un {$resourceType}",
        ];

        return $descriptions[$action] ?? "Se ejecutó {$action} en {$resourceType}";
    }

    /**
     * Obtener estadísticas de logs
     */
    public function getLogStatistics(int $days = 7): array
    {
        $since = now()->subDays($days);
        
        return [
            'audit_logs' => AuditLog::where('created_at', '>=', $since)->count(),
            'authentication_logs' => AuthenticationLog::where('created_at', '>=', $since)->count(),
            'visit_logs' => VisitLog::where('created_at', '>=', $since)->count(),
            'error_logs' => $this->countLogEntries('security', 'ERROR', $days),
            'performance_logs' => $this->countLogEntries('performance', 'PERFORMANCE', $days),
            'security_logs' => $this->countLogEntries('security', 'SECURITY', $days),
        ];
    }

    /**
     * Contar entradas de log
     */
    protected function countLogEntries(string $channel, string $pattern, int $days): int
    {
        $logPath = storage_path("logs/{$channel}.log");
        
        if (!file_exists($logPath)) {
            return 0;
        }

        $count = 0;
        $since = now()->subDays($days);
        
        $handle = fopen($logPath, 'r');
        if ($handle) {
            while (($line = fgets($handle)) !== false) {
                if (str_contains($line, $pattern)) {
                    // Extraer timestamp del log
                    if (preg_match('/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2})\]/', $line, $matches)) {
                        $logTime = \Carbon\Carbon::parse($matches[1]);
                        if ($logTime >= $since) {
                            $count++;
                        }
                    }
                }
            }
            fclose($handle);
        }

        return $count;
    }
}