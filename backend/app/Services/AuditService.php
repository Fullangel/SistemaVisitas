<?php

namespace App\Services;

use App\Models\AuditLog;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Request;

class AuditService extends BaseService
{
    protected $auditLog;

    public function __construct(AuditLog $auditLog)
    {
        $this->auditLog = $auditLog;
    }

    /**
     * Registrar una actividad de auditoría
     */
    public function logActivity(string $action, string $model, $modelId = null, array $changes = [], string $description = null): void
    {
        try {
            $user = Auth::user();
            
            $auditData = [
                'action' => $action,
                'model' => $model,
                'model_id' => $modelId,
                'user_id' => $user?->id,
                'user_name' => $user?->name ?? 'Sistema',
                'ip_address' => Request::ip(),
                'user_agent' => Request::userAgent(),
                'url' => Request::fullUrl(),
                'changes' => $changes,
                'description' => $description,
            ];

            // Guardar en base de datos
            $this->auditLog->create($auditData);

            // También loguear en archivo
            $this->logToFile($action, $model, $modelId, $changes, $description);
            
        } catch (\Exception $e) {
            // Si falla la auditoría, al menos loguear el error
            Log::error('Error al registrar auditoría', [
                'error' => $e->getMessage(),
                'action' => $action,
                'model' => $model,
                'model_id' => $modelId,
            ]);
        }
    }

    /**
     * Loguear en archivo de auditoría
     */
    protected function logToFile(string $action, string $model, $modelId = null, array $changes = [], string $description = null): void
    {
        $user = Auth::user();
        $context = [
            'user_id' => $user?->id,
            'user_name' => $user?->name ?? 'Sistema',
            'ip' => Request::ip(),
            'model' => $model,
            'model_id' => $modelId,
            'changes' => $changes,
            'description' => $description,
        ];

        Log::channel('audit')->info("AUDIT: {$action} - {$model}" . ($modelId ? " ID: {$modelId}" : ''), $context);
    }

    /**
     * Obtener logs de auditoría con filtros
     */
    public function getAuditLogs(array $filters = [], int $perPage = 15)
    {
        $query = $this->auditLog->with('user')
            ->when(isset($filters['action']), function ($q) use ($filters) {
                return $q->byAction($filters['action']);
            })
            ->when(isset($filters['model']), function ($q) use ($filters) {
                return $q->byModel($filters['model']);
            })
            ->when(isset($filters['user_id']), function ($q) use ($filters) {
                return $q->byUser($filters['user_id']);
            })
            ->when(isset($filters['date_from']), function ($q) use ($filters) {
                return $q->fromDate($filters['date_from']);
            })
            ->when(isset($filters['date_to']), function ($q) use ($filters) {
                return $q->toDate($filters['date_to']);
            });

        return $query->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    /**
     * Obtener estadísticas de auditoría
     */
    public function getAuditStatistics(): array
    {
        $stats = [
            'total_actions' => $this->auditLog->count(),
            'actions_today' => $this->auditLog->whereDate('created_at', today())->count(),
            'actions_this_week' => $this->auditLog->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()])->count(),
            'actions_this_month' => $this->auditLog->whereMonth('created_at', now()->month)->count(),
        ];

        // Top acciones
        $stats['top_actions'] = $this->auditLog
            ->select('action', \DB::raw('COUNT(*) as count'))
            ->groupBy('action')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        // Top modelos
        $stats['top_models'] = $this->auditLog
            ->select('model', \DB::raw('COUNT(*) as count'))
            ->groupBy('model')
            ->orderBy('count', 'desc')
            ->limit(5)
            ->get();

        return $stats;
    }

    /**
     * Limpiar logs antiguos
     */
    public function cleanupOldLogs(int $days = 90): int
    {
        $cutoffDate = now()->subDays($days);
        
        return $this->auditLog
            ->where('created_at', '<', $cutoffDate)
            ->delete();
    }
}