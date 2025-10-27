<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RegionsTableSeeder::class,
            DesignationsTableSeeder::class,
            HeadquartesTableSeeder::class,
            DepartmentsTableSeeder::class,
            EmployeesTableSeeder::class,
            RolesTableSeeder::class,
            AdminUserSeeder::class,
            UsersTableSeeder::class,
            VisitsTableSeeder::class,
            VisitLogsTableSeeder::class,
            VisitAttachmentsTableSeeder::class,
            NotificationsTableSeeder::class,
            TwoFactorTestUserSeeder::class,
            AuditPermissionsSeeder::class,
            AuditLogsSeeder::class,
        ]);
    }
}