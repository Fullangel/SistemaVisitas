<?php

use Laravel\Horizon\Horizon;

return [

    /*
    |--------------------------------------------------------------------------
    | Horizon Domain
    |--------------------------------------------------------------------------
    |
    | Este es el subdominio donde Horizon será accesible desde. Si esta opción
    | se establece en nulo, Horizon se pondrá en el mismo dominio que la
    | aplicación. De lo contrario, este valor se utilizará como subdominio.
    |
    */

    'domain' => env('HORIZON_DOMAIN', null),

    /*
    |--------------------------------------------------------------------------
    | Horizon Path
    |--------------------------------------------------------------------------
    |
    | Esta es la razón de acceso a la interfaz de usuario de Horizon. Esta
    | opción controla a qué URI se accederá cuando se acceda a Horizon.
    |
    */

    'path' => env('HORIZON_PATH', 'horizon'),

    /*
    |--------------------------------------------------------------------------
    | Horizon Redis Connection
    |--------------------------------------------------------------------------
    |
    | Esta es el nombre de la conexión Redis donde Horizon almacenará los
    | metadatos de las colas. Debe corresponder a una conexión en su
    | configuración de base de datos Redis.
    |
    */

    'use' => 'horizon',

    /*
    |--------------------------------------------------------------------------
    | Horizon Redis Prefix
    |--------------------------------------------------------------------------
    |
    | Este prefijo se utilizará cuando se almacenen todos los datos de Horizon
    | en Redis. Este prefijo puede ser útil si tienes múltiples aplicaciones
    | utilizando el mismo servidor Redis. Se recomienda mantener este corto.
    |
    */

    'prefix' => env('HORIZON_PREFIX', 'horizon:'),

    /*
    |--------------------------------------------------------------------------
    | Horizon Route Middleware
    |--------------------------------------------------------------------------
    |
    | Estos middleware se ejecutarán antes de cada ruta de Horizon. Estos
    | middleware son una ubicación perfecta para agregar lógica de autenticación
    | o autorización para tu panel de Horizon.
    |
    */

    'middleware' => ['web', 'auth', 'can:viewHorizon'],

    /*
    |--------------------------------------------------------------------------
    | Queue Wait Time Thresholds
    |--------------------------------------------------------------------------
    |
    | Esta opción le permite configurar cuándo considerar que una cola está
    | "lenta" o "muy lenta". Estos umbrales se utilizan para enviar notificaciones
    | cuando las colas están teniendo tiempos de espera elevados.
    |
    */

    'waits' => [
        'redis:default' => 60,
        'redis:alta' => 30,
        'redis:normal' => 60,
        'redis:baja' => 120,
        'redis:reportes' => 300,
        'redis:notificaciones' => 60,
    ],

    /*
    |--------------------------------------------------------------------------
    | Job Trimming Times
    |--------------------------------------------------------------------------
    |
    | Aquí puede especificar cuánto tiempo (en minutos) debe conservar cada
    | tipo de trabajo. Esto ayuda a mantener limpia la base de datos de Horizon.
    |
    */

    'trim' => [
        'recent' => 60,
        'pending' => 60,
        'completed' => 60,
        'recent_failed' => 10080,
        'failed' => 10080,
        'monitored' => 10080,
    ],

    /*
    |--------------------------------------------------------------------------
    | Metrics
    |--------------------------------------------------------------------------
    |
    | Aquí puede especificar cuántos minutos deben transcurrir antes de que
    | cada métrica se almacene en la base de datos. Esto ayuda a mantener
    | los gráficos de métricas rápidos y eficientes.
    |
    */

    'metrics' => [
        'trim_snapshots' => [
            'job' => 24,
            'queue' => 24,
        ],
    ],

    /*
    |--------------------------------------------------------------------------
    | Fast Termination
    |--------------------------------------------------------------------------
    |
    | Cuando esta opción está habilitada, Horizon terminará inmediatamente
    | cuando reciba una señal de terminación (SIGTERM) en lugar de esperar
    | a que todos los trabajos se completen antes de salir.
    |
    */

    'fast_termination' => false,

    /*
    |--------------------------------------------------------------------------
    | Memory Limit (MB)
    |--------------------------------------------------------------------------
    |
    | Este valor describe el límite de memoria (en MB) que debe tener cada
    | worker antes de ser reiniciado por el master supervisor.
    |
    */

    'memory_limit' => 256,

    /*
    |--------------------------------------------------------------------------
    | Master Supervisor Name
    |--------------------------------------------------------------------------
    |
    | Este valor describe el nombre del "master" supervisor que será
    | utilizado para identificar el proceso principal de Horizon.
    |
    */

    'master_supervisor_name' => 'horizon',

    /*
    |--------------------------------------------------------------------------
    | Environments
    |--------------------------------------------------------------------------
    |
    | Aquí puede especificar los entornos donde Horizon debe estar activo.
    | Si su aplicación se ejecuta en un entorno no listado aquí, Horizon
    | no estará activo.
    |
    */

    'environments' => [
        'production',
        'development',
        'local',
        'testing',
    ],

    /*
    |--------------------------------------------------------------------------
    | Supervisor Configuration
    |--------------------------------------------------------------------------
    |
    | Aquí puede especificar la configuración del supervisor de Horizon para
    | cada entorno. Cada supervisor puede tener su propia configuración de
    | workers y balanceo de carga.
    |
    */

    'defaults' => [
        'supervisor-1' => [
            'connection' => 'redis',
            'queue' => ['alta', 'normal', 'baja'],
            'balance' => 'auto',
            'maxProcesses' => 10,
            'maxTime' => 0,
            'maxJobs' => 0,
            'memory' => 256,
            'tries' => 3,
            'timeout' => 90,
            'sleep' => 3,
            'maxTries' => 3,
            'force' => false,
            'nice' => 0,
            'workersName' => 'default',
        ],
        'supervisor-2' => [
            'connection' => 'redis',
            'queue' => ['reportes'],
            'balance' => 'simple',
            'maxProcesses' => 3,
            'maxTime' => 0,
            'maxJobs' => 0,
            'memory' => 512,
            'tries' => 2,
            'timeout' => 300,
            'sleep' => 5,
            'maxTries' => 2,
            'force' => false,
            'nice' => 0,
            'workersName' => 'reportes',
        ],
        'supervisor-3' => [
            'connection' => 'redis',
            'queue' => ['notificaciones'],
            'balance' => 'simple',
            'maxProcesses' => 5,
            'maxTime' => 0,
            'maxJobs' => 0,
            'memory' => 128,
            'tries' => 3,
            'timeout' => 60,
            'sleep' => 2,
            'maxTries' => 3,
            'force' => false,
            'nice' => 0,
            'workersName' => 'notificaciones',
        ],
    ],

    'environments' => [
        'production' => [
            'supervisor-1' => [
                'maxProcesses' => 20,
                'balance' => 'auto',
                'maxJobs' => 1000,
                'maxTime' => 3600,
            ],
            'supervisor-2' => [
                'maxProcesses' => 5,
                'balance' => 'simple',
                'maxJobs' => 100,
                'maxTime' => 7200,
            ],
            'supervisor-3' => [
                'maxProcesses' => 10,
                'balance' => 'simple',
                'maxJobs' => 500,
                'maxTime' => 1800,
            ],
        ],
        'local' => [
            'supervisor-1' => [
                'maxProcesses' => 3,
                'balance' => 'simple',
                'maxJobs' => 100,
                'maxTime' => 1800,
            ],
            'supervisor-2' => [
                'maxProcesses' => 2,
                'balance' => 'simple',
                'maxJobs' => 50,
                'maxTime' => 3600,
            ],
            'supervisor-3' => [
                'maxProcesses' => 2,
                'balance' => 'simple',
                'maxJobs' => 200,
                'maxTime' => 900,
            ],
        ],
    ],

];