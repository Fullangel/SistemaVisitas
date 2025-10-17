<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Department;
use App\Models\Headquarter;

class DepartmentsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $headquarters = Headquarter::all();
        
        $departments = [
            ['name' => 'Departamento de Seguridad', 'code' => 'SEG', 'headquarter_id' => $headquarters->first()->id],
            ['name' => 'Departamento de Recursos Humanos', 'code' => 'RRHH', 'headquarter_id' => $headquarters->first()->id],
            ['name' => 'Departamento de Administración', 'code' => 'ADM', 'headquarter_id' => $headquarters->first()->id],
            ['name' => 'Departamento de Finanzas', 'code' => 'FIN', 'headquarter_id' => $headquarters->first()->id],
            ['name' => 'Departamento de Tecnología', 'code' => 'TEC', 'headquarter_id' => $headquarters->first()->id],
            ['name' => 'Departamento de Operaciones', 'code' => 'OPS', 'headquarter_id' => $headquarters->first()->id],
            ['name' => 'Departamento de Mantenimiento', 'code' => 'MAN', 'headquarter_id' => $headquarters->first()->id],
            ['name' => 'Departamento de Logística', 'code' => 'LOG', 'headquarter_id' => $headquarters->first()->id],
        ];

        foreach ($departments as $department) {
            Department::create($department);
        }
    }
}
