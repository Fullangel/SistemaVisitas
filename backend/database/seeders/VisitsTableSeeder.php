<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Visit;
use App\Models\Employee;
use App\Models\Department;
use App\Models\Headquarter;
use App\Models\User;

class VisitsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $employees = Employee::all();
        $departments = Department::all();
        $headquarters = Headquarter::all();
        $users = User::all();
        
        $visits = [
            [
                'visit_code' => 'VIS-2025-001',
                'visitor_name' => 'Juan Carlos Silva',
                'visitor_company' => 'Tech Solutions S.A.',
                'visitor_identification' => '76543210-K',
                'visitor_phone' => '+56912345678',
                'visitor_email' => 'juan.silva@techsolutions.com',
                'description' => 'Reunión de negocios para discutir proyecto de seguridad',
                'visit_date' => now()->addDays(2),
                'entry_time' => '09:00:00',
                'exit_time' => '12:00:00',
                'priority' => 'high',
                'status' => 'pending',
                'employee_id' => $employees->first()->id,
                'department_id' => $departments->first()->id,
                'headquarter_id' => $headquarters->first()->id,
                'created_by' => $users->first()->id,
                'purpose' => 'Reunión de negocios para discutir proyecto de seguridad',
            ],
            [
                'visit_code' => 'VIS-2025-002',
                'visitor_name' => 'María González',
                'visitor_company' => 'Consultores ABC',
                'visitor_identification' => '87654321-1',
                'visitor_phone' => '+56987654321',
                'visitor_email' => 'maria.gonzalez@consultoresabc.cl',
                'description' => 'Auditoría trimestral de procesos de seguridad',
                'visit_date' => now()->addDays(5),
                'entry_time' => '14:00:00',
                'exit_time' => '18:00:00',
                'priority' => 'medium',
                'status' => 'approved',
                'employee_id' => $employees->skip(1)->first()->id,
                'department_id' => $departments->where('code', 'SEG')->first()->id ?? $departments->first()->id,
                'headquarter_id' => $headquarters->first()->id,
                'created_by' => $users->first()->id,
                'approved_by' => $users->first()->id,
                'approved_at' => now(),
                'purpose' => 'Auditoría trimestral de procesos de seguridad',
            ],
            [
                'visit_code' => 'VIS-2025-003',
                'visitor_name' => 'Carlos Méndez',
                'visitor_company' => 'Mantenimiento Industrial Ltda.',
                'visitor_identification' => '98765432-2',
                'visitor_phone' => '+56911223344',
                'visitor_email' => 'carlos.mendez@mantindustrial.cl',
                'description' => 'Mantenimiento de equipos de seguridad',
                'visit_date' => now()->addDays(1),
                'entry_time' => '08:00:00',
                'exit_time' => '17:00:00',
                'priority' => 'high',
                'status' => 'in_progress',
                'employee_id' => $employees->skip(2)->first()->id,
                'department_id' => $departments->where('code', 'MAN')->first()->id ?? $departments->first()->id,
                'headquarter_id' => $headquarters->first()->id,
                'created_by' => $users->skip(1)->first()->id,
                'approved_by' => $users->first()->id,
                'approved_at' => now(),
                'purpose' => 'Mantenimiento de equipos de seguridad',
            ],
            [
                'visit_code' => 'VIS-2025-004',
                'visitor_name' => 'Ana Rodríguez',
                'visitor_company' => 'Proveedores XYZ',
                'visitor_identification' => '12345678-9',
                'visitor_phone' => '+56955443322',
                'visitor_email' => 'ana.rodriguez@proveedoresxyz.com',
                'description' => 'Entrega de materiales de oficina',
                'visit_date' => now()->subDays(1),
                'entry_time' => '10:00:00',
                'exit_time' => '11:00:00',
                'priority' => 'low',
                'status' => 'completed',
                'employee_id' => $employees->skip(3)->first()->id,
                'department_id' => $departments->where('code', 'ADM')->first()->id ?? $departments->first()->id,
                'headquarter_id' => $headquarters->first()->id,
                'created_by' => $users->skip(2)->first()->id,
                'approved_by' => $users->first()->id,
                'approved_at' => now()->subDays(2),
                'purpose' => 'Entrega de materiales de oficina',
            ],
        ];

        foreach ($visits as $visit) {
            Visit::create($visit);
        }
    }
}
