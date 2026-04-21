<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('job_offers', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            $table->string('company_name');
            $table->string('company_logo')->nullable();
            $table->text('description')->nullable();
            $table->string('sector')->nullable();            // BTP, Banque/Finance, Commerce, Informatique, RH, Transport
            $table->string('education_level')->nullable();   // BAC, BAC+2, BAC+3, BAC+4, BAC+5+
            $table->string('type')->default('emploi');       // emploi, stage, freelance, consultance
            $table->string('location')->default('Abidjan');
            $table->string('featured_image')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->timestamp('published_at')->nullable();
            $table->timestamp('deadline_at')->nullable();
            $table->string('external_link')->nullable();
            $table->string('status')->default('draft');      // draft, published, expired, archived
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->unsignedInteger('views_count')->default(0);
            $table->timestamps();

            $table->index(['status', 'published_at']);
            $table->index('type');
            $table->index('sector');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('job_offers');
    }
};
