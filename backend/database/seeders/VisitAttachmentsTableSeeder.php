<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\VisitAttachment;
use App\Models\Visit;
use App\Models\User;

class VisitAttachmentsTableSeeder extends Seeder
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
        
        $attachments = [
            [
                'visit_id' => $visits->first()->id,
                'file_name' => 'carta_invitacion_visita.pdf',
                'file_path' => '/uploads/visits/2025/10/carta_invitacion_visita.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 245760,
                'mime_type' => 'application/pdf',
                'uploaded_by' => $users->first()->id,
                'created_at' => now()->subDays(2),
            ],
            [
                'visit_id' => $visits->skip(1)->first()->id,
                'file_name' => 'documento_auditoria.xlsx',
                'file_path' => '/uploads/visits/2025/10/documento_auditoria.xlsx',
                'file_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'file_size' => 102400,
                'mime_type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'uploaded_by' => $users->first()->id,
                'created_at' => now()->subDays(1),
            ],
            [
                'visit_id' => $visits->skip(2)->first()->id,
                'file_name' => 'permiso_mantenimiento.pdf',
                'file_path' => '/uploads/visits/2025/10/permiso_mantenimiento.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 184320,
                'mime_type' => 'application/pdf',
                'uploaded_by' => $users->skip(1)->first()->id,
                'created_at' => now()->subHours(3),
            ],
            [
                'visit_id' => $visits->skip(3)->first()->id,
                'file_name' => 'orden_compra.pdf',
                'file_path' => '/uploads/visits/2025/10/orden_compra.pdf',
                'file_type' => 'application/pdf',
                'file_size' => 92160,
                'mime_type' => 'application/pdf',
                'uploaded_by' => $users->skip(2)->first()->id,
                'created_at' => now()->subDays(1),
            ],
        ];

        foreach ($attachments as $attachment) {
            VisitAttachment::create($attachment);
        }
    }
}
