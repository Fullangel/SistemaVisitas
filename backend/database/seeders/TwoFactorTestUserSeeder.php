<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use PragmaRX\Google2FA\Google2FA;

class TwoFactorTestUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generar secreto para 2FA
        $google2fa = new Google2FA();
        $secret = $google2fa->generateSecretKey();

        // Crear usuario de prueba con 2FA habilitado
        $user = User::create([
            'first_name' => 'Admin',
            'last_name' => '2FA',
            'email' => 'admin2fa@example.com',
            'username' => 'admin2fa',
            'password' => Hash::make('password123'),
            'status' => 'active',
            'two_factor_enabled' => true,
            'two_factor_confirmed_at' => now(),
            'two_factor_method' => 'totp',
            'two_factor_secret' => $secret,
        ]);

        // Generar códigos de recuperación para el usuario
        $user->generateRecoveryCodes();

        $this->command->info('Usuario de prueba con 2FA creado:');
        $this->command->info('Email: admin2fa@example.com');
        $this->command->info('Contraseña: password123');
        $this->command->info('2FA: Habilitado con TOTP');
        $this->command->info('Códigos de recuperación generados');
    }
}