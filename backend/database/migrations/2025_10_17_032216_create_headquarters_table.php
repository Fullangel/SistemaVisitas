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
        Schema::create('headquarters', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('address', 200);
            $table->string('code', 10)->unique();
            $table->unsignedBigInteger('region_id');
            $table->timestamps();
            
            $table->foreign('region_id')->references('id')->on('regiones')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('headquarters');
    }
};
