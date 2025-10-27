<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Configuración de Auditoría
    |--------------------------------------------------------------------------
    |
    | Estas opciones configuran el comportamiento del sistema de auditoría
    |
    */

    'enabled' => env('AUDIT_ENABLED', true),

    // Retención de logs (días)
    'retention_days' => env('AUDIT_RETENTION_DAYS', 90),

    // Tipos de acciones a auditar
    'actions' => [
        'create',
        'update',
        'delete',
        'restore',
        'force_delete',
        'login',
        'logout',
        'password_change',
        'status_change',
    ],

    // Modelos a auditar (deben tener observers)
    'auditable_models' => [
        'App\Models\User',
        'App\Models\Employee',
        'App\Models\Visit',
        'App\Models\VisitLog',
        'App\Models\VisitAttachment',
    ],

    // Campos sensibles que deben ser sanitizados
    'sensitive_fields' => [
        'password',
        'password_confirmation',
        'current_password',
        'new_password',
        'new_password_confirmation',
        'api_token',
        'remember_token',
        'two_factor_secret',
        'two_factor_recovery_codes',
    ],

    // Configuración de logging
    'logging' => [
        'database' => [
            'enabled' => true,
            'table' => 'audit_logs',
        ],
        'file' => [
            'enabled' => true,
            'channel' => 'audit',
        ],
    ],

    // Configuración de monitoreo del sistema
    'monitoring' => [
        'enabled' => env('MONITORING_ENABLED', true),
        
        // Umbrales de alerta
        'thresholds' => [
            'memory_usage_percent' => 80,
            'disk_usage_percent' => 85,
            'query_time_ms' => 1000,
            'queue_size' => 100,
        ],
        
        // Verificaciones de salud
        'health_checks' => [
            'database' => true,
            'cache' => true,
            'queue' => true,
            'storage' => true,
        ],
    ],

    // Configuración de exportación
    'export' => [
        'max_rows' => 100000,
        'chunk_size' => 1000,
        'formats' => ['csv', 'json'],
    ],
];