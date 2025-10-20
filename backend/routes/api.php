<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\RoleController;
use App\Http\Controllers\VisitController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\HeadquarterController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\RegionController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Rutas públicas de autenticación
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Rutas protegidas de autenticación
Route::middleware(['jwt.auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
    Route::get('/user', [AuthController::class, 'profile']);
});

// Rutas protegidas con autenticación JWT
Route::middleware(['jwt.auth', 'rate.role'])->group(function () {
    
    // Rutas de administrador (acceso total)
    Route::middleware(['role:admin'])->group(function () {
        // Gestión de empleados (solo admin)
        Route::prefix('admin')->group(function () {
            // Gestión de usuarios (solo admin)
            Route::get('/users', [UserController::class, 'index']);
            Route::post('/users', [UserController::class, 'store']);
            Route::get('/users/{id}', [UserController::class, 'show']);
            Route::put('/users/{id}', [UserController::class, 'update']);
            Route::delete('/users/{id}', [UserController::class, 'destroy']);
            
            Route::get('/employees', [EmployeeController::class, 'index']);
            Route::post('/employees', [EmployeeController::class, 'store']);
            Route::get('/employees/{id}', [EmployeeController::class, 'show']);
            Route::put('/employees/{id}', [EmployeeController::class, 'update']);
            Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);
            
            // Gestión de roles (solo admin)
            Route::get('/roles', [RoleController::class, 'index']);
            Route::post('/roles', [RoleController::class, 'store']);
            Route::get('/roles/{id}', [RoleController::class, 'show']);
            Route::put('/roles/{id}', [RoleController::class, 'update']);
            Route::delete('/roles/{id}', [RoleController::class, 'destroy']);
            
            // Gestión de departamentos (solo admin)
            Route::get('/departments', [DepartmentController::class, 'index']);
            Route::post('/departments', [DepartmentController::class, 'store']);
            Route::get('/departments/{id}', [DepartmentController::class, 'show']);
            Route::put('/departments/{id}', [DepartmentController::class, 'update']);
            Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);
            
            // Gestión de sedes (solo admin)
            Route::get('/headquarters', [HeadquarterController::class, 'index']);
            Route::post('/headquarters', [HeadquarterController::class, 'store']);
            Route::get('/headquarters/{id}', [HeadquarterController::class, 'show']);
            Route::put('/headquarters/{id}', [HeadquarterController::class, 'update']);
            Route::delete('/headquarters/{id}', [HeadquarterController::class, 'destroy']);
            
            // Gestión de cargos/designaciones (solo admin)
            Route::get('/designations', [DesignationController::class, 'index']);
            Route::post('/designations', [DesignationController::class, 'store']);
            Route::get('/designations/{id}', [DesignationController::class, 'show']);
            Route::put('/designations/{id}', [DesignationController::class, 'update']);
            Route::delete('/designations/{id}', [DesignationController::class, 'destroy']);
            
            // Gestión de regiones (solo admin)
            Route::get('/regions', [RegionController::class, 'index']);
            Route::post('/regions', [RegionController::class, 'store']);
            Route::get('/regions/{id}', [RegionController::class, 'show']);
            Route::put('/regions/{id}', [RegionController::class, 'update']);
            Route::delete('/regions/{id}', [RegionController::class, 'destroy']);
        });
        
        // Rutas de supervisor (lectura y actualización)
        Route::middleware(['role:admin,supervisor'])->group(function () {
            Route::get('/employees', [EmployeeController::class, 'index']);
            Route::get('/employees/{id}', [EmployeeController::class, 'show']);
            Route::put('/employees/{id}', [EmployeeController::class, 'update']);
        
            Route::get('/departments', [DepartmentController::class, 'index']);
            Route::get('/departments/{id}', [DepartmentController::class, 'show']);
        
            Route::get('/headquarters', [HeadquarterController::class, 'index']);
            Route::get('/headquarters/{id}', [HeadquarterController::class, 'show']);
        
            Route::get('/designations', [DesignationController::class, 'index']);
            Route::get('/designations/{id}', [DesignationController::class, 'show']);
        
            Route::get('/regions', [RegionController::class, 'index']);
            Route::get('/regions/{id}', [RegionController::class, 'show']);
        });
    
        // Rutas de recepción (solo visitas)
        Route::middleware(['role:admin,supervisor,recepcion'])->group(function () {
            Route::get('/visits', [VisitController::class, 'index']);
            Route::post('/visits', [VisitController::class, 'store']);
            Route::get('/visits/{id}', [VisitController::class, 'show']);
            Route::put('/visits/{id}', [VisitController::class, 'update']);
            Route::patch('/visits/{id}/status', [VisitController::class, 'updateStatus']);
        });
    
        // Rutas de empleado (solo lectura de visitas)
        Route::middleware(['role:admin,supervisor,recepcion,employee'])->group(function () {
            Route::get('/visits', [VisitController::class, 'index']);
            Route::get('/visits/{id}', [VisitController::class, 'show']);
        });
    });
});