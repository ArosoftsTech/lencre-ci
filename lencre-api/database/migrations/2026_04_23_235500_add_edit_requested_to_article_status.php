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
        // On ajoute 'edit_requested' et on garde les autres statuts valides
        // Note: On garde les statuts IA pour l'instant pour éviter de casser des données existantes si elles existent, 
        // mais on s'assure que 'edit_requested' est présent.
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('draft', 'review_pending', 'edit_requested', 'published', 'rejected', 'scheduled', 'ai_review_pending', 'ai_corrections_required', 'ai_blocked') NOT NULL DEFAULT 'draft'");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("ALTER TABLE articles MODIFY COLUMN status ENUM('draft', 'review_pending', 'published', 'rejected', 'scheduled', 'ai_review_pending', 'ai_corrections_required', 'ai_blocked') NOT NULL DEFAULT 'draft'");
    }
};
