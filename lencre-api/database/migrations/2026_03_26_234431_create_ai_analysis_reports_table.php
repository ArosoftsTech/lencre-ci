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
        Schema::create('ai_analysis_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->onDelete('cascade');
            $table->uuid('task_id');
            $table->unsignedSmallInteger('score');
            $table->string('level', 20); // FIABLE | CORRECTIONS | BLOQUE
            $table->string('recommendation', 20); // PUBLIER | CORRIGER | BLOQUER
            $table->json('report');
            $table->integer('processing_time_ms')->nullable();
            $table->string('model_used', 60)->nullable();
            $table->timestamp('analyzed_at')->useCurrent();
            $table->unsignedSmallInteger('version')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_analysis_reports');
    }
};
