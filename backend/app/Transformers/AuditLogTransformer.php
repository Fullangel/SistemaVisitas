<?php

namespace App\Transformers;

use App\Models\AuditLog;

class AuditLogTransformer extends BaseTransformer
{
    /**
     * Transformar un log de auditoría
     */
    public function transform($auditLog): array
    {
        if (!$auditLog instanceof AuditLog) {
            return [];
        }

        return [
            'id' => $auditLog->id,
            'action' => $auditLog->action,
            'model' => $auditLog->model,
            'model_id' => $auditLog->model_id,
            'user' => $this->transformUser($auditLog),
            'ip_address' => $auditLog->ip_address,
            'user_agent' => $auditLog->user_agent,
            'url' => $auditLog->url,
            'changes' => $auditLog->changes,
            'created_at' => $this->formatDate($auditLog->created_at),
            'created_at_human' => $auditLog->created_at->diffForHumans(),
        ];
    }

    /**
     * Transformar información del usuario
     */
    protected function transformUser($auditLog): array
    {
        if (!$auditLog->user) {
            return [
                'id' => null,
                'name' => $auditLog->user_name ?? 'Sistema',
                'email' => null,
            ];
        }

        return [
            'id' => $auditLog->user->id,
            'name' => $auditLog->user->name,
            'email' => $auditLog->user->email,
        ];
    }

    /**
     * Transformar para lista simplificada
     */
    public function transformSimple($auditLog): array
    {
        if (!$auditLog instanceof AuditLog) {
            return [];
        }

        return [
            'id' => $auditLog->id,
            'action' => $auditLog->action,
            'model' => $auditLog->model,
            'model_id' => $auditLog->model_id,
            'user_name' => $auditLog->user_name ?? 'Sistema',
            'created_at' => $this->formatDate($auditLog->created_at),
            'created_at_human' => $auditLog->created_at->diffForHumans(),
        ];
    }

    /**
     * Transformar para dashboard
     */
    public function transformForDashboard($auditLog): array
    {
        if (!$auditLog instanceof AuditLog) {
            return [];
        }

        return [
            'id' => $auditLog->id,
            'action' => $auditLog->action,
            'model' => $auditLog->model,
            'user_name' => $auditLog->user_name ?? 'Sistema',
            'ip_address' => $auditLog->ip_address,
            'created_at' => $this->formatDate($auditLog->created_at),
            'time_ago' => $auditLog->created_at->diffForHumans(),
        ];
    }

    /**
     * Incluir relación de usuario
     */
    public function includeUser($auditLog)
    {
        if (!$auditLog->user) {
            return null;
        }

        $userTransformer = app(UserTransformer::class);
        return $this->item($auditLog->user, $userTransformer, 'user');
    }
}