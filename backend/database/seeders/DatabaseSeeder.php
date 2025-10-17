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
            UsersTableSeeder::class,
            RolesTableSeeder::class,
            VisitsTableSeeder::class,
            VisitLogsTableSeeder::class,
            VisitAttachmentsTableSeeder::class,
            NotificationsTableSeeder::class,
        ]);
    }
}