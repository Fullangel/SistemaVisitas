<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Notification;
use App\Models\User;
use App\Models\Visit;

class NotificationsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = User::all();
        $visits = Visit::all();
        
        if ($users->isEmpty() || $visits->isEmpty()) {
            return;
        }
        
        $notifications = [
            [
                'user_id' => $users->first()->id,
                'type' => 'visit_created',
                'title' => 'Nueva Visita Creada',
                'message' => 'Se ha creado una nueva visita para Juan Carlos Silva el 19 de octubre de 2025',
                'is_read' => false,
                'related_type' => 'visit',
                'related_id' => $visits->first()->id,
                'metadata' => json_encode([
                    'visit_code' => 'VIS-2025-001',
                    'visitor_name' => 'Juan Carlos Silva',
                    'visit_date' => '2025-10-19',
                ]),
                'created_at' => now()->subDays(2),
            ],
            [
                'user_id' => $users->skip(1)->first()->id,
                'type' => 'visit_approved',
                'title' => 'Visita Aprobada',
                'message' => 'La visita de María González ha sido aprobada exitosamente',
                'is_read' => true,
                'read_at' => now()->subDays(1),
                'related_type' => 'visit',
                'related_id' => $visits->skip(1)->first()->id,
                'metadata' => json_encode([
                    'visit_code' => 'VIS-2025-002',
                    'visitor_name' => 'María González',
                    'approved_by' => 'Administrador',
                ]),
                'created_at' => now()->subDays(1),
            ],
            [
                'user_id' => $users->skip(2)->first()->id,
                'type' => 'visit_check_in',
                'title' => 'Visitante Ingresado',
                'message' => 'Carlos Méndez ha ingresado a las instalaciones para mantenimiento',
                'is_read' => false,
                'related_type' => 'visit',
                'related_id' => $visits->skip(2)->first()->id,
                'metadata' => json_encode([
                    'visit_code' => 'VIS-2025-003',
                    'visitor_name' => 'Carlos Méndez',
                    'check_in_time' => '08:00:00',
                ]),
                'created_at' => now()->subHours(2),
            ],
            [
                'user_id' => $users->first()->id,
                'type' => 'visit_check_out',
                'title' => 'Visitante Retirado',
                'message' => 'Ana Rodríguez ha finalizado su visita y salido de las instalaciones',
                'is_read' => false,
                'related_type' => 'visit',
                'related_id' => $visits->skip(3)->first()->id,
                'metadata' => json_encode([
                    'visit_code' => 'VIS-2025-004',
                    'visitor_name' => 'Ana Rodríguez',
                    'check_out_time' => '11:00:00',
                ]),
                'created_at' => now()->subHours(1),
            ],
            [
                'user_id' => $users->first()->id,
                'type' => 'system_alert',
                'title' => 'Alerta de Seguridad',
                'message' => 'Se ha detectado una visita con prioridad alta programada para mañana',
                'is_read' => false,
                'related_type' => null,
                'related_id' => null,
                'metadata' => json_encode([
                    'alert_type' => 'high_priority_visit',
                    'visit_code' => 'VIS-2025-003',
                    'scheduled_date' => now()->addDays(1)->format('Y-m-d'),
                ]),
                'created_at' => now()->subHours(30),
            ],
        ];

        foreach ($notifications as $notification) {
            Notification::create($notification);
        }
    }
}
