<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Designation;

class EmployeesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $departments = Department::all();
        $designations = Designation::all();
        
        $employees = [
            [
                'first_name' => 'Juan',
                'last_name' => 'Pérez',
                'email' => 'juan.perez@empresa.com',
                'phone' => '555-0101',
                'identification' => '12345678-9',
                'employee_code' => 'EMP001',
                'department_id' => $departments->first()->id,
                'designation_id' => $designations->where('name', 'Gerente General')->first()->id ?? $designations->first()->id,
                'status' => true
            ],
            [
                'first_name' => 'María',
                'last_name' => 'Gómez',
                'email' => 'maria.gomez@empresa.com',
                'phone' => '555-0102',
                'identification' => '87654321-0',
                'employee_code' => 'EMP002',
                'department_id' => $departments->where('code', 'SEG')->first()->id ?? $departments->first()->id,
                'designation_id' => $designations->where('name', 'Gerente de Seguridad')->first()->id ?? $designations->first()->id,
                'status' => true
            ],
            [
                'first_name' => 'Carlos',
                'last_name' => 'Rodríguez',
                'email' => 'carlos.rodriguez@empresa.com',
                'phone' => '555-0103',
                'identification' => '11223344-5',
                'employee_code' => 'EMP003',
                'department_id' => $departments->where('code', 'SEG')->first()->id ?? $departments->first()->id,
                'designation_id' => $designations->where('name', 'Coordinador de Seguridad')->first()->id ?? $designations->first()->id,
                'status' => true
            ],
            [
                'first_name' => 'Ana',
                'last_name' => 'Martínez',
                'email' => 'ana.martinez@empresa.com',
                'phone' => '555-0104',
                'identification' => '55667788-9',
                'employee_code' => 'EMP004',
                'department_id' => $departments->where('code', 'ADM')->first()->id ?? $departments->first()->id,
                'designation_id' => $designations->where('name', 'Asistente Administrativo')->first()->id ?? $designations->first()->id,
                'status' => true
            ],
            [
                'first_name' => 'Luis',
                'last_name' => 'Hernández',
                'email' => 'luis.hernandez@empresa.com',
                'phone' => '555-0105',
                'identification' => '99887766-5',
                'employee_code' => 'EMP005',
                'department_id' => $departments->where('code', 'TEC')->first()->id ?? $departments->first()->id,
                'designation_id' => $designations->where('name', 'Analista de Seguridad')->first()->id ?? $designations->first()->id,
                'status' => true
            ],
        ];

        foreach ($employees as $employee) {
            Employee::create($employee);
        }
    }
}
