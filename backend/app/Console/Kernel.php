<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     *
     * @param  \Illuminate\Console\Scheduling\Schedule  $schedule
     * @return void
     */
    protected function schedule(Schedule $schedule)
    {
        // Archivado automático de visitas antiguas (ejecutar mensualmente)
        $schedule->command('visits:archive --days=365')->monthly();
        
        // Limpiar notificaciones antiguas (mayores a 90 días)
        $schedule->command('notifications:clean --days=90')->daily();
        
        // Limpiar datos de 2FA antiguos (ejecutar semanalmente)
        $schedule->command('2fa:clean --days=30')->weekly();
        
        // Limpiar tokens de acceso personales expirados
        $schedule->command('sanctum:prune-expired --hours=24')->daily();
        
        // Limpiar logs de auditoría antiguos (mantener 90 días por defecto)
        $schedule->command('audit:cleanup --days=90')->weekly();
        
        // Verificación de salud del sistema (ejecutar cada hora)
        $schedule->command('system:health')->hourly();
    }

    /**
     * Register the commands for the application.
     *
     * @return void
     */
    protected function commands()
    {
        $this->load(__DIR__.'/Commands');

        require base_path('routes/console.php');
    }
}