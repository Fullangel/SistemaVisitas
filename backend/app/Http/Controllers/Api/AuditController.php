<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AuditService;
use App\Transformers\AuditLogTransformer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuditController extends Controller
{
    use \App\Traits\LogsActivity;

    protected $auditService;
    protected $auditLogTransformer;

    public function __construct(AuditService $auditService, AuditLogTransformer $auditLogTransformer)
    {
        $this->auditService = $auditService;
        $this->auditLogTransformer = $auditLogTransformer;
        $this->initializeLogging();
    }

    /**
     * Obtener logs de auditoría con filtros
     */
    public function index(Request $request)
    {
        try {
            $this->authorize('view_audit_logs');

            $filters = [
                'action' => $request->get('action'),
                'model' => $request->get('model'),
                'user_id' => $request->get('user_id'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
            ];

            // Limpiar filtros vacíos
            $filters = array_filter($filters);

            $perPage = $request->get('per_page', 15);
            $logs = $this->auditService->getAuditLogs($filters, $perPage);

            // Transformar respuesta
            $transformedLogs = $this->auditLogTransformer->transformPaginated($logs);

            // Log actividad
            $this->logAudit('viewed', 'audit_logs', null, [
                'filters' => $filters,
                'per_page' => $perPage,
                'total_results' => $logs->total(),
            ]);

            return $this->successResponse($transformedLogs, 'Audit logs retrieved successfully');

        } catch (\Exception $e) {
            $this->logError('Error retrieving audit logs', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return $this->errorResponse('Error retrieving audit logs', 500);
        }
    }

    /**
     * Obtener estadísticas de auditoría
     */
    public function statistics()
    {
        try {
            $this->authorize('view_audit_statistics');

            $statistics = $this->auditService->getAuditStatistics();

            // Log actividad
            $this->logAudit('viewed_statistics', 'audit_logs', null, [
                'timestamp' => now(),
            ]);

            return $this->successResponse($statistics, 'Audit statistics retrieved successfully');

        } catch (\Exception $e) {
            $this->logError('Error retrieving audit statistics', [
                'error' => $e->getMessage(),
            ]);

            return $this->errorResponse('Error retrieving audit statistics', 500);
        }
    }

    /**
     * Exportar logs de auditoría
     */
    public function export(Request $request)
    {
        try {
            $this->authorize('export_audit_logs');

            $filters = [
                'action' => $request->get('action'),
                'model' => $request->get('model'),
                'user_id' => $request->get('user_id'),
                'date_from' => $request->get('date_from'),
                'date_to' => $request->get('date_to'),
            ];

            // Limpiar filtros vacíos
            $filters = array_filter($filters);

            // Obtener todos los logs sin paginación para exportar
            $logs = $this->auditService->getAuditLogs($filters, 10000); // Límite razonable

            // Preparar datos para CSV
            $csvData = [];
            $csvData[] = ['Fecha', 'Usuario', 'Acción', 'Modelo', 'ID Modelo', 'IP', 'Cambios'];

            foreach ($logs as $log) {
                $csvData[] = [
                    $log->created_at->format('Y-m-d H:i:s'),
                    $log->user_name ?? 'Sistema',
                    $log->action,
                    $log->model,
                    $log->model_id ?? 'N/A',
                    $log->ip_address ?? 'N/A',
                    $this->formatChanges($log->changes),
                ];
            }

            // Log actividad
            $this->logAudit('exported', 'audit_logs', null, [
                'filters' => $filters,
                'total_exported' => count($logs),
            ]);

            // Generar respuesta CSV
            $filename = 'audit_logs_' . now()->format('Y-m-d_H-i-s') . '.csv';
            
            return response()->stream(function () use ($csvData) {
                $handle = fopen('php://output', 'w');
                foreach ($csvData as $row) {
                    fputcsv($handle, $row);
                }
                fclose($handle);
            }, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);

        } catch (\Exception $e) {
            $this->logError('Error exporting audit logs', [
                'error' => $e->getMessage(),
                'request' => $request->all(),
            ]);

            return $this->errorResponse('Error exporting audit logs', 500);
        }
    }

    /**
     * Formatear cambios para CSV
     */
    protected function formatChanges($changes): string
    {
        if (empty($changes)) {
            return 'Sin cambios';
        }

        if (is_array($changes)) {
            return json_encode($changes, JSON_UNESCAPED_UNICODE);
        }

        return (string) $changes;
    }
}