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
        // Supprimer les tables IA
        Schema::dropIfExists('ai_feedback');
        Schema::dropIfExists('ai_flags');
        Schema::dropIfExists('ai_analysis_reports');

        // Supprimer les colonnes IA de la table articles
        Schema::table('articles', function (Blueprint $table) {
            $table->dropForeign(['ai_override_by']);
            $table->dropColumn([
                'ai_score',
                'ai_level',
                'ai_reviewed_at',
                'ai_override',
                'ai_override_by',
                'ai_override_reason'
            ]);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->unsignedSmallInteger('ai_score')->nullable();
            $table->string('ai_level', 20)->nullable();
            $table->timestamp('ai_reviewed_at')->nullable();
            $table->boolean('ai_override')->default(false);
            $table->foreignId('ai_override_by')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->text('ai_override_reason')->nullable();
        });

        Schema::create('ai_analysis_reports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->string('task_id')->unique();
            $table->integer('score')->default(0);
            $table->string('level', 20)->default('BLOQUE');
            $table->text('recommendation')->nullable();
            $table->integer('processing_time_ms')->nullable();
            $table->text('summary_for_editor')->nullable();
            $table->timestamp('analyzed_at')->nullable();
            $table->timestamps();
        });

        Schema::create('ai_flags', function (Blueprint $table) {
            $table->id();
            $table->foreignId('ai_analysis_report_id')->constrained()->cascadeOnDelete();
            $table->string('issue');
            $table->string('severity', 20);
            $table->text('detail')->nullable();
            $table->integer('paragraph')->nullable();
            $table->timestamps();
        });

        Schema::create('ai_feedback', function (Blueprint $table) {
            $table->id();
            $table->foreignId('article_id')->constrained()->cascadeOnDelete();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->boolean('is_helpful');
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }
};
