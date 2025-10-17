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
        Schema::create('visit_attachments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('visit_id');
            $table->string('file_name', 255);
            $table->string('file_path', 500);
            $table->string('file_type', 100);
            $table->unsignedBigInteger('file_size');
            $table->string('mime_type', 100);
            $table->unsignedBigInteger('uploaded_by');
            $table->timestamps();
            
            $table->foreign('visit_id')->references('id')->on('visits')->onDelete('cascade');
            $table->foreign('uploaded_by')->references('id')->on('users')->onDelete('cascade');
            
            $table->index('visit_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visit_attachments');
    }
};
