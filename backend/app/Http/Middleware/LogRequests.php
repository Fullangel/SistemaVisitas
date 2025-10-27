<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Services\MonitoringService;
use App\Services\Contracts\StructuredLoggingServiceInterface;
use Illuminate\Support\Facades\Log;

class LogRequests
{
    protected $monitoringService;
    protected $structuredLogging;

    public function __construct(MonitoringService $monitoringService, StructuredLoggingServiceInterface $structuredLogging)
    {
        $this->monitoringService = $monitoringService;
        $this->structuredLogging = $structuredLogging;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        $startTime = microtime(true);
        $requestId = uniqid('req_');

        // Agregar request ID al request para tracking
        $request->attributes->set('request_id', $requestId);

        // Log request entrante
        $this->logIncomingRequest($request, $requestId);

        // Procesar request
        $response = $next($request);

        // Calcular duración
        $duration = round((microtime(true) - $startTime) * 1000, 2);

        // Log response
        $this->logOutgoingResponse($request, $response, $requestId, $duration);

        // Monitorear performance
        $this->monitorPerformance($request, $duration);

        // Log estructurado de la visita
        $this->logStructuredVisit($request, $response, $requestId, $duration);

        return $response;
    }

    /**
     * Log request entrante
     */
    protected function logIncomingRequest(Request $request, string $requestId): void
    {
        $context = [
            'request_id' => $requestId,
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => auth()->id(),
        ];

        // Sanitizar datos sensibles
        $data = $this->sanitizeSensitiveData($request->all());
        if (!empty($data)) {
            $context['data'] = $data;
        }

        Log::channel('visits')->info("REQUEST: {$request->method()} {$request->path()}", $context);
    }

    /**
     * Log response saliente
     */
    protected function logOutgoingResponse(Request $request, $response, string $requestId, float $duration): void
    {
        $context = [
            'request_id' => $requestId,
            'status_code' => method_exists($response, 'status') ? $response->status() : 200,
            'duration_ms' => $duration,
            'memory_usage' => memory_get_peak_usage(true),
        ];

        // Log errores en canal separado
        $statusCode = method_exists($response, 'status') ? $response->status() : 200;
        $channel = $statusCode >= 400 ? 'security' : 'visits';
        $level = $statusCode >= 500 ? 'error' : ($statusCode >= 400 ? 'warning' : 'info');

        Log::channel($channel)->{$level}("RESPONSE: {$request->method()} {$request->path()} - {$statusCode}", $context);
    }

    /**
     * Monitorear performance
     */
    protected function monitorPerformance(Request $request, float $duration): void
    {
        // Alertar si el request tomó demasiado tiempo
        if ($duration > 5000) { // 5 segundos
            $this->monitoringService->logEvent('slow_request', [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'duration_ms' => $duration,
                'ip' => $request->ip(),
                'user_id' => auth()->id(),
            ], 'warning', 'security');
        }

        // Monitorear uso de memoria
        $memoryUsage = memory_get_peak_usage(true);
        $memoryLimit = ini_get('memory_limit');
        $memoryLimitBytes = $this->parseMemoryLimit($memoryLimit);

        if ($memoryLimitBytes > 0 && $memoryUsage > ($memoryLimitBytes * 0.8)) {
            $this->monitoringService->logEvent('high_memory_usage', [
                'url' => $request->fullUrl(),
                'memory_usage' => $memoryUsage,
                'memory_limit' => $memoryLimit,
                'ip' => $request->ip(),
                'user_id' => auth()->id(),
            ], 'warning', 'security');
        }
    }

    /**
     * Sanitizar datos sensibles
     */
    protected function sanitizeSensitiveData(array $data): array
    {
        $sensitiveKeys = ['password', 'password_confirmation', 'token', 'api_key', 'secret', 'pin', 'cvv', 'credit_card'];
        
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

    /**
     * Parsear límite de memoria
     */
    protected function parseMemoryLimit(string $limit): int
    {
        if ($limit === '-1') {
            return -1;
        }

        $limit = trim($limit);
        $last = strtolower($limit[strlen($limit) - 1]);
        $value = (int) $limit;

        switch ($last) {
            case 'g':
                $value *= 1024;
            case 'm':
                $value *= 1024;
            case 'k':
                $value *= 1024;
        }

        return $value;
    }

    /**
     * Log estructurado de la visita
     */
    protected function logStructuredVisit(Request $request, $response, string $requestId, float $duration): void
    {
        $statusCode = method_exists($response, 'status') ? $response->status() : 200;
        
        $this->structuredLogging->logVisit('request_completed', $requestId, [
            'method' => $request->method(),
            'url' => $request->fullUrl(),
            'status_code' => $statusCode,
            'duration_ms' => $duration,
            'ip' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'user_id' => auth()->id(),
            'memory_usage' => memory_get_peak_usage(true),
            'request_id' => $requestId,
        ]);

        // Log de performance lento
        if ($duration > 5000) {
            $this->structuredLogging->logPerformance('slow_request', $duration, [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'ip' => $request->ip(),
                'user_id' => auth()->id(),
                'request_id' => $requestId,
            ]);
        }

        // Log de errores
        if ($statusCode >= 400) {
            $this->structuredLogging->logError("HTTP {$statusCode} error", [
                'url' => $request->fullUrl(),
                'method' => $request->method(),
                'status_code' => $statusCode,
                'ip' => $request->ip(),
                'user_id' => auth()->id(),
                'request_id' => $requestId,
            ]);
        }
    }
}