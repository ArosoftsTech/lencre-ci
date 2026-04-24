<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('multimedia', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->text('description')->nullable();
            $table->enum('type', ['video', 'podcast'])->default('video');
            $table->string('external_url'); // Lien YouTube, SoundCloud, Spotify, etc.
            $table->string('embed_url')->nullable(); // URL d'intégration iframe
            $table->string('thumbnail')->nullable(); // URL miniature
            $table->string('duration')->nullable(); // ex: "12:05"
            $table->boolean('is_featured')->default(false);
            $table->enum('status', ['draft', 'review_pending', 'published', 'rejected'])->default('draft');
            $table->unsignedInteger('views_count')->default(0);
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->timestamp('published_at')->nullable();
            $table->timestamps();

            $table->index(['type', 'status']);
            $table->index('published_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('multimedia');
    }
};
