<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'logout', 'register'],

    'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],

    'allowed_origins' => $this->getAllowedOrigins(),

    'allowed_origins_patterns' => [],

    'allowed_headers' => [
        'Content-Type',
        'X-Requested-With',
        'Authorization',
        'X-CSRF-TOKEN',
        'X-XSRF-TOKEN',
        'Accept',
        'Accept-Language',
        'X-API-KEY',
        'X-Device-ID',
        'X-Request-ID'
    ],

    'exposed_headers' => [
        'X-Request-ID',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset'
    ],

    'max_age' => 86400, // 24 horas

    'supports_credentials' => true,
];

/**
 * Obtener orígenes permitidos según el entorno
 */
function getAllowedOrigins(): array
{
    $origins = [];
    
    // Entorno local
    if (app()->environment('local')) {
        $origins = array_merge($origins, [
            'http://localhost:3000',
            'http://localhost:5173',
            'http://127.0.0.1:3000',
            'http://127.0.0.1:5173',
        ]);
    }
    
    // Entorno de desarrollo
    if (app()->environment('development')) {
        $origins = array_merge($origins, [
            env('FRONTEND_URL', 'https://dev.tudominio.com'),
            'https://*.vercel.app', // Para deploys de Vercel
            'https://*.netlify.app', // Para deploys de Netlify
        ]);
    }
    
    // Entorno de producción
    if (app()->environment('production')) {
        $origins = array_merge($origins, [
            env('FRONTEND_URL'),
            env('FRONTEND_URL_ALT'), // URL alternativa si existe
        ]);
    }
    
    // Filtrar valores nulos o vacíos
    return array_filter($origins);
}