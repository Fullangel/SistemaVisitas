<?php

namespace App\Console\Commands;

use App\Models\Notification;
use Illuminate\Console\Command;

class CleanNotifications extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'notifications:clean 
                            {--days=90 : Número de días para considerar notificaciones antiguas}
                            {--dry-run : Mostrar lo que se eliminaría sin ejecutar}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpiar notificaciones antiguas del sistema';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $dryRun = $this->option('dry-run');

        $cutoffDate = now()->subDays($days);

        $query = Notification::where('created_at', '<', $cutoffDate);
        $count = $query->count();

        if ($count === 0) {
            $this->info("No hay notificaciones antiguas que limpiar (más de {$days} días).");
            return 0;
        }

        $this->info("Encontradas {$count} notificaciones antiguas (creadas antes de {$cutoffDate->format('Y-m-d')}).");

        if ($dryRun) {
            $this->info("Modo simulación activado. No se ejecutará la limpieza.");
            return 0;
        }

        if (!$this->confirm("¿Desea eliminar estas {$count} notificaciones?")) {
            $this->info('Operación cancelada.');
            return 0;
        }

        $this->info('Limpiando notificaciones antiguas...');
        
        $progressBar = $this->output->createProgressBar($count);
        $progressBar->setFormat('verbose');

        $deleted = 0;
        $batchSize = 1000;

        do {
            $batch = $query->limit($batchSize)->get();
            
            if ($batch->isEmpty()) {
                break;
            }

            foreach ($batch as $notification) {
                $notification->delete();
                $deleted++;
                $progressBar->advance();
            }

            // Liberar memoria
            $batch = null;
            gc_collect_cycles();

        } while ($deleted < $count);

        $progressBar->finish();
        $this->newLine();
        $this->info("✅ Proceso completado. {$deleted} notificaciones eliminadas.");

        return 0;
    }
}