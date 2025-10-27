<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use App\Repositories\Interfaces\UserRepositoryInterface;
use App\Repositories\Interfaces\VisitRepositoryInterface;
use App\Repositories\Interfaces\EmployeeRepositoryInterface;
use App\Repositories\Eloquent\UserRepository;
use App\Repositories\Eloquent\VisitRepository;
use App\Repositories\Eloquent\EmployeeRepository;
use App\Models\User;
use App\Models\Visit;
use App\Models\Employee;

class RepositoryServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     *
     * @return void
     */
    public function register()
    {
        // Registrar UserRepository
        $this->app->bind(UserRepositoryInterface::class, function ($app) {
            return new UserRepository(new User());
        });

        // Registrar VisitRepository
        $this->app->bind(VisitRepositoryInterface::class, function ($app) {
            return new VisitRepository(new Visit());
        });

        // Registrar EmployeeRepository
        $this->app->bind(EmployeeRepositoryInterface::class, function ($app) {
            return new EmployeeRepository(new Employee());
        });
    }

    /**
     * Bootstrap services.
     *
     * @return void
     */
    public function boot()
    {
        //
    }
}