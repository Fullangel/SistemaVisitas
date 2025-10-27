<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Services\AuditService;
use Carbon\Carbon;

class CleanupAuditLogs extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'audit:cleanup {--days=90 : Number of days to keep logs}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up old audit logs from database and files';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle(AuditService $auditService)
    {
        $days = $this->option('days');
        
        $this->info("Starting audit log cleanup for logs older than {$days} days...");

        try {
            // Limpiar logs de base de datos
            $deletedCount = $auditService->cleanupOldLogs($days);
            $this->info("Deleted {$deletedCount} audit log records from database.");

            // Limpiar archivos de log antiguos
            $this->cleanupLogFiles($days);
            
            $this->info('Audit log cleanup completed successfully.');
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            $this->error('Error during audit log cleanup: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }

    /**
     * Limpiar archivos de log antiguos
     */
    protected function cleanupLogFiles(int $days): void
    {
        $logPaths = [
            storage_path('logs/audit.log'),
            storage_path('logs/security.log'),
            storage_path('logs/visits.log'),
        ];

        $cutoffDate = Carbon::now()->subDays($days);

        foreach ($logPaths as $logPath) {
            if (file_exists($logPath)) {
                $this->cleanupSingleLogFile($logPath, $cutoffDate);
            }

            // Limpiar archivos rotados
            $this->cleanupRotatedLogs(dirname($logPath), basename($logPath), $cutoffDate);
        }
    }

    /**
     * Limpiar un archivo de log individual
     */
    protected function cleanupSingleLogFile(string $filePath, Carbon $cutoffDate): void
    {
        $fileDate = Carbon::createFromTimestamp(filemtime($filePath));
        
        if ($fileDate->lt($cutoffDate)) {
            if (unlink($filePath)) {
                $this->info("Deleted old log file: {$filePath}");
            } else {
                $this->warn("Failed to delete log file: {$filePath}");
            }
        }
    }

    /**
     * Limpiar archivos de log rotados
     */
    protected function cleanupRotatedLogs(string $directory, string $baseName, Carbon $cutoffDate): void
    {
        $pattern = $directory . '/' . $baseName . '-*';
        $rotatedFiles = glob($pattern);

        foreach ($rotatedFiles as $file) {
            $fileDate = Carbon::createFromTimestamp(filemtime($file));
            
            if ($fileDate->lt($cutoffDate)) {
                if (unlink($file)) {
                    $this->info("Deleted old rotated log file: {$file}");
                } else {
                    $this->warn("Failed to delete rotated log file: {$file}");
                }
            }
        }
    }
}