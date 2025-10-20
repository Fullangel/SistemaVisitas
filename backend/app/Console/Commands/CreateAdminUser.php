<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class CreateAdminUser extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create:admin-user {email} {username} {password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create an admin user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $username = $this->argument('username');
        $password = $this->argument('password');

        // Buscar rol admin
        $adminRole = Role::where('name', 'admin')->first();
        
        if (!$adminRole) {
            $this->error('Admin role not found. Please run the roles seeder first.');
            return 1;
        }

        // Verificar si el usuario ya existe
        if (User::where('email', $email)->exists()) {
            $this->error('User with this email already exists.');
            return 1;
        }

        if (User::where('username', $username)->exists()) {
            $this->error('User with this username already exists.');
            return 1;
        }

        // Crear usuario admin
        $user = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => $email,
            'username' => $username,
            'password' => Hash::make($password),
            'role_id' => $adminRole->id,
            'status' => 1,
        ]);

        $this->info("Admin user created successfully!");
        $this->info("Email: {$email}");
        $this->info("Username: {$username}");
        
        return 0;
    }
}
