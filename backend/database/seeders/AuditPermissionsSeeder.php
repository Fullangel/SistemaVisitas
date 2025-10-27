<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AuditPermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Crear permisos de auditoría
        $auditPermissions = [
            'view_audit_logs',
            'view_audit_statistics',
            'export_audit_logs',
            'delete_audit_logs',
            'view_system_monitoring',
            'view_system_health',
            'manage_audit_settings',
        ];

        foreach ($auditPermissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'api',
            ], [
                'description' => $this->getPermissionDescription($permission),
            ]);
        }

        // Asignar permisos al rol admin
        $adminRole = Role::where('name', 'admin')->where('guard_name', 'api')->first();
        if ($adminRole) {
            $adminRole->syncPermissions(Permission::where('guard_name', 'api')->get());
        }

        // Asignar permisos de visualización al rol supervisor
        $supervisorRole = Role::where('name', 'supervisor')->where('guard_name', 'api')->first();
        if ($supervisorRole) {
            $supervisorRole->givePermissionTo([
                'view_audit_logs',
                'view_audit_statistics',
                'export_audit_logs',
                'view_system_monitoring',
                'view_system_health',
            ]);
        }
    }

    /**
     * Obtener descripción del permiso
     */
    protected function getPermissionDescription(string $permission): string
    {
        $descriptions = [
            'view_audit_logs' => 'Ver logs de auditoría',
            'view_audit_statistics' => 'Ver estadísticas de auditoría',
            'export_audit_logs' => 'Exportar logs de auditoría',
            'delete_audit_logs' => 'Eliminar logs de auditoría',
            'view_system_monitoring' => 'Ver monitoreo del sistema',
            'view_system_health' => 'Ver salud del sistema',
            'manage_audit_settings' => 'Gestionar configuración de auditoría',
        ];

        return $descriptions[$permission] ?? 'Sin descripción';
    }
}