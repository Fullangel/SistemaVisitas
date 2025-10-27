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
        Schema::create('two_factor_codes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('code', 10)->index();
            $table->enum('type', ['email', 'sms', 'totp', 'recovery'])->index();
            $table->timestamp('expires_at')->index();
            $table->boolean('used')->default(false)->index();
            $table->integer('attempts')->default(0);
            $table->string('ip_address', 45);
            $table->text('user_agent');
            $table->timestamps();
            
            $table->index(['user_id', 'type']);
            $table->index(['user_id', 'used']);
            $table->index(['user_id', 'code']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('two_factor_codes');
    }
};
