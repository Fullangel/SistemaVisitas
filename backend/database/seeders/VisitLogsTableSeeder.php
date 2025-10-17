<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\VisitLog;
use App\Models\Visit;
use App\Models\User;

class VisitLogsTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $visits = Visit::all();
        $users = User::all();
        
        if ($visits->isEmpty() || $users->isEmpty()) {
            return;
        }
        
        $logs = [
            [
                'visit_id' => $visits->first()->id,
                'action' => 'created',
                'status_from' => null,
                'status_to' => 'pending',
                'user_id' => $users->first()->id,
                'notes' => 'Visita creada por el sistema',
                'created_at' => now()->subDays(3),
            ],
            [
                'visit_id' => $visits->skip(1)->first()->id,
                'action' => 'status_changed',
                'status_from' => 'pending',
                'status_to' => 'approved',
                'user_id' => $users->first()->id,
                'notes' => 'Visita aprobada por el administrador',
                'created_at' => now()->subDays(2),
            ],
            [
                'visit_id' => $visits->skip(2)->first()->id,
                'action' => 'check_in',
                'status_from' => 'approved',
                'status_to' => 'in_progress',
                'user_id' => $users->skip(1)->first()->id,
                'notes' => 'Visitante ingresado a las instalaciones',
                'created_at' => now()->subHours(2),
            ],
            [
                'visit_id' => $visits->skip(3)->first()->id,
                'action' => 'check_out',
                'status_from' => 'in_progress',
                'status_to' => 'completed',
                'user_id' => $users->skip(1)->first()->id,
                'notes' => 'Visitante salió de las instalaciones',
                'created_at' => now()->subHours(1),
            ],
            [
                'visit_id' => $visits->first()->id,
                'action' => 'updated',
                'status_from' => null,
                'status_to' => null,
                'user_id' => $users->first()->id,
                'notes' => 'Se actualizó el horario de salida',
                'created_at' => now()->subHours(1),
            ],
        ];

        foreach ($logs as $log) {
            VisitLog::create($log);
        }
    }
}
