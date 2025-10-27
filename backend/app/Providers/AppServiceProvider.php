<?php

namespace App\Providers;

use App\Models\VisitLog;
use App\Models\VisitAttachment;
use App\Observers\VisitLogObserver;
use App\Observers\VisitAttachmentObserver;
use App\Observers\UserObserver;
use App\Observers\EmployeeObserver;
use App\Observers\VisitObserver;
use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Interfaces\VisitRepositoryInterface;
use App\Repositories\Eloquent\VisitRepository;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use App\Repositories\Eloquent\EmployeeRepository;
use App\Repositories\Interfaces\DepartmentRepositoryInterface;
use App\Repositories\Eloquent\DepartmentRepository;
use App\Repositories\Interfaces\HeadquarterRepositoryInterface;
use App\Repositories\Eloquent\HeadquarterRepository;
use App\Models\User;
use App\Models\Visit;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Headquarter;
use App\Services\Contracts\UserServiceInterface;
use App\Services\Implementations\UserService;
use App\Services\Contracts\VisitServiceInterface;
use App\Services\Implementations\VisitService;
use App\Services\Contracts\EmployeeServiceInterface;
use App\Services\Implementations\EmployeeService;
use App\Services\Contracts\StructuredLoggingServiceInterface;
use App\Services\Implementations\StructuredLoggingService;
use App\Services\GlobalStoreService;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        // Registrar repositorios
        $this->app->bind(UserRepositoryInterface::class, function ($app) {
            return new UserRepository(new User());
        });

        $this->app->bind(VisitRepositoryInterface::class, function ($app) {
            return new VisitRepository(new Visit());
        });

        $this->app->bind(EmployeeRepositoryInterface::class, function ($app) {
            return new EmployeeRepository(new Employee());
        });

        $this->app->bind(DepartmentRepositoryInterface::class, function ($app) {
            return new DepartmentRepository(new Department());
        });

        $this->app->bind(HeadquarterRepositoryInterface::class, function ($app) {
            return new HeadquarterRepository(new Headquarter());
        });

        // Registrar servicios
        $this->app->bind(UserServiceInterface::class, UserService::class);
        $this->app->bind(VisitServiceInterface::class, VisitService::class);
        $this->app->bind(EmployeeServiceInterface::class, EmployeeService::class);
        $this->app->bind(StructuredLoggingServiceInterface::class, StructuredLoggingService::class);
        
        // Registrar Global Store como singleton
        $this->app->singleton('global.store', function ($app) {
            return GlobalStoreService::getInstance();
        });
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        // Registrar observers
        VisitLog::observe(VisitLogObserver::class);
        VisitAttachment::observe(VisitAttachmentObserver::class);
        User::observe(UserObserver::class);
        Employee::observe(EmployeeObserver::class);
        Visit::observe(VisitObserver::class);
        
        // Configurar paginación por defecto
        \Illuminate\Pagination\Paginator::useBootstrap();
    }
}