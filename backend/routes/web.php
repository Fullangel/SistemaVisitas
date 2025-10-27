<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return response()->json([
        'service' => 'Sistema Nacional de Visitas - API',
        'version' => '1.0.0',
        'status' => 'operational',
        'documentation' => '/api/documentation',
        'health_check' => '/health',
        'timestamp' => now()->toIso8601String()
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
        'service' => 'laravel-app'
    ]);
});