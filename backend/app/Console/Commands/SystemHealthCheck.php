<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\MonitoringService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Queue;

class SystemHealthCheck extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'system:health {--detailed : Show detailed system statistics}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check system health and performance';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(MonitoringService $monitoringService)
    {
        $this->info('Checking system health...');

        try {
            $health = $monitoringService->checkSystemHealth();
            
            if ($health['healthy']) {
                $this->info('✓ System is healthy');
            } else {
                $this->warn('⚠ System has issues:');
                foreach ($health['issues'] as $issue) {
                    $this->warn("  - {$issue}");
                }
            }

            if ($this->option('detailed')) {
                $this->showDetailedStats($health['stats']);
            }

            // Verificar componentes específicos
            $this->checkComponents($monitoringService);

            return $health['healthy'] ? Command::SUCCESS : Command::FAILURE;
            
        } catch (\Exception $e) {
            $this->error('Error during health check: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    /**
     * Mostrar estadísticas detalladas
     */
    protected function showDetailedStats(array $stats): void
    {
        $this->info('\n=== System Statistics ===');

        // Memoria
        $this->info('Memory Usage:');
        $this->line(sprintf(
            '  Current: %s MB, Peak: %s MB, Limit: %s',
            round($stats['memory_usage']['current'] / 1024 / 1024, 2),
            round($stats['memory_usage']['peak'] / 1024 / 1024, 2),
            $stats['memory_usage']['limit']
        ));

        // Disco
        $this->info('Disk Usage:');
        $diskUsed = $stats['disk_usage']['total'] - $stats['disk_usage']['free'];
        $diskPercentage = ($diskUsed / $stats['disk_usage']['total']) * 100;
        $this->line(sprintf(
            '  Used: %s GB / %s GB (%.1f%%)',
            round($diskUsed / 1024 / 1024 / 1024, 2),
            round($stats['disk_usage']['total'] / 1024 / 1024 / 1024, 2),
            $diskPercentage
        ));

        // Caché
        $this->info('Cache Stats:');
        $this->line(sprintf(
            '  Driver: %s, Hit Rate: %.1f%%',
            $stats['cache_stats']['driver'],
            $stats['cache_stats']['hit_rate']
        ));

        // Base de datos
        $this->info('Database Stats:');
        $this->line(sprintf(
            '  Connection: %s, Size: %s MB',
            $stats['database_stats']['connection'],
            round($stats['database_stats']['size'] / 1024 / 1024, 2)
        ));

        // Tablas principales
        $this->line('  Table Counts:');
        foreach ($stats['database_stats']['tables'] as $table => $count) {
            $this->line("    {$table}: {$count}");
        }

        // Cola
        $this->info('Queue Stats:');
        $this->line(sprintf(
            '  Connection: %s, Pending: %d, Failed: %d',
            $stats['queue_stats']['connection'],
            $stats['queue_stats']['size'],
            $stats['queue_stats']['failed']
        ));
    }

    /**
     * Verificar componentes específicos
     */
    protected function checkComponents(MonitoringService $monitoringService): void
    {
        $this->info('\n=== Component Checks ===');

        // Verificar conexión a base de datos
        $this->checkDatabaseConnection();

        // Verificar conexión a caché
        $this->checkCacheConnection();

        // Verificar conexión a cola
        $this->checkQueueConnection();
    }

    /**
     * Verificar conexión a base de datos
     */
    protected function checkDatabaseConnection(): void
    {
        try {
            DB::connection()->getPdo();
            $this->info('✓ Database connection: OK');
        } catch (\Exception $e) {
            $this->error('✗ Database connection: FAILED - ' . $e->getMessage());
        }
    }

    /**
     * Verificar conexión a caché
     */
    protected function checkCacheConnection(): void
    {
        try {
            Cache::put('health_check', 'ok', 1);
            $value = Cache::get('health_check');
            Cache::forget('health_check');
            
            if ($value === 'ok') {
                $this->info('✓ Cache connection: OK');
            } else {
                $this->error('✗ Cache connection: FAILED - Unexpected value');
            }
        } catch (\Exception $e) {
            $this->error('✗ Cache connection: FAILED - ' . $e->getMessage());
        }
    }

    /**
     * Verificar conexión a cola
     */
    protected function checkQueueConnection(): void
    {
        try {
            $connection = Queue::connection();
            $this->info('✓ Queue connection: OK');
        } catch (\Exception $e) {
            $this->error('✗ Queue connection: FAILED - ' . $e->getMessage());
        }
    }
}