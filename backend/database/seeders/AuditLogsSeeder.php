<?php

namespace Database\Seeders;

use App\Models\AuditLog;
use App\Models\User;
use App\Models\Employee;
use App\Models\Visit;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AuditLogsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Obtener usuarios existentes
        $users = User::limit(5)->get();
        $employees = Employee::limit(5)->get();
        $visits = Visit::limit(5)->get();

        // Crear logs de auditoría de muestra
        $auditLogs = [];

        // Logs de usuarios
        foreach ($users as $user) {
            $auditLogs[] = [
                'action' => 'created',
                'model' => 'App\Models\User',
                'model_id' => $user->id,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'url' => '/api/users',
                'changes' => json_encode([
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at->toDateTimeString(),
                ]),
                'created_at' => now(),
                'updated_at' => now(),
            ];

            // Log de actualización
            $auditLogs[] = [
                'action' => 'updated',
                'model' => 'App\Models\User',
                'model_id' => $user->id,
                'user_id' => $user->id,
                'user_name' => $user->name,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'url' => '/api/users/' . $user->id,
                'changes' => json_encode([
                    'name' => [
                        'old' => 'Usuario Anterior',
                        'new' => $user->name,
                    ],
                ]),
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ];
        }

        // Logs de empleados
        foreach ($employees as $employee) {
            $auditLogs[] = [
                'action' => 'created',
                'model' => 'App\Models\Employee',
                'model_id' => $employee->id,
                'user_id' => $users->random()->id,
                'user_name' => $users->random()->name,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'url' => '/api/employees',
                'changes' => json_encode([
                    'first_name' => $employee->first_name,
                    'last_name' => $employee->last_name,
                    'dni' => $employee->dni,
                    'email' => $employee->email,
                    'status' => $employee->status,
                ]),
                'created_at' => now()->subDays(10),
                'updated_at' => now()->subDays(10),
            ];
        }

        // Logs de visitas
        foreach ($visits as $visit) {
            $auditLogs[] = [
                'action' => 'created',
                'model' => 'App\Models\Visit',
                'model_id' => $visit->id,
                'user_id' => $users->random()->id,
                'user_name' => $users->random()->name,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'url' => '/api/visits',
                'changes' => json_encode([
                    'visit_date' => $visit->visit_date->toDateTimeString(),
                    'visitor_name' => $visit->visitor_name,
                    'visitor_dni' => $visit->visitor_dni,
                    'status' => $visit->status,
                ]),
                'created_at' => now()->subDays(15),
                'updated_at' => now()->subDays(15),
            ];

            // Log de cambio de estado
            $auditLogs[] = [
                'action' => 'status_change',
                'model' => 'App\Models\Visit',
                'model_id' => $visit->id,
                'user_id' => $users->random()->id,
                'user_name' => $users->random()->name,
                'ip_address' => fake()->ipv4(),
                'user_agent' => fake()->userAgent(),
                'url' => '/api/visits/' . $visit->id . '/status',
                'changes' => json_encode([
                    'status' => [
                        'old' => 'pending',
                        'new' => $visit->status,
                    ],
                    'reason' => 'Cambio automático de estado',
                ]),
                'created_at' => now()->subDays(7),
                'updated_at' => now()->subDays(7),
            ];
        }

        // Insertar logs en la base de datos
        DB::table('audit_logs')->insert($auditLogs);

        $this->command->info('Se crearon ' . count($auditLogs) . ' logs de auditoría de muestra.');
    }
}