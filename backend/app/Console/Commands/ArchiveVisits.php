<?php

namespace App\Console\Commands;

use App\Services\VisitArchivingService;
use Illuminate\Console\Command;

class ArchiveVisits extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'visits:archive 
                            {--days=365 : Número de días de antigüedad para archivar}
                            {--batch=1000 : Tamaño del lote para procesar}
                            {--stats : Mostrar estadísticas de archivado}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Archivar visitas antiguas a tabla de particiones';

    /**
     * Execute the console command.
     */
    public function handle(VisitArchivingService $archivingService)
    {
        $days = $this->option('days');
        $batchSize = $this->option('batch');
        $showStats = $this->option('stats');

        if ($showStats) {
            $this->info('Obteniendo estadísticas de archivado...');
            $stats = $archivingService->getArchivingStats();
            
            $this->table(
                ['Métrica', 'Valor'],
                [
                    ['Total Archivadas', number_format($stats['total_archived'])],
                    ['Total Activas', number_format($stats['total_active'])],
                    ['Porcentaje Archivado', $stats['storage_percentage'] . '%'],
                    ['Fecha Más Antigua', $stats['oldest_archived'] ?? 'N/A'],
                    ['Fecha Más Reciente', $stats['newest_archived'] ?? 'N/A'],
                ]
            );

            if (!empty($stats['archived_by_year'])) {
                $this->info('\nArchivado por Año:');
                $yearData = [];
                foreach ($stats['archived_by_year'] as $year) {
                    $yearData[] = [
                        $year->year,
                        number_format($year->count),
                        $year->oldest_date,
                        $year->newest_date
                    ];
                }
                $this->table(
                    ['Año', 'Cantidad', 'Fecha Inicial', 'Fecha Final'],
                    $yearData
                );
            }
            return;
        }

        $this->info("Iniciando proceso de archivado de visitas...");
        $this->info("Archivando visitas con más de {$days} días de antigüedad");
        $this->info("Procesando lotes de {$batchSize} registros");

        $result = $archivingService->archiveOldVisits($days, $batchSize);

        if ($result['success']) {
            $this->info("✅ Proceso completado exitosamente");
            $this->info("📊 Visitas archivadas: " . number_format($result['archived_count']));
            if ($result['error_count'] > 0) {
                $this->warn("⚠️  Errores: " . number_format($result['error_count']));
            }
            $this->info("⏱️  Tiempo de ejecución: {$result['execution_time']} segundos");
        } else {
            $this->error("❌ Error: " . $result['message']);
            if (isset($result['error'])) {
                $this->error("Detalles: " . $result['error']);
            }
            return 1;
        }

        return 0;
    }
}