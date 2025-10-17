<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Queue Connection Name
    |--------------------------------------------------------------------------
    |
    | El nombre de conexión de cola predeterminada de Laravel especifica qué
    | conexión de cola debe utilizarse de forma predeterminada para las nuevas
    | tareas de cola que se agregan a la cola.
    |
    */

    'default' => env('QUEUE_CONNECTION', 'redis'),

    /*
    |--------------------------------------------------------------------------
    | Queue Connections
    |--------------------------------------------------------------------------
    |
    | Aquí puede configurar la información de conexión para cada servidor que
    | es utilizado por su aplicación. Se ha agregado una configuración predeterminada
    | para cada backend incluido con Laravel. También es libre de agregar más.
    |
    */

    'connections' => [

        'sync' => [
            'driver' => 'sync',
        ],

        'database' => [
            'driver' => 'database',
            'table' => 'jobs',
            'queue' => 'default',
            'retry_after' => 90,
            'after_commit' => false,
        ],

        'beanstalkd' => [
            'driver' => 'beanstalkd',
            'host' => 'localhost',
            'queue' => 'default',
            'retry_after' => 90,
            'block_for' => 0,
            'after_commit' => false,
        ],

        'sqs' => [
            'driver' => 'sqs',
            'key' => env('AWS_ACCESS_KEY_ID'),
            'secret' => env('AWS_SECRET_ACCESS_KEY'),
            'prefix' => env('SQS_PREFIX', 'https://sqs.us-east-1.amazonaws.com/your-account-id'),
            'queue' => env('SQS_QUEUE', 'default'),
            'suffix' => env('SQS_SUFFIX'),
            'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
            'after_commit' => false,
        ],

        'redis' => [
            'driver' => 'redis',
            'connection' => 'queue',
            'queue' => env('REDIS_QUEUE', 'default'),
            'retry_after' => 90,
            'block_for' => null,
            'after_commit' => false,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Failed Queue Jobs
    |--------------------------------------------------------------------------
    |
    | Estas opciones configuran el comportamiento de almacenamiento de trabajos
    | fallidos, como la tabla de base de datos que contendrá los registros de
    | trabajos que no se pudieron procesar y el número de reintentos.
    |
    */

    'failed' => [
        'driver' => env('QUEUE_FAILED_DRIVER', 'database-uuids'),
        'database' => env('DB_CONNECTION', 'mysql'),
        'table' => 'failed_jobs',
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Priorities
    |--------------------------------------------------------------------------
    |
    | Configuración de colas con diferentes prioridades para el sistema de visitas.
    | Las colas con mayor prioridad se procesan primero.
    |
    */

    'priorities' => [
        'alta' => [
            'queue' => 'alta',
            'connection' => 'redis',
            'retry_after' => 30,
        ],
        'normal' => [
            'queue' => 'normal',
            'connection' => 'redis',
            'retry_after' => 60,
        ],
        'baja' => [
            'queue' => 'baja',
            'connection' => 'redis',
            'retry_after' => 120,
        ],
        'reportes' => [
            'queue' => 'reportes',
            'connection' => 'redis',
            'retry_after' => 180,
        ],
        'notificaciones' => [
            'queue' => 'notificaciones',
            'connection' => 'redis',
            'retry_after' => 60,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Queue Workers
    |--------------------------------------------------------------------------
    |
    | Configuración de workers para procesar las colas de manera eficiente.
    |
    */

    'workers' => [
        'default' => [
            'connection' => 'redis',
            'queue' => ['alta', 'normal', 'baja'],
            'sleep' => 3,
            'timeout' => 90,
            'tries' => 3,
            'max_jobs' => 1000,
            'max_time' => 3600,
            'memory' => 256,
        ],
        'reportes' => [
            'connection' => 'redis',
            'queue' => ['reportes'],
            'sleep' => 5,
            'timeout' => 300,
            'tries' => 2,
            'max_jobs' => 100,
            'max_time' => 7200,
            'memory' => 512,
        ],
        'notificaciones' => [
            'connection' => 'redis',
            'queue' => ['notificaciones'],
            'sleep' => 2,
            'timeout' => 60,
            'tries' => 3,
            'max_jobs' => 500,
            'max_time' => 1800,
            'memory' => 128,
        ],
    ],

];