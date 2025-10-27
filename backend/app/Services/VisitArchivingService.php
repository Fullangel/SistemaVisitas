<?php

namespace App\Services;

use App\Models\Visit;
use App\Models\VisitArchive;
use App\Models\VisitLog;
use App\Models\VisitAttachment;
use App\Models\VisitLogPartition;
use App\Models\VisitAttachmentPartition;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class VisitArchivingService
{
    /**
     * Archivar visitas antiguas
     */
    public function archiveOldVisits(int $daysOld = 365, int $batchSize = 1000): array
    {
        $archivedCount = 0;
        $errorCount = 0;
        $startTime = microtime(true);

        try {
            DB::beginTransaction();

            // Obtener visitas para archivar (completadas o canceladas y antiguas)
            $visitsToArchive = Visit::where('visit_date', '<', Carbon::now()->subDays($daysOld))
                ->whereIn('status', ['completed', 'cancelled'])
                ->limit($batchSize)
                ->get();

            foreach ($visitsToArchive as $visit) {
                try {
                    $this->archiveSingleVisit($visit);
                    $archivedCount++;
                } catch (\Exception $e) {
                    $errorCount++;
                    Log::error('Error archivando visita ' . $visit->id, [
                        'error' => $e->getMessage(),
                        'visit_id' => $visit->id
                    ]);
                }
            }

            DB::commit();

            $executionTime = round(microtime(true) - $startTime, 2);

            Log::info('Proceso de archivado completado', [
                'archived_count' => $archivedCount,
                'error_count' => $errorCount,
                'execution_time' => $executionTime,
                'days_old' => $daysOld
            ]);

            return [
                'success' => true,
                'archived_count' => $archivedCount,
                'error_count' => $errorCount,
                'execution_time' => $executionTime,
                'message' => "Se archivaron {$archivedCount} visitas exitosamente"
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error en proceso de archivado', [
                'error' => $e->getMessage()
            ]);

            return [
                'success' => false,
                'error' => $e->getMessage(),
                'message' => 'Error al archivar visitas'
            ];
        }
    }

    /**
     * Archivar una sola visita
     */
    private function archiveSingleVisit(Visit $visit): void
    {
        try {
            DB::beginTransaction();

            // Mover visita a tabla particionada
            DB::statement("
                INSERT INTO visit_partitions 
                SELECT *, NOW() as archived_at FROM visits WHERE id = ?
            ", [$visit->id]);

            // Mover logs relacionados a tabla particionada
            DB::statement("
                INSERT INTO visit_log_partitions (visit_id, action, status_from, status_to, user_id, notes, log_date, created_at)
                SELECT visit_id, action, status_from, status_to, user_id, notes, log_date, created_at 
                FROM visit_logs WHERE visit_id = ?
            ", [$visit->id]);

            // Mover adjuntos relacionados a tabla particionada
            DB::statement("
                INSERT INTO visit_attachment_partitions (visit_id, file_name, file_path, file_size, file_type, uploaded_by, upload_date, created_at)
                SELECT visit_id, file_name, file_path, file_size, file_type, uploaded_by, DATE(created_at) as upload_date, created_at 
                FROM visit_attachments WHERE visit_id = ?
            ", [$visit->id]);

            // Eliminar de tablas originales
            VisitAttachment::where('visit_id', $visit->id)->delete();
            VisitLog::where('visit_id', $visit->id)->delete();
            $visit->forceDelete();

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error archivando visita: ' . $e->getMessage());
            throw $e;
        }
    }

    /**
     * Obtener estadísticas de archivado
     */
    public function getArchivingStats(): array
    {
        $totalArchived = VisitArchive::count();
        $totalActive = Visit::count();
        
        $oldestArchived = VisitArchive::orderBy('visit_date', 'asc')->first();
        $newestArchived = VisitArchive::orderBy('visit_date', 'desc')->first();

        $archivedByYear = VisitArchive::selectRaw('
                YEAR(visit_date) as year,
                COUNT(*) as count,
                MIN(visit_date) as oldest_date,
                MAX(visit_date) as newest_date
            ')
            ->groupBy('year')
            ->orderBy('year', 'desc')
            ->get();

        return [
            'total_archived' => $totalArchived,
            'total_active' => $totalActive,
            'oldest_archived' => $oldestArchived?->visit_date,
            'newest_archived' => $newestArchived?->visit_date,
            'archived_by_year' => $archivedByYear,
            'storage_percentage' => $this->calculateStoragePercentage()
        ];
    }

    /**
     * Calcular porcentaje de almacenamiento usado
     */
    private function calculateStoragePercentage(): float
    {
        // Estimación basada en número de registros
        $totalRecords = VisitArchive::count() + Visit::count();
        $archivedRecords = VisitArchive::count();

        return $totalRecords > 0 ? round(($archivedRecords / $totalRecords) * 100, 2) : 0;
    }

    /**
     * Buscar en visitas archivadas
     */
    public function searchArchivedVisits(array $filters = [], int $perPage = 15)
    {
        $query = VisitArchive::query();

        // Filtros comunes
        if (!empty($filters['visit_date_from'])) {
            $query->where('visit_date', '>=', $filters['visit_date_from']);
        }

        if (!empty($filters['visit_date_to'])) {
            $query->where('visit_date', '<=', $filters['visit_date_to']);
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['visitor_name'])) {
            $query->where('visitor_name', 'like', '%' . $filters['visitor_name'] . '%');
        }

        if (!empty($filters['visitor_identification'])) {
            $query->where('visitor_identification', $filters['visitor_identification']);
        }

        if (!empty($filters['employee_id'])) {
            $query->where('employee_id', $filters['employee_id']);
        }

        if (!empty($filters['department_id'])) {
            $query->where('department_id', $filters['department_id']);
        }

        if (!empty($filters['headquarter_id'])) {
            $query->where('headquarter_id', $filters['headquarter_id']);
        }

        return $query->orderBy('visit_date', 'desc')
            ->paginate($perPage);
    }

    /**
     * Restaurar visita archivada
     */
    public function restoreArchivedVisit(int $archivedVisitId): array
    {
        try {
            $archivedVisit = VisitArchive::findOrFail($archivedVisitId);

            DB::beginTransaction();

            // Restaurar visita principal
            $restoredVisit = Visit::create($archivedVisit->toArray());

            // Restaurar logs (si existen en tabla de particiones)
            $archivedLogs = DB::table('visit_log_partitions')
                ->where('visit_id', $archivedVisit->id)
                ->get();

            foreach ($archivedLogs as $log) {
                $logData = (array) $log;
                unset($logData['id']); // Permitir que se genere nuevo ID
                VisitLog::create($logData);
            }

            // Eliminar de archivado
            $archivedVisit->delete();

            DB::commit();

            return [
                'success' => true,
                'message' => 'Visita restaurada exitosamente',
                'visit' => $restoredVisit
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            return [
                'success' => false,
                'error' => $e->getMessage(),
                'message' => 'Error al restaurar visita'
            ];
        }
    }
}