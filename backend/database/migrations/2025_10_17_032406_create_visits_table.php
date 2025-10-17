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
        Schema::create('visits', function (Blueprint $table) {
            $table->id();
            $table->string('visit_code', 50)->unique();
            $table->string('purpose', 255);
            $table->text('description')->nullable();
            $table->date('visit_date');
            $table->time('entry_time')->nullable();
            $table->time('exit_time')->nullable();
            $table->string('status', 50)->default('pending');
            $table->string('priority', 50)->default('normal');
            $table->string('visitor_name', 255);
            $table->string('visitor_email', 255)->nullable();
            $table->string('visitor_phone', 20);
            $table->string('visitor_identification', 50);
            $table->string('visitor_company', 255)->nullable();
            $table->unsignedBigInteger('employee_id');
            $table->unsignedBigInteger('department_id');
            $table->unsignedBigInteger('headquarter_id');
            $table->unsignedBigInteger('created_by');
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->boolean('has_vehicle')->default(false);
            $table->string('vehicle_plate', 20)->nullable();
            $table->string('vehicle_model', 100)->nullable();
            $table->string('vehicle_color', 50)->nullable();
            $table->timestamps();
            
            $table->foreign('employee_id')->references('id')->on('employees')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
            $table->foreign('headquarter_id')->references('id')->on('headquarters')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('approved_by')->references('id')->on('users')->onDelete('set null');
            
            $table->index('visit_code');
            $table->index('status');
            $table->index('visit_date');
            $table->index('employee_id');
            $table->index('department_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visits');
    }
};
