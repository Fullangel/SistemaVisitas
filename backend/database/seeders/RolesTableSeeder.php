<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolesTableSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'admin',
                'description' => 'Administrator with full access',
                'permissions' => [
                    'users.create', 'users.read', 'users.update', 'users.delete',
                    'roles.create', 'roles.read', 'roles.update', 'roles.delete',
                    'visits.create', 'visits.read', 'visits.update', 'visits.delete',
                    'employees.create', 'employees.read', 'employees.update', 'employees.delete',
                    'departments.create', 'departments.read', 'departments.update', 'departments.delete',
                    'headquarters.create', 'headquarters.read', 'headquarters.update', 'headquarters.delete',
                    'regions.create', 'regions.read', 'regions.update', 'regions.delete',
                    'reports.read', 'reports.export',
                    'settings.read', 'settings.update',
                ],
            ],
            [
                'name' => 'supervisor',
                'description' => 'Supervisor with visit management and employee oversight',
                'permissions' => [
                    'visits.create', 'visits.read', 'visits.update', 'visits.delete',
                    'employees.create', 'employees.read', 'employees.update',
                    'departments.read',
                    'headquarters.read',
                    'regions.read',
                    'reports.read', 'reports.export',
                    'notifications.read', 'notifications.send',
                ],
            ],
            [
                'name' => 'recepcion',
                'description' => 'Receptionist with visit registration and basic management',
                'permissions' => [
                    'visits.create', 'visits.read', 'visits.update',
                    'employees.read',
                    'departments.read',
                    'headquarters.read',
                    'regions.read',
                    'visitors.create', 'visitors.read', 'visitors.update',
                    'notifications.read', 'notifications.send',
                ],
            ],
            [
                'name' => 'employee',
                'description' => 'Regular employee with basic access',
                'permissions' => [
                    'visits.read',
                    'employees.read',
                    'reports.read',
                ],
            ],
            [
                'name' => 'visitor',
                'description' => 'Visitor with minimal access',
                'permissions' => [
                    'visits.read',
                ],
            ],
        ];

        foreach ($roles as $role) {
            Role::create($role);
        }
    }
}
