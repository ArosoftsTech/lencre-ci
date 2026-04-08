<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->enum('status', ['draft', 'pending_review', 'published', 'rejected', 'scheduled'])->default('draft')->after('content');
            $table->string('meta_title', 60)->nullable()->after('status');
            $table->string('meta_description', 160)->nullable()->after('meta_title');
            $table->json('meta_keywords')->nullable()->after('meta_description'); // array of tags
            $table->string('audio_url')->nullable()->after('meta_keywords');
            $table->string('credit_photo')->nullable()->after('audio_url');
        });
    }

    public function down(): void
    {
        Schema::table('articles', function (Blueprint $table) {
            $table->dropColumn(['status', 'meta_title', 'meta_description', 'meta_keywords', 'audio_url', 'credit_photo']);
        });
    }
};
