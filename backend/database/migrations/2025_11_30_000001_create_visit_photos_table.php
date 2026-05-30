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
        Schema::create('visit_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('visit_id')->constrained('visits')->onDelete('cascade');
            $table->enum('photo_type', ['visitor', 'id_card'])->comment('Tipo de foto: visitante o cédula');
            $table->string('original_path')->comment('Ruta de la foto original');
            $table->string('medium_path')->comment('Ruta de la foto tamaño medio');
            $table->string('thumbnail_path')->comment('Ruta de la foto miniatura');
            $table->integer('file_size')->nullable()->comment('Tamaño total en bytes');
            $table->string('mime_type')->default('image/webp');
            $table->timestamps();
            
            // Índices para optimizar búsquedas
            $table->index(['visit_id', 'photo_type']);
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visit_photos');
    }
};
