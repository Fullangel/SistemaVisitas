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
        // Deshabilitar foreign key checks temporalmente
        Schema::disableForeignKeyConstraints();
        
        // ============================================
        // FASE 1: ELIMINAR TABLAS REDUNDANTES
        // ============================================
        
        // 1. Eliminar tablas de particionamiento
        Schema::dropIfExists('visit_partitions');
        Schema::dropIfExists('visit_log_partitions');
        Schema::dropIfExists('visit_attachment_partitions');
        
        // 2. Eliminar sistema de citas (redundante con visits)
        Schema::dropIfExists('appointments');
        
        // 3. Eliminar sistema de pases de visitante
        Schema::dropIfExists('qr_codes');
        Schema::dropIfExists('vehicle_entries');
        Schema::dropIfExists('visitor_passes');
        
        // 4. Eliminar tabla de vehículos (según solicitud del usuario)
        Schema::dropIfExists('vehicles');
        
        // Rehabilitar foreign key checks
        Schema::enableForeignKeyConstraints();
        
        // ============================================
        // FASE 2: AGREGAR QR A VISITAS
        // ============================================
        
        Schema::table('visits', function (Blueprint $table) {
            if (!Schema::hasColumn('visits', 'qr_code')) {
                $table->string('qr_code', 255)->nullable()->after('visit_code');
            }
            if (!Schema::hasColumn('visits', 'qr_generated_at')) {
                $table->timestamp('qr_generated_at')->nullable()->after('qr_code');
            }
            if (!Schema::hasColumn('visits', 'qr_scanned_at')) {
                $table->timestamp('qr_scanned_at')->nullable()->after('qr_generated_at');
            }
        });
        
        // ============================================
        // FASE 3: MEJORAR ESQUEMA DE HEADQUARTERS
        // ============================================
        
        Schema::table('headquarters', function (Blueprint $table) {
            if (!Schema::hasColumn('headquarters', 'phone')) {
                $table->string('phone', 50)->nullable()->after('address');
            }
            if (!Schema::hasColumn('headquarters', 'email')) {
                $table->string('email', 100)->nullable()->after('phone');
            }
            if (!Schema::hasColumn('headquarters', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('email');
            }
            if (!Schema::hasColumn('headquarters', 'manager_name')) {
                $table->string('manager_name', 100)->nullable()->after('is_active');
            }
            if (!Schema::hasColumn('headquarters', 'capacity')) {
                $table->integer('capacity')->nullable()->after('manager_name');
            }
        });
        
        // ============================================
        // FASE 4: CORREGIR DEPARTMENTS
        // ============================================
        
        // Eliminar headquarter_id de departments (los departamentos son transversales)
        if (Schema::hasColumn('departments', 'headquarter_id')) {
            Schema::table('departments', function (Blueprint $table) {
                $table->dropForeign(['headquarter_id']);
                $table->dropColumn('headquarter_id');
            });
        }
        
        // Agregar descripción a departments
        Schema::table('departments', function (Blueprint $table) {
            if (!Schema::hasColumn('departments', 'description')) {
                $table->text('description')->nullable()->after('code');
            }
            if (!Schema::hasColumn('departments', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('description');
            }
        });
        
        // ============================================
        // FASE 5: MEJORAR EMPLOYEES
        // ============================================
        
        Schema::table('employees', function (Blueprint $table) {
            // Agregar headquarter_id para saber en qué sede trabaja
            if (!Schema::hasColumn('employees', 'headquarter_id')) {
                $table->unsignedBigInteger('headquarter_id')->nullable()->after('department_id');
                $table->foreign('headquarter_id')->references('id')->on('headquarters')->onDelete('set null');
            }
            
            // Agregar campo position si no existe
            if (!Schema::hasColumn('employees', 'position')) {
                $table->string('position', 100)->nullable()->after('designation_id');
            }
        });
        
        // ============================================
        // FASE 6: MEJORAR REGIONS
        // ============================================
        
        Schema::table('regions', function (Blueprint $table) {
            if (!Schema::hasColumn('regions', 'description')) {
                $table->text('description')->nullable()->after('code');
            }
            if (!Schema::hasColumn('regions', 'is_active')) {
                $table->boolean('is_active')->default(true)->after('description');
            }
        });
        
        // ============================================
        // FASE 7: MEJORAR BLOCKED_VISITORS
        // ============================================
        
        Schema::table('blocked_visitors', function (Blueprint $table) {
            // Agregar QR para visitantes bloqueados
            if (!Schema::hasColumn('blocked_visitors', 'qr_code')) {
                $table->string('qr_code', 255)->nullable()->after('visitor_identification');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revertir cambios en orden inverso
        
        // Fase 7
        Schema::table('blocked_visitors', function (Blueprint $table) {
            $table->dropColumn('qr_code');
        });
        
        // Fase 6
        Schema::table('regions', function (Blueprint $table) {
            $table->dropColumn(['description', 'is_active']);
        });
        
        // Fase 5
        Schema::table('employees', function (Blueprint $table) {
            $table->dropForeign(['headquarter_id']);
            $table->dropColumn(['headquarter_id', 'position']);
        });
        
        // Fase 4
        Schema::table('departments', function (Blueprint $table) {
            $table->dropColumn(['description', 'is_active']);
        });
        
        // Fase 3
        Schema::table('headquarters', function (Blueprint $table) {
            $table->dropColumn(['phone', 'email', 'is_active', 'manager_name', 'capacity']);
        });
        
        // Fase 2
        Schema::table('visits', function (Blueprint $table) {
            $table->dropColumn(['qr_code', 'qr_generated_at', 'qr_scanned_at']);
        });
        
        // Nota: No recreamos las tablas eliminadas en el down
        // Si se necesita revertir, se debe hacer manualmente
    }
};
