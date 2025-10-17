<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
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

// Rutas protegidas
Route::middleware('auth:api')->group(function () {
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh', [AuthController::class, 'refresh']);

    // Rutas de visitas
    Route::get('/visits', [VisitController::class, 'index']);
    Route::post('/visits', [VisitController::class, 'store']);
    Route::get('/visits/{id}', [VisitController::class, 'show']);
    Route::put('/visits/{id}', [VisitController::class, 'update']);
    Route::delete('/visits/{id}', [VisitController::class, 'destroy']);
    Route::patch('/visits/{id}/status', [VisitController::class, 'updateStatus']);

    // Rutas de empleados
    Route::get('/employees', [EmployeeController::class, 'index']);
    Route::post('/employees', [EmployeeController::class, 'store']);
    Route::get('/employees/{id}', [EmployeeController::class, 'show']);
    Route::put('/employees/{id}', [EmployeeController::class, 'update']);
    Route::delete('/employees/{id}', [EmployeeController::class, 'destroy']);

    // Rutas de departamentos
    Route::get('/departments', [DepartmentController::class, 'index']);
    Route::post('/departments', [DepartmentController::class, 'store']);
    Route::get('/departments/{id}', [DepartmentController::class, 'show']);
    Route::put('/departments/{id}', [DepartmentController::class, 'update']);
    Route::delete('/departments/{id}', [DepartmentController::class, 'destroy']);

    // Rutas de sedes
    Route::get('/headquarters', [HeadquarterController::class, 'index']);
    Route::post('/headquarters', [HeadquarterController::class, 'store']);
    Route::get('/headquarters/{id}', [HeadquarterController::class, 'show']);
    Route::put('/headquarters/{id}', [HeadquarterController::class, 'update']);
    Route::delete('/headquarters/{id}', [HeadquarterController::class, 'destroy']);

    // Rutas de cargos/designaciones
    Route::get('/designations', [DesignationController::class, 'index']);
    Route::post('/designations', [DesignationController::class, 'store']);
    Route::get('/designations/{id}', [DesignationController::class, 'show']);
    Route::put('/designations/{id}', [DesignationController::class, 'update']);
    Route::delete('/designations/{id}', [DesignationController::class, 'destroy']);

    // Rutas de regiones
    Route::get('/regions', [RegionController::class, 'index']);
    Route::post('/regions', [RegionController::class, 'store']);
    Route::get('/regions/{id}', [RegionController::class, 'show']);
    Route::put('/regions/{id}', [RegionController::class, 'update']);
    Route::delete('/regions/{id}', [RegionController::class, 'destroy']);
});