<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Agregar columnas de 2FA solo si no existen
            if (!Schema::hasColumn('users', 'two_factor_secret')) {
                $table->string('two_factor_secret')->nullable()->after('password');
            }
            if (!Schema::hasColumn('users', 'two_factor_recovery_codes')) {
                $table->string('two_factor_recovery_codes')->nullable()->after('two_factor_secret');
            }
            if (!Schema::hasColumn('users', 'two_factor_confirmed_at')) {
                $table->timestamp('two_factor_confirmed_at')->nullable()->after('two_factor_recovery_codes');
            }
            if (!Schema::hasColumn('users', 'two_factor_enabled')) {
                $table->boolean('two_factor_enabled')->default(false)->after('two_factor_confirmed_at');
            }
            if (!Schema::hasColumn('users', 'two_factor_method')) {
                $table->string('two_factor_method')->nullable()->after('two_factor_enabled'); // 'totp', 'sms', 'email'
            }
            if (!Schema::hasColumn('users', 'phone_number')) {
                $table->string('phone_number')->nullable()->after('two_factor_method');
            }
            if (!Schema::hasColumn('users', 'last_login_ip')) {
                $table->string('last_login_ip')->nullable()->after('last_login_at');
            }
            if (!Schema::hasColumn('users', 'failed_login_attempts')) {
                $table->integer('failed_login_attempts')->default(0)->after('last_login_ip');
            }
            if (!Schema::hasColumn('users', 'locked_until')) {
                $table->timestamp('locked_until')->nullable()->after('failed_login_attempts');
            }
            if (!Schema::hasColumn('users', 'session_id')) {
                $table->string('session_id')->nullable()->after('locked_until');
            }
        });

        // Crear tabla de auditoría de autenticación solo si no existe
        if (!Schema::hasTable('authentication_logs')) {
            Schema::create('authentication_logs', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
                $table->string('username')->nullable();
                $table->string('email')->nullable();
                $table->string('action', 50); // 'login', 'logout', 'failed_login', '2fa_attempt', '2fa_success', '2fa_failed', 'account_locked', 'password_changed'
                $table->boolean('success')->default(false);
                $table->string('ip_address', 45);
                $table->string('user_agent');
                $table->string('country')->nullable();
                $table->string('city')->nullable();
                $table->decimal('latitude', 10, 8)->nullable();
                $table->decimal('longitude', 11, 8)->nullable();
                $table->string('device_fingerprint', 64)->nullable();
                $table->text('additional_data')->nullable();
                $table->timestamp('created_at');
                
                $table->index(['user_id', 'created_at']);
                $table->index(['action', 'created_at']);
                $table->index('ip_address');
                $table->index('device_fingerprint');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Solo eliminar la tabla de logs si existe
        if (Schema::hasTable('authentication_logs')) {
            Schema::dropIfExists('authentication_logs');
        }
        
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'two_factor_secret',
                'two_factor_recovery_codes',
                'two_factor_confirmed_at',
                'two_factor_enabled',
                'two_factor_method',
                'phone_number',
                'last_login_ip',
                'failed_login_attempts',
                'locked_until',
                'session_id'
            ]);
        });
    }
};