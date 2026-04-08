<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('draft', 'review_pending', 'ai_review_pending', 'ai_corrections_required', 'ai_blocked', 'published', 'rejected', 'scheduled') NOT NULL DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('draft', 'review_pending', 'published', 'rejected', 'scheduled') NOT NULL DEFAULT 'draft'");
    }
};
