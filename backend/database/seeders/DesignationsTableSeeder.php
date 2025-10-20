<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Designation;

class DesignationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $designations = [
            ['name' => 'Gerente General', 'status' => true],
            ['name' => 'Gerente de Seguridad', 'status' => true],
            ['name' => 'Coordinador de Seguridad', 'status' => true],
            ['name' => 'Analista de Seguridad', 'status' => true],
            ['name' => 'Recepcionista', 'status' => true],
            ['name' => 'Asistente Administrativo', 'status' => true],
            ['name' => 'Jefe de Departamento', 'status' => true],
            ['name' => 'Supervisor', 'status' => true],
            ['name' => 'Operario', 'status' => true],
            ['name' => 'Visitante', 'status' => true],
        ];

        foreach ($designations as $designation) {
            Designation::create($designation);
        }
    }
}
