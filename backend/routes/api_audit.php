<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuditController;
use App\Http\Controllers\Api\MonitoringController;

/*
|--------------------------------------------------------------------------
| API Routes - Audit Management
|--------------------------------------------------------------------------
|
| Rutas para la gestión de logs de auditoría
|
*/

Route::middleware(['auth:api', 'permission:view_audit_logs'])->group(function () {
    // Listar logs de auditoría
    Route::get('/audit/logs', [AuditController::class, 'index'])
        ->name('api.audit.logs.index');

    // Obtener estadísticas de auditoría
    Route::get('/audit/statistics', [AuditController::class, 'statistics'])
        ->name('api.audit.statistics');

    // Exportar logs de auditoría
    Route::get('/audit/export', [AuditController::class, 'export'])
        ->name('api.audit.export');
});

// Rutas de monitoreo (requieren permisos especiales)
Route::middleware(['auth:api', 'permission:view_system_monitoring'])->group(function () {
    // Health check del sistema
    Route::get('/system/health', [MonitoringController::class, 'health'])
        ->name('api.system.health');

    // Estadísticas del sistema
    Route::get('/system/statistics', [MonitoringController::class, 'statistics'])
        ->name('api.system.statistics');

    // Métricas de rendimiento
    Route::get('/system/performance', [MonitoringController::class, 'performance'])
        ->name('api.system.performance');

    // Logs recientes del sistema
    Route::get('/system/logs', [MonitoringController::class, 'recentLogs'])
        ->name('api.system.logs');

    // Limpiar caché de métricas
    Route::post('/system/clear-cache', [MonitoringController::class, 'clearCache'])
        ->name('api.system.clear-cache');
});