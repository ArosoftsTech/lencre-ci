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
        Schema::table('articles', function (Blueprint $table) {
            $table->unsignedSmallInteger('ai_score')->nullable();
            $table->string('ai_level', 20)->nullable();
            $table->timestamp('ai_reviewed_at')->nullable();
            $table->boolean('ai_override')->default(false);
            $table->foreignId('ai_override_by')->nullable()->references('id')->on('users')->nullOnDelete();
            $table->text('ai_override_reason')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
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
};
