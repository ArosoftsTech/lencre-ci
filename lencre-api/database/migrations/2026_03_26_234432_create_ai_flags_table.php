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
        Schema::create('ai_flags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('report_id')->references('id')->on('ai_analysis_reports')->onDelete('cascade');
            $table->string('flag_type', 40)->nullable();
            $table->string('severity', 10)->nullable();
            $table->text('description')->nullable();
            $table->unsignedSmallInteger('paragraph_index')->nullable();
            $table->boolean('resolved')->default(false);
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ai_flags');
    }
};
