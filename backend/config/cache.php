<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Cache Store
    |--------------------------------------------------------------------------
    |
    | Esta opción controla la conexión de caché predeterminada que se utilizará
    | cuando se utilice el caché. Esta conexión se utiliza si no se especifica
    | otro nombre de conexión explícitamente cuando se ejecuta una función de caché.
    |
    */

    'default' => env('CACHE_DRIVER', 'redis'),

    /*
    |--------------------------------------------------------------------------
    | Cache Stores
    |--------------------------------------------------------------------------
    |
    | Aquí puede definir todos los "almacenes" de caché para su aplicación,
    | así como sus controladores. Incluso puede definir múltiples almacenes
    | para el mismo controlador de caché para agrupar tipos de elementos almacenados.
    |
    */

    'stores' => [

        'apc' => [
            'driver' => 'apc',
        ],

        'array' => [
            'driver' => 'array',
            'serialize' => false,
        ],

        'database' => [
            'driver' => 'database',
            'table' => 'cache',
            'connection' => null,
            'lock_connection' => null,
        ],

        'file' => [
            'driver' => 'file',
            'path' => storage_path('framework/cache/data'),
            'lock_path' => storage_path('framework/cache/data'),
        ],

        'memcached' => [
            'driver' => 'memcached',
            'persistent_id' => env('MEMCACHED_PERSISTENT_ID'),
            'sasl' => [
                env('MEMCACHED_USERNAME'),
                env('MEMCACHED_PASSWORD'),
            ],
            'options' => [
                // Memcached::OPT_CONNECT_TIMEOUT => 2000,
            ],
            'servers' => [
                [
                    'host' => env('MEMCACHED_HOST', '127.0.0.1'),
                    'port' => env('MEMCACHED_PORT', 11211),
                    'weight' => 100,
                ],
            ],
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'cache',
            'lock_connection' => 'default',
        ],

        'dynamodb' => [
            'driver' => 'dynamodb',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'table' => env('DYNAMODB_CACHE_TABLE', 'cache'),
            'endpoint' => env('DYNAMODB_ENDPOINT'),
        ],

        'octane' => [
            'driver' => 'octane',
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Cache Key Prefix
    |--------------------------------------------------------------------------
    |
    | Cuando se utilizan los almacenes de caché basados en RAM como APC o
    | Memcached, puede ser útil especificar un prefijo que se agregue a todas
    | las claves de caché para evitar colisiones con otras aplicaciones.
    |
    */

    'prefix' => env('CACHE_PREFIX', 'sistema_visitas_nacional_cache_'),

    /*
    |--------------------------------------------------------------------------
    | Cache TTL (Time To Live)
    |--------------------------------------------------------------------------
    |
    | Configuración de tiempos de vida predeterminados para diferentes tipos
    | de datos almacenados en caché.
    |
    */

    'ttl' => [
        'configuracion' => 3600, // 1 hora
        'estadisticas' => 300,   // 5 minutos
        'visitas' => 600,        // 10 minutos
        'usuarios' => 1800,      // 30 minutos
        'reportes' => 7200,      // 2 horas
        'entidades' => 86400,    // 24 horas
    ],

];