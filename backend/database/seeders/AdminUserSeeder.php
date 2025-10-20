<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear usuario admin si no existe
        $admin = User::where('username', 'admin')->first();
        
        if (!$admin) {
            User::create([
                'first_name' => 'Administrador',
                'last_name' => 'Sistema',
                'email' => 'admin@sistema.com',
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'status' => 1,
                'role_id' => 1, // Asumiendo que el rol admin es 1
            ]);
            
            $this->command->info('Usuario admin creado exitosamente');
            $this->command->info('Username: admin');
            $this->command->info('Password: admin123');
        } else {
            $this->command->info('El usuario admin ya existe');
        }
    }
}