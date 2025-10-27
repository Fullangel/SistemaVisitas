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
        // Índices para tabla visits - optimizan las búsquedas más frecuentes
        Schema::table('visits', function (Blueprint $table) {
            // Índices compuestos para búsquedas comunes
            $table->index(['visit_date', 'status']);
            $table->index(['employee_id', 'visit_date']);
            $table->index(['department_id', 'visit_date']);
            $table->index(['headquarter_id', 'visit_date']);
            $table->index(['created_by', 'visit_date']);
            $table->index(['approved_by', 'visit_date']);
            
            // Índice para búsquedas por rango de fechas
            $table->index(['visit_date', 'entry_time']);
            $table->index(['visit_date', 'exit_time']);
            
            // Índices para filtros por estado y prioridad
            $table->index(['status', 'priority']);
            $table->index(['status', 'visit_date']);
            
            // Índices para búsquedas por visitante
            $table->index(['visitor_identification', 'visit_date']);
            $table->index(['visitor_email', 'visit_date']);
            
            // Índices para vehículos
            $table->index(['has_vehicle', 'vehicle_plate']);
        });

        // Índices para tabla users - optimizan autenticación y búsquedas
        Schema::table('users', function (Blueprint $table) {
            // Índices compuestos para login y búsquedas
            $table->index(['email', 'status']);
            $table->index(['username', 'status']);
            $table->index(['role_id', 'status']);
            
            // Índice para último acceso
            $table->index('last_login_at');
            
            // Índice para verificación de email
            $table->index(['email_verified_at', 'status']);
        });

        // Índices para tabla employees - optimizan búsquedas de empleados
        Schema::table('employees', function (Blueprint $table) {
            // Índices compuestos para búsquedas frecuentes
            $table->index(['department_id', 'status']);
            $table->index(['designation_id', 'status']);
            $table->index(['identification', 'status']);
            $table->index(['employee_code', 'status']);
            
            // Índice para búsquedas por nombre
            $table->index(['first_name', 'last_name']);
            $table->index(['last_name', 'first_name']);
        });

        // Índices para tabla visit_logs - optimizan auditoría
        Schema::table('visit_logs', function (Blueprint $table) {
            // Índices compuestos para logs
            $table->index(['visit_id', 'created_at']);
            $table->index(['user_id', 'created_at']);
            $table->index(['action', 'created_at']);
            
            // Índice para búsqueda por cambios de estado
            $table->index(['status_from', 'status_to']);
        });

        // Índices para tabla notifications - optimizan notificaciones
        Schema::table('notifications', function (Blueprint $table) {
            // Índices compuestos para notificaciones no leídas
            $table->index(['user_id', 'is_read']);
            $table->index(['user_id', 'type', 'is_read']);
            $table->index(['related_type', 'related_id']);
            
            // Índice para limpieza de notificaciones antiguas
            $table->index('read_at');
        });

        // Índices para tabla departments - optimizan búsquedas por sede
        Schema::table('departments', function (Blueprint $table) {
            $table->index(['headquarter_id', 'name']);
            $table->index(['headquarter_id', 'code']);
        });

        // Índices para tabla headquarters - optimizan búsquedas por región
        Schema::table('headquarters', function (Blueprint $table) {
            $table->index(['region_id', 'name']);
            $table->index(['region_id', 'code']);
        });

        // Índices para tabla visit_attachments - optimizan búsquedas de archivos
        Schema::table('visit_attachments', function (Blueprint $table) {
            $table->index(['visit_id', 'file_type']);
            $table->index(['uploaded_by', 'created_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Eliminar índices de visits
        Schema::table('visits', function (Blueprint $table) {
            $table->dropIndex(['visit_date', 'status']);
            $table->dropIndex(['employee_id', 'visit_date']);
            $table->dropIndex(['department_id', 'visit_date']);
            $table->dropIndex(['headquarter_id', 'visit_date']);
            $table->dropIndex(['created_by', 'visit_date']);
            $table->dropIndex(['approved_by', 'visit_date']);
            $table->dropIndex(['visit_date', 'entry_time']);
            $table->dropIndex(['visit_date', 'exit_time']);
            $table->dropIndex(['status', 'priority']);
            $table->dropIndex(['status', 'visit_date']);
            $table->dropIndex(['visitor_identification', 'visit_date']);
            $table->dropIndex(['visitor_email', 'visit_date']);
            $table->dropIndex(['has_vehicle', 'vehicle_plate']);
        });

        // Eliminar índices de users
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['email', 'status']);
            $table->dropIndex(['username', 'status']);
            $table->dropIndex(['role_id', 'status']);
            $table->dropIndex(['last_login_at']);
            $table->dropIndex(['email_verified_at', 'status']);
        });

        // Eliminar índices de employees
        Schema::table('employees', function (Blueprint $table) {
            $table->dropIndex(['department_id', 'status']);
            $table->dropIndex(['designation_id', 'status']);
            $table->dropIndex(['identification', 'status']);
            $table->dropIndex(['employee_code', 'status']);
            $table->dropIndex(['first_name', 'last_name']);
            $table->dropIndex(['last_name', 'first_name']);
        });

        // Eliminar índices de visit_logs
        Schema::table('visit_logs', function (Blueprint $table) {
            $table->dropIndex(['visit_id', 'created_at']);
            $table->dropIndex(['user_id', 'created_at']);
            $table->dropIndex(['action', 'created_at']);
            $table->dropIndex(['status_from', 'status_to']);
        });

        // Eliminar índices de notifications
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['user_id', 'is_read']);
            $table->dropIndex(['user_id', 'type', 'is_read']);
            $table->dropIndex(['related_type', 'related_id']);
            $table->dropIndex(['read_at']);
        });

        // Eliminar índices de departments
        Schema::table('departments', function (Blueprint $table) {
            $table->dropIndex(['headquarter_id', 'name']);
            $table->dropIndex(['headquarter_id', 'code']);
        });

        // Eliminar índices de headquarters
        Schema::table('headquarters', function (Blueprint $table) {
            $table->dropIndex(['region_id', 'name']);
            $table->dropIndex(['region_id', 'code']);
        });

        // Eliminar índices de visit_attachments
        Schema::table('visit_attachments', function (Blueprint $table) {
            $table->dropIndex(['visit_id', 'file_type']);
            $table->dropIndex(['uploaded_by', 'created_at']);
        });
    }
};