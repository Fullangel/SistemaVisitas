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
        Schema::create('trusted_devices', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('device_name');
            $table->string('device_fingerprint', 64)->index();
            $table->string('ip_address', 45);
            $table->text('user_agent');
            $table->timestamp('last_used_at')->index();
            $table->boolean('is_trusted')->default(true)->index();
            $table->timestamps();
            
            $table->index(['user_id', 'device_fingerprint']);
            $table->index(['user_id', 'is_trusted']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('trusted_devices');
    }
};
