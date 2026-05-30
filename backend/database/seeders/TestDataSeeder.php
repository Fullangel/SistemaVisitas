<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Region;
use App\Models\Headquarter;
use App\Models\Department;
use App\Models\Designation;
use App\Models\Employee;
use App\Models\Visit;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;

class TestDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $this->command->info('🌱 Iniciando seeder de datos de prueba...');

        // 1. Crear Regiones
        $this->command->info('📍 Creando regiones...');
        $regions = [
            ['name' => 'Capital', 'code' => 'CAP', 'description' => 'Región Capital', 'is_active' => true],
            ['name' => 'Central', 'code' => 'CEN', 'description' => 'Región Central', 'is_active' => true],
            ['name' => 'Occidental', 'code' => 'OCC', 'description' => 'Región Occidental', 'is_active' => true],
        ];

        foreach ($regions as $regionData) {
            Region::firstOrCreate(['code' => $regionData['code']], $regionData);
        }

        // 2. Crear Sedes
        $this->command->info('🏢 Creando sedes...');
        $capitalRegion = Region::where('code', 'CAP')->first();
        $centralRegion = Region::where('code', 'CEN')->first();

        $headquarters = [
            [
                'name' => 'Sede Central Caracas',
                'code' => 'SCC',
                'address' => 'Av. Principal de Los Ruices, Caracas',
                'phone' => '0212-1234567',
                'email' => 'central@seniat.gob.ve',
                'region_id' => $capitalRegion->id,
                'is_active' => true,
                'manager_name' => 'Carlos Rodríguez',
                'capacity' => 500,
            ],
            [
                'name' => 'Sede Norte',
                'code' => 'SNO',
                'address' => 'Av. Libertador, Caracas',
                'phone' => '0212-7654321',
                'email' => 'norte@seniat.gob.ve',
                'region_id' => $capitalRegion->id,
                'is_active' => true,
            ],
            [
                'name' => 'Sede Valencia',
                'code' => 'SVA',
                'address' => 'Av. Bolívar Norte, Valencia',
                'phone' => '0241-1234567',
                'email' => 'valencia@seniat.gob.ve',
                'region_id' => $centralRegion->id,
                'is_active' => true,
            ],
        ];

        foreach ($headquarters as $hqData) {
            Headquarter::firstOrCreate(['code' => $hqData['code']], $hqData);
        }

        // 3. Crear Departamentos
        $this->command->info('🏛️ Creando departamentos...');
        $departments = [
            ['name' => 'Gerencia Financiera Administrativa', 'code' => 'GFA', 'description' => 'Gestión financiera y administrativa'],
            ['name' => 'División de Compras y Contratos', 'code' => 'DCC', 'description' => 'Compras y contrataciones'],
            ['name' => 'Gerencia de Recursos Humanos', 'code' => 'GRH', 'description' => 'Gestión de personal'],
            ['name' => 'Gerencia de Tecnología', 'code' => 'GTI', 'description' => 'Tecnología e informática'],
            ['name' => 'Gerencia de Fiscalización', 'code' => 'GFI', 'description' => 'Fiscalización tributaria'],
        ];

        foreach ($departments as $deptData) {
            Department::firstOrCreate(['code' => $deptData['code']], $deptData);
        }

        // 4. Crear Designaciones (Cargos)
        $this->command->info('💼 Creando designaciones...');
        $designations = [
            ['name' => 'Gerente', 'status' => 1],
            ['name' => 'Jefe de Departamento', 'status' => 1],
            ['name' => 'Analista', 'status' => 1],
            ['name' => 'Desarrollador', 'status' => 1],
        ];

        foreach ($designations as $desigData) {
            Designation::firstOrCreate(['name' => $desigData['name']], $desigData);
        }

        // 5. Crear Empleados
        $this->command->info('👥 Creando empleados...');
        $gfa = Department::where('code', 'GFA')->first();
        $dcc = Department::where('code', 'DCC')->first();
        $grh = Department::where('code', 'GRH')->first();
        $gti = Department::where('code', 'GTI')->first();
        $sedeCentral = Headquarter::where('code', 'SCC')->first();
        
        $gerenteDesig = Designation::where('name', 'Gerente')->first();
        $jefeDesig = Designation::where('name', 'Jefe de Departamento')->first();
        $analistaDesig = Designation::where('name', 'Analista')->first();
        $devDesig = Designation::where('name', 'Desarrollador')->first();


        $employees = [
            [
                'first_name' => 'Carlos',
                'last_name' => 'Rodríguez',
                'identification' => 'V-12345678',
                'employee_code' => 'EMP-001',
                'email' => 'carlos.rodriguez@seniat.gob.ve',
                'phone' => '0414-1234567',
                'position' => 'Gerente Financiero',
                'department_id' => $gfa->id,
                'designation_id' => $gerenteDesig->id,
                'headquarter_id' => $sedeCentral->id,
                'status' => 1,
            ],
            [
                'first_name' => 'María',
                'last_name' => 'González',
                'identification' => 'V-23456789',
                'employee_code' => 'EMP-002',
                'email' => 'maria.gonzalez@seniat.gob.ve',
                'phone' => '0424-2345678',
                'position' => 'Jefe de Compras',
                'department_id' => $dcc->id,
                'designation_id' => $jefeDesig->id,
                'headquarter_id' => $sedeCentral->id,
                'status' => 1,
            ],
            [
                'first_name' => 'José',
                'last_name' => 'Pérez',
                'identification' => 'V-34567890',
                'employee_code' => 'EMP-003',
                'email' => 'jose.perez@seniat.gob.ve',
                'phone' => '0412-3456789',
                'position' => 'Analista de RRHH',
                'department_id' => $grh->id,
                'designation_id' => $analistaDesig->id,
                'headquarter_id' => $sedeCentral->id,
                'status' => 1,
            ],
            [
                'first_name' => 'Ana',
                'last_name' => 'Martínez',
                'identification' => 'V-45678901',
                'employee_code' => 'EMP-004',
                'email' => 'ana.martinez@seniat.gob.ve',
                'phone' => '0426-4567890',
                'position' => 'Desarrolladora',
                'department_id' => $gti->id,
                'designation_id' => $devDesig->id,
                'headquarter_id' => $sedeCentral->id,
                'status' => 1,
            ],
        ];

        foreach ($employees as $empData) {
            Employee::firstOrCreate(['identification' => $empData['identification']], $empData);
        }

        // 5. Obtener usuario admin para created_by
        $adminUser = User::where('email', 'admin@visitas.com')->first();
        if (!$adminUser) {
            $this->command->warn('⚠️ Usuario admin no encontrado. Creándolo...');
            $adminRole = \Spatie\Permission\Models\Role::where('name', 'admin')->first();
            $adminUser = User::create([
                'first_name' => 'Admin',
                'last_name' => 'Sistema',
                'email' => 'admin@visitas.com',
                'username' => 'admin',
                'password' => Hash::make('admin123'),
                'status' => 'active',
            ]);
            if ($adminRole) {
                $adminUser->assignRole($adminRole);
            }
        }

        // 6. Crear Visitas con diferentes estados
        $this->command->info('📋 Creando visitas de prueba...');
        
        $sedeCentral = Headquarter::where('code', 'SCC')->first();
        $sedeNorte = Headquarter::where('code', 'SNO')->first();
        $carlos = Employee::where('identification', 'V-12345678')->first();
        $maria = Employee::where('identification', 'V-23456789')->first();
        $jose = Employee::where('identification', 'V-34567890')->first();

        $visits = [
            // Visitas activas (in_progress)
            [
                'visit_code' => 'VIS-' . date('Ymd') . '-001',
                'purpose' => 'Reunión de planificación estratégica',
                'description' => 'Reunión con proveedores para planificación del próximo trimestre',
                'visit_date' => Carbon::today(),
                'entry_time' => Carbon::now()->subHours(2),
                'exit_time' => null,
                'status' => 'in_progress',
                'priority' => 'high',
                'visitor_name' => 'Juan Pérez García',
                'visitor_email' => 'juan.perez@techsolutions.com',
                'visitor_phone' => '0414-9876543',
                'visitor_identification' => 'V-18765432',
                'visitor_company' => 'Tech Solutions C.A.',
                'employee_id' => $carlos->id,
                'department_id' => $gfa->id,
                'headquarter_id' => $sedeCentral->id,
                'created_by' => $adminUser->id,
                'approved_by' => $adminUser->id,
                'approved_at' => Carbon::now()->subHours(3),
                'has_vehicle' => true,
                'vehicle_plate' => 'ABC-123',
                'vehicle_model' => 'Toyota Corolla 2020',
                'vehicle_color' => 'Gris',
            ],
            [
                'visit_code' => 'VIS-' . date('Ymd') . '-002',
                'purpose' => 'Auditoría externa',
                'description' => 'Revisión de procesos administrativos',
                'visit_date' => Carbon::today(),
                'entry_time' => Carbon::now()->subHour(),
                'exit_time' => null,
                'status' => 'in_progress',
                'priority' => 'urgent',
                'visitor_name' => 'Laura Díaz Morales',
                'visitor_email' => 'laura.diaz@auditores.com',
                'visitor_phone' => '0424-8765432',
                'visitor_identification' => 'V-17654321',
                'visitor_company' => 'Auditores Asociados',
                'employee_id' => $maria->id,
                'department_id' => $dcc->id,
                'headquarter_id' => $sedeCentral->id,
                'created_by' => $adminUser->id,
                'approved_by' => $adminUser->id,
                'approved_at' => Carbon::now()->subHours(2),
                'has_vehicle' => false,
            ],
            [
                'visit_code' => 'VIS-' . date('Ymd') . '-003',
                'purpose' => 'Mantenimiento de equipos',
                'description' => 'Servicio técnico de impresoras y equipos de oficina',
                'visit_date' => Carbon::today(),
                'entry_time' => Carbon::now()->subMinutes(30),
                'exit_time' => null,
                'status' => 'in_progress',
                'priority' => 'medium',
                'visitor_name' => 'Roberto Gómez Silva',
                'visitor_email' => 'roberto.gomez@servitec.com',
                'visitor_phone' => '0412-7654321',
                'visitor_identification' => 'V-16543210',
                'visitor_company' => 'ServiTec Venezuela',
                'employee_id' => $jose->id,
                'department_id' => $gti->id,
                'headquarter_id' => $sedeNorte->id,
                'created_by' => $adminUser->id,
                'approved_by' => $adminUser->id,
                'approved_at' => Carbon::now()->subHour(),
                'has_vehicle' => true,
                'vehicle_plate' => 'XYZ-789',
                'vehicle_model' => 'Chevrolet Spark 2019',
                'vehicle_color' => 'Blanco',
            ],

            // Visitas pendientes (pending)
            [
                'visit_code' => 'VIS-' . date('Ymd') . '-004',
                'purpose' => 'Presentación de propuesta comercial',
                'description' => 'Presentación de nuevos servicios de consultoría',
                'visit_date' => Carbon::today(),
                'entry_time' => Carbon::now()->addHours(2),
                'exit_time' => null,
                'status' => 'pending',
                'priority' => 'medium',
                'visitor_name' => 'Patricia Ramírez López',
                'visitor_email' => 'patricia.ramirez@consultores.com',
                'visitor_phone' => '0426-6543210',
                'visitor_identification' => 'V-15432109',
                'visitor_company' => 'Consultores SAP',
                'employee_id' => $carlos->id,
                'department_id' => $gfa->id,
                'headquarter_id' => $sedeCentral->id,
                'created_by' => $adminUser->id,
                'has_vehicle' => false,
            ],
            [
                'visit_code' => 'VIS-' . date('Ymd') . '-005',
                'purpose' => 'Entrega de documentación',
                'description' => 'Entrega de contratos firmados',
                'visit_date' => Carbon::tomorrow(),
                'entry_time' => Carbon::tomorrow()->setTime(10, 0),
                'exit_time' => null,
                'status' => 'pending',
                'priority' => 'low',
                'visitor_name' => 'Miguel Ángel Torres',
                'visitor_email' => 'miguel.torres@proveedorit.com',
                'visitor_phone' => '0414-5432109',
                'visitor_identification' => 'V-14321098',
                'visitor_company' => 'Proveedor IT C.A.',
                'employee_id' => $maria->id,
                'department_id' => $dcc->id,
                'headquarter_id' => $sedeCentral->id,
                'created_by' => $adminUser->id,
                'has_vehicle' => true,
                'vehicle_plate' => 'DEF-456',
                'vehicle_model' => 'Hyundai Accent 2021',
                'vehicle_color' => 'Azul',
            ],

            // Visitas completadas (completed)
            [
                'visit_code' => 'VIS-' . date('Ymd', strtotime('-1 day')) . '-001',
                'purpose' => 'Capacitación de personal',
                'description' => 'Taller de actualización tributaria',
                'visit_date' => Carbon::yesterday(),
                'entry_time' => Carbon::yesterday()->setTime(9, 0),
                'exit_time' => Carbon::yesterday()->setTime(12, 0),
                'status' => 'completed',
                'priority' => 'high',
                'visitor_name' => 'Sandra Fernández Ruiz',
                'visitor_email' => 'sandra.fernandez@capacitacion.com',
                'visitor_phone' => '0424-4321098',
                'visitor_identification' => 'V-13210987',
                'visitor_company' => 'Capacitación Empresarial',
                'employee_id' => $jose->id,
                'department_id' => $grh->id,
                'headquarter_id' => $sedeCentral->id,
                'created_by' => $adminUser->id,
                'approved_by' => $adminUser->id,
                'approved_at' => Carbon::yesterday()->subDay(),
                'has_vehicle' => false,
            ],
        ];

        foreach ($visits as $visitData) {
            Visit::firstOrCreate(
                ['visit_code' => $visitData['visit_code']],
                $visitData
            );
        }

        $this->command->info('✅ Seeder completado exitosamente!');
        $this->command->info('📊 Resumen:');
        $this->command->info('   - Regiones: ' . Region::count());
        $this->command->info('   - Sedes: ' . Headquarter::count());
        $this->command->info('   - Departamentos: ' . Department::count());
        $this->command->info('   - Empleados: ' . Employee::count());
        $this->command->info('   - Visitas: ' . Visit::count());
        $this->command->info('   - Visitas activas: ' . Visit::where('status', 'in_progress')->count());
        $this->command->info('   - Visitas pendientes: ' . Visit::where('status', 'pending')->count());
    }
}
