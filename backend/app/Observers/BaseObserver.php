<?php

namespace App\Observers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

abstract class BaseObserver
{
    /**
     * Registrar actividad de auditoría
     *
     * @param Model $model
     * @param string $action
     * @param array $changes
     * @return void
     */
    protected function logActivity(Model $model, string $action, array $changes = [])
    {
        $user = Auth::user();
        $modelName = class_basename($model);
        $modelId = $model->getKey();

        $logData = [
            'action' => $action,
            'model' => $modelName,
            'model_id' => $modelId,
            'user_id' => $user ? $user->id : null,
            'user_name' => $user ? $user->full_name : 'System',
            'ip_address' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'url' => request()->fullUrl(),
            'changes' => $changes,
            'created_at' => now()->toDateTimeString()
        ];

        // Log en archivo
        Log::channel('audit')->info("{$action} {$modelName} #{$modelId}", $logData);

        // Guardar en base de datos si existe el modelo de auditoría
        if (class_exists('App\Models\AuditLog')) {
            \App\Models\AuditLog::create($logData);
        }
    }

    /**
     * Obtener cambios entre valores original y actual
     *
     * @param Model $model
     * @return array
     */
    protected function getChanges(Model $model): array
    {
        $changes = [];
        
        foreach ($model->getDirty() as $attribute => $value) {
            $changes[$attribute] = [
                'old' => $model->getOriginal($attribute),
                'new' => $value
            ];
        }

        return $changes;
    }

    /**
     * Limpiar datos sensibles
     *
     * @param array $data
     * @param array $sensitiveFields
     * @return array
     */
    protected function sanitizeData(array $data, array $sensitiveFields = ['password', 'token', 'secret']): array
    {
        foreach ($sensitiveFields as $field) {
            if (isset($data[$field])) {
                $data[$field] = '***MASKED***';
            }
        }

        return $data;
    }
}