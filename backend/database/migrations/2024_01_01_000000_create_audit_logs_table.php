<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAuditLogsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();
            $table->string('action');
            $table->string('model');
            $table->unsignedBigInteger('model_id')->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('user_name')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->text('url')->nullable();
            $table->json('changes')->nullable();
            $table->timestamp('created_at')->useCurrent();
            
            // Índices para búsquedas eficientes
            $table->index(['model', 'model_id']);
            $table->index('action');
            $table->index('user_id');
            $table->index('created_at');
            $table->index(['model', 'action']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('audit_logs');
    }
}