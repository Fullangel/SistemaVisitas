<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

class MonitoringService extends BaseService
{
    /**
     * Registrar evento de monitoreo
     */
    public function logEvent(string $event, array $data = [], string $level = 'info', string $channel = 'single'): void
    {
        $context = [
            'event' => $event,
            'data' => $data,
            'timestamp' => now()->toIso8601String(),
            'memory_usage' => memory_get_usage(true),
            'memory_peak' => memory_get_peak_usage(true),
        ];

        Log::channel($channel)->{$level}("MONITOR: {$event}", $context);
    }

    /**
     * Monitorear rendimiento de consultas
     */
    public function monitorQueryPerformance(): void
    {
        DB::listen(function ($query) {
            $threshold = 1000; // 1 segundo en milisegundos
            
            if ($query->time > $threshold) {
                $this->logEvent('slow_query', [
                    'sql' => $query->sql,
                    'bindings' => $query->bindings,
                    'time' => $query->time,
                    'connection' => $query->connectionName,
                ], 'warning', 'security');
            }
        });
    }

    /**
     * Obtener estadísticas del sistema (alias para getSystemStats)
     */
    public function getSystemStatistics(): array
    {
        return $this->getSystemStats();
    }

    /**
     * Obtener métricas de rendimiento
     */
    public function getPerformanceMetrics(int $days = 7, int $limit = 100): array
    {
        $metrics = [];
        
        // Obtener logs de rendimiento de los últimos días
        $logPath = storage_path('logs/performance.log');
        if (file_exists($logPath)) {
            $lines = $this->tailFile($logPath, $limit);
            foreach ($lines as $line) {
                if (str_contains($line, 'PERFORMANCE')) {
                    $metrics[] = $this->parsePerformanceLog($line);
                }
            }
        }

        return $metrics;
    }

    /**
     * Obtener logs recientes
     */
    public function getRecentLogs(string $type = 'all', int $limit = 50): array
    {
        $logs = [];
        
        $logFiles = match ($type) {
            'error' => ['laravel.log'],
            'warning' => ['laravel.log'],
            'info' => ['laravel.log', 'audit.log'],
            default => ['laravel.log', 'audit.log', 'security.log', 'visits.log']
        };

        foreach ($logFiles as $logFile) {
            $logPath = storage_path('logs/' . $logFile);
            if (file_exists($logPath)) {
                $lines = $this->tailFile($logPath, $limit);
                foreach ($lines as $line) {
                    if ($type === 'all' || str_contains(strtolower($line), strtolower($type))) {
                        $logs[] = [
                            'file' => $logFile,
                            'content' => $line,
                            'timestamp' => now()->toDateTimeString(),
                        ];
                    }
                }
            }
        }

        // Ordenar por timestamp (si está disponible)
        usort($logs, function ($a, $b) {
            return strcmp($b['timestamp'], $a['timestamp']);
        });

        return array_slice($logs, 0, $limit);
    }

    /**
     * Limpiar caché de métricas
     */
    public function clearMetricsCache(): void
    {
        // Limpiar caché de Laravel
        cache()->flush();
        
        // Limpiar caché de configuración
        config()->set('monitoring.cache_cleared', now()->toDateTimeString());
        
        $this->logEvent('metrics_cache_cleared', 'Cache de métricas limpiado exitosamente');
    }

    /**
     * Leer las últimas líneas de un archivo
     */
    private function tailFile(string $file, int $lines = 100): array
    {
        if (!file_exists($file)) {
            return [];
        }

        $output = [];
        $handle = fopen($file, 'r');
        
        if (!$handle) {
            return [];
        }

        // Ir al final del archivo
        fseek($handle, 0, SEEK_END);
        $pos = ftell($handle);
        $count = 0;

        // Leer hacia atrás
        while ($pos > 0 && $count < $lines) {
            $line = '';
            $char = '';

            // Leer caracter por caracter hacia atrás
            while ($pos > 0 && $char !== "\n") {
                fseek($handle, --$pos);
                $char = fgetc($handle);
                if ($char !== "\n") {
                    $line = $char . $line;
                }
            }

            if (!empty($line)) {
                $output[] = $line;
                $count++;
            }

            // Moverse al inicio de la línea anterior
            if ($pos > 0) {
                fseek($handle, --$pos);
            }
        }

        fclose($handle);
        return array_reverse($output);
    }

    /**
     * Parsear log de rendimiento
     */
    private function parsePerformanceLog(string $log): array
    {
        // Parsear formato: [timestamp] PERFORMANCE: mensaje con datos
        if (preg_match('/\[(.*?)\] PERFORMANCE: (.*)/', $log, $matches)) {
            return [
                'timestamp' => $matches[1],
                'message' => $matches[2],
                'raw' => $log,
            ];
        }

        return [
            'timestamp' => now()->toDateTimeString(),
            'message' => $log,
            'raw' => $log,
        ];
    }

    /**
     * Obtener estadísticas de caché
     */
    protected function getCacheStats(): array
    {
        try {
            $stats = [
                'driver' => config('cache.default'),
                'hits' => Cache::get('cache_hits', 0),
                'misses' => Cache::get('cache_misses', 0),
            ];

            $stats['hit_rate'] = $stats['hits'] + $stats['misses'] > 0 
                ? round(($stats['hits'] / ($stats['hits'] + $stats['misses'])) * 100, 2) 
                : 0;

            return $stats;
        } catch (\Exception $e) {
            return ['error' => 'Unable to get cache stats'];
        }
    }

    /**
     * Obtener estadísticas de base de datos
     */
    protected function getDatabaseStats(): array
    {
        try {
            return [
                'connection' => config('database.default'),
                'size' => $this->getDatabaseSize(),
                'tables' => $this->getTableCounts(),
            ];
        } catch (\Exception $e) {
            return ['error' => 'Unable to get database stats'];
        }
    }

    /**
     * Obtener estadísticas de cola
     */
    protected function getQueueStats(): array
    {
        try {
            return [
                'connection' => config('queue.default'),
                'size' => $this->getQueueSize(),
                'failed' => $this->getFailedJobsCount(),
            ];
        } catch (\Exception $e) {
            return ['error' => 'Unable to get queue stats'];
        }
    }

    /**
     * Obtener tamaño de base de datos
     */
    protected function getDatabaseSize(): int
    {
        $database = config('database.connections.mysql.database');
        
        $result = DB::select("SELECT SUM(data_length + index_length) as size FROM information_schema.tables WHERE table_schema = ?", [$database]);
        
        return $result[0]->size ?? 0;
    }

    /**
     * Obtener conteos de tablas principales
     */
    protected function getTableCounts(): array
    {
        $tables = ['users', 'employees', 'visits', 'audit_logs'];
        $counts = [];

        foreach ($tables as $table) {
            try {
                $counts[$table] = DB::table($table)->count();
            } catch (\Exception $e) {
                $counts[$table] = 'error';
            }
        }

        return $counts;
    }

    /**
     * Obtener tamaño de cola
     */
    protected function getQueueSize(): int
    {
        return DB::table('jobs')->count();
    }

    /**
     * Obtener trabajos fallidos
     */
    protected function getFailedJobsCount(): int
    {
        return DB::table('failed_jobs')->count();
    }

    /**
     * Registrar intento de acceso
     */
    public function logAccessAttempt(string $identifier, bool $success, array $context = []): void
    {
        $event = $success ? 'login_success' : 'login_failed';
        $level = $success ? 'info' : 'warning';
        
        $this->logEvent($event, array_merge([
            'identifier' => $identifier,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
        ], $context), $level, 'security');
    }

    /**
     * Registrar actividad sospechosa
     */
    public function logSuspiciousActivity(string $type, array $context = []): void
    {
        $this->logEvent("suspicious_{$type}", array_merge([
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
        ], $context), 'warning', 'security');
    }

    /**
     * Verificar salud del sistema
     */
    public function checkSystemHealth(bool $detailed = false): array
    {
        $issues = [];
        $stats = $this->getSystemStats();

        // Verificar memoria
        $memoryUsage = $stats['memory_usage']['current'];
        $memoryLimit = $this->parseMemoryLimit($stats['memory_usage']['limit']);
        
        if ($memoryLimit > 0 && $memoryUsage > ($memoryLimit * 0.9)) {
            $issues[] = 'High memory usage detected';
        }

        // Verificar espacio en disco
        $diskUsage = $stats['disk_usage']['total'] - $stats['disk_usage']['free'];
        $diskPercentage = ($diskUsage / $stats['disk_usage']['total']) * 100;
        
        if ($diskPercentage > 90) {
            $issues[] = 'Low disk space';
        }

        // Verificar cola de trabajos fallidos
        if ($stats['queue_stats']['failed'] > 10) {
            $issues[] = 'High number of failed jobs';
        }

        return [
            'healthy' => empty($issues),
            'status' => empty($issues) ? 'healthy' : 'unhealthy',
            'timestamp' => now()->toDateTimeString(),
            'issues' => $issues,
            'stats' => $detailed ? $stats : null,
        ];
    }

    /**
     * Parsear límite de memoria
     */
    protected function parseMemoryLimit(string $limit): int
    {
        if ($limit === '-1') {
            return -1; // Sin límite
        }

        $limit = trim($limit);
        $last = strtolower($limit[strlen($limit) - 1]);
        $value = (int) $limit;

        switch ($last) {
            case 'g':
                $value *= 1024;
                // no break
            case 'm':
                $value *= 1024;
                // no break
            case 'k':
                $value *= 1024;
        }

        return $value;
    }
}