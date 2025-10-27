<?php

namespace App\Console\Commands;

use App\Models\TwoFactorCode;
use App\Models\TrustedDevice;
use Illuminate\Console\Command;

class CleanTwoFactorData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = '2fa:clean 
                            {--days=30 : Número de días para considerar datos antiguos}
                            {--dry-run : Mostrar lo que se eliminaría sin ejecutar}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Limpiar datos antiguos de autenticación de dos factores';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $days = $this->option('days');
        $dryRun = $this->option('dry-run');

        $this->info('Iniciando limpieza de datos de 2FA...');

        // Limpiar códigos 2FA antiguos
        $this->cleanTwoFactorCodes($days, $dryRun);

        // Limpiar dispositivos confiables antiguos
        $this->cleanTrustedDevices($days, $dryRun);

        $this->info('✅ Limpieza de datos de 2FA completada.');

        return 0;
    }

    /**
     * Limpiar códigos 2FA antiguos
     */
    private function cleanTwoFactorCodes(int $days, bool $dryRun): void
    {
        $cutoffDate = now()->subDays($days);

        $query = TwoFactorCode::where(function ($q) use ($cutoffDate) {
            $q->where('expires_at', '<', $cutoffDate)
              ->orWhere('used', true)
              ->orWhere('attempts', '>=', 3);
        });

        $count = $query->count();

        if ($count === 0) {
            $this->info("No hay códigos 2FA antiguos que limpiar.");
            return;
        }

        $this->info("Encontrados {$count} códigos 2FA para limpiar.");

        if ($dryRun) {
            $this->info("Modo simulación activado. No se ejecutará la limpieza de códigos.");
            return;
        }

        $deleted = $query->delete();
        $this->info("✅ {$deleted} códigos 2FA eliminados.");
    }

    /**
     * Limpiar dispositivos confiables antiguos
     */
    private function cleanTrustedDevices(int $days, bool $dryRun): void
    {
        $cutoffDate = now()->subDays($days);

        $query = TrustedDevice::where(function ($q) use ($cutoffDate) {
            $q->where('last_used_at', '<', $cutoffDate)
              ->orWhere('is_trusted', false);
        });

        $count = $query->count();

        if ($count === 0) {
            $this->info("No hay dispositivos confiables antiguos que limpiar.");
            return;
        }

        $this->info("Encontrados {$count} dispositivos confiables para limpiar.");

        if ($dryRun) {
            $this->info("Modo simulación activado. No se ejecutará la limpieza de dispositivos.");
            return;
        }

        $deleted = $query->delete();
        $this->info("✅ {$deleted} dispositivos confiables eliminados.");
    }
}