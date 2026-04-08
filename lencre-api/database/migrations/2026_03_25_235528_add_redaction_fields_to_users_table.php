<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Modify the existing 'role' column if it exists, otherwise it will be added below just in case.
        if (Schema::hasColumn('users', 'role')) {
            DB::statement("ALTER TABLE users MODIFY COLUMN role ENUM('admin', 'super-admin', 'super_admin', 'editeur_en_chef', 'journaliste', 'redacteur_web', 'pigiste', 'photographe', 'community_manager') DEFAULT 'journaliste'");
        }

        Schema::table('users', function (Blueprint $table) {
            if (!Schema::hasColumn('users', 'role')) {
                $table->enum('role', [
                    'admin', 'super_admin', 'editeur_en_chef', 'journaliste',
                    'redacteur_web', 'pigiste', 'photographe', 'community_manager'
                ])->default('journaliste')->after('password');
            }
            
            $table->enum('status', ['active', 'suspended', 'pending'])->default('pending')->after('role');
            $table->integer('storage_quota_mb')->default(500)->after('status');
            $table->integer('storage_used_mb')->default(0)->after('storage_quota_mb');
            $table->timestamp('suspended_at')->nullable()->after('storage_used_mb');
            $table->text('suspended_reason')->nullable()->after('suspended_at');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn([
                'status', 'storage_quota_mb', 'storage_used_mb', 
                'suspended_at', 'suspended_reason'
            ]);
            // Revert 'role' back to simple string or earlier enum if necessary
            // For simplicity in down(), we might just leave role as is or alter it back.
        });
    }
};
