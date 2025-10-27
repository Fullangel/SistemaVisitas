<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Services\VisitService;
use App\Services\EmployeeService;
use App\Services\AuditService;
use App\Services\MonitoringService;
use App\Repositories\Interfaces\VisitRepositoryInterface;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use App\Repositories\Interfaces\UserRepositoryInterface;

class ServiceServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // Registrar VisitService
        $this->app->singleton(VisitService::class, function ($app) {
            return new VisitService(
                $app->make(VisitRepositoryInterface::class),
                $app->make(EmployeeRepositoryInterface::class)
            );
        });

        // Registrar EmployeeService
        $this->app->singleton(EmployeeService::class, function ($app) {
            return new EmployeeService(
                $app->make(EmployeeRepositoryInterface::class),
                $app->make(UserRepositoryInterface::class)
            );
        });

        // Registrar AuditService
        $this->app->singleton(AuditService::class, function ($app) {
            return new AuditService(
                $app->make(\App\Models\AuditLog::class)
            );
        });

        // Registrar MonitoringService
        $this->app->singleton(MonitoringService::class, function ($app) {
            return new MonitoringService();
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        // Inicializar monitoreo de queries lentas
        $this->app->make(\App\Services\MonitoringService::class)->monitorQueryPerformance();
    }
}