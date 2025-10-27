<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\MonitoringService;
use App\Traits\LogsActivity;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class MonitoringController extends Controller
{
    use LogsActivity;

    public function __construct(MonitoringService $monitoringService)
    {
        $this->monitoringService = $monitoringService;
    }

    /**
     * Obtener estado de salud del sistema
     */
    public function health(Request $request): JsonResponse
    {
        try {
            $detailed = $request->boolean('detailed', false);
            
            $health = $this->monitoringService->checkHealth($detailed);
            
            $this->logMonitoring('system_health_check', [
                'detailed' => $detailed,
                'health_status' => $health['status'] ?? 'unknown',
            ]);

            return response()->json([
                'success' => true,
                'data' => $health,
            ]);
        } catch (\Exception $e) {
            $this->logError('system_health_check_failed', $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al verificar la salud del sistema',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Obtener estadísticas del sistema
     */
    public function statistics(Request $request): JsonResponse
    {
        try {
            $statistics = $this->monitoringService->getSystemStatistics();
            
            $this->logMonitoring('system_statistics_retrieved', [
                'statistics_count' => count($statistics),
            ]);

            return response()->json([
                'success' => true,
                'data' => $statistics,
            ]);
        } catch (\Exception $e) {
            $this->logError('system_statistics_failed', $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener estadísticas del sistema',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Obtener métricas de rendimiento
     */
    public function performance(Request $request): JsonResponse
    {
        try {
            $days = $request->integer('days', 7);
            $limit = min($request->integer('limit', 100), 1000);
            
            $metrics = $this->monitoringService->getPerformanceMetrics($days, $limit);
            
            $this->logMonitoring('performance_metrics_retrieved', [
                'days' => $days,
                'limit' => $limit,
                'metrics_count' => count($metrics),
            ]);

            return response()->json([
                'success' => true,
                'data' => $metrics,
            ]);
        } catch (\Exception $e) {
            $this->logError('performance_metrics_failed', $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener métricas de rendimiento',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Obtener logs recientes
     */
    public function recentLogs(Request $request): JsonResponse
    {
        try {
            $type = $request->string('type', 'all'); // all, error, warning, info
            $limit = min($request->integer('limit', 50), 500);
            
            $logs = $this->monitoringService->getRecentLogs($type, $limit);
            
            $this->logMonitoring('recent_logs_retrieved', [
                'type' => $type,
                'limit' => $limit,
                'logs_count' => count($logs),
            ]);

            return response()->json([
                'success' => true,
                'data' => $logs,
            ]);
        } catch (\Exception $e) {
            $this->logError('recent_logs_failed', $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al obtener logs recientes',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Limpiar caché de métricas
     */
    public function clearCache(Request $request): JsonResponse
    {
        try {
            $this->monitoringService->clearMetricsCache();
            
            $this->logMonitoring('metrics_cache_cleared', [
                'user_id' => auth()->id(),
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Caché de métricas limpiado exitosamente',
            ]);
        } catch (\Exception $e) {
            $this->logError('clear_metrics_cache_failed', $e->getMessage());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al limpiar caché de métricas',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}