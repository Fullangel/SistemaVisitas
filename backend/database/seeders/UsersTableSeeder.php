<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Employee;

class UsersTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::all();
        
        // Usuario administrador
        User::create([
            'first_name' => 'Administrador',
            'last_name' => 'Sistema',
            'username' => 'admin',
            'email' => 'admin@visitas.com',
            'password' => bcrypt('password123'),
            'role_id' => 1, // Asumiendo que el rol 1 es administrador
            'status' => 'active'
        ]);

        // Usuario de seguridad
        User::create([
            'first_name' => 'Usuario',
            'last_name' => 'Seguridad',
            'username' => 'seguridad',
            'email' => 'seguridad@visitas.com',
            'password' => bcrypt('password123'),
            'role_id' => 2, // Asumiendo que el rol 2 es seguridad
            'status' => 'active'
        ]);

        // Usuario regular
        User::create([
            'first_name' => 'Usuario',
            'last_name' => 'Regular',
            'username' => 'usuario',
            'email' => 'usuario@visitas.com',
            'password' => bcrypt('password123'),
            'role_id' => 3, // Asumiendo que el rol 3 es usuario regular
            'status' => 'active'
        ]);
    }
}
