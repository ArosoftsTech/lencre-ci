<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\Redaction\AuthController as RedactionAuthController;
use App\Http\Controllers\Api\Redaction\ProfileController as RedactionProfileController;

Route::prefix('v1')->group(function () {
    // Auth Admin
    Route::group(['prefix' => 'auth'], function () {
        Route::post('login', [AuthController::class, 'login']);
        Route::post('logout', [AuthController::class, 'logout'])->middleware(['auth:api', 'panel:admin']);
        Route::post('refresh', [AuthController::class, 'refresh'])->middleware(['auth:api', 'panel:admin']);
        Route::post('me', [AuthController::class, 'me'])->middleware(['auth:api', 'panel:admin']);
    });

    // Categories (public)
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{slug}', [CategoryController::class, 'show']);

    // Articles (public)
    Route::get('articles/trending', [ArticleController::class, 'trending']);
    Route::get('articles', [ArticleController::class, 'index']);
    Route::get('articles/{slug}', [ArticleController::class, 'show']);
    Route::post('articles/{id}/share', [ArticleController::class, 'incrementShare']);

    // --- Protected routes (CMS) ---
    Route::middleware(['auth:api', 'panel:admin'])->group(function () {
        // Articles CRUD
        Route::post('articles', [ArticleController::class, 'store']);
        Route::put('articles/{id}', [ArticleController::class, 'update']);
        Route::delete('articles/{id}', [ArticleController::class, 'destroy']);
        
        // Moderation
        Route::post('articles/{id}/validate', [ArticleController::class, 'validateArticle']);
        Route::post('articles/{id}/reject', [ArticleController::class, 'rejectArticle']);
        Route::post('articles/{id}/request-revision', [ArticleController::class, 'requestRevision']);

        // Categories CRUD
        Route::post('categories', [CategoryController::class, 'store']);
        Route::put('categories/{id}', [CategoryController::class, 'update']);
        Route::delete('categories/{id}', [CategoryController::class, 'destroy']);

        // Media
        Route::post('media/upload', [MediaController::class, 'upload']);
        Route::get('media', [MediaController::class, 'index']);
        Route::delete('media/{filename}', [MediaController::class, 'destroy']);

        // Users / Rédacteurs
        Route::get('users', [UserController::class, 'index']);
        Route::post('users', [UserController::class, 'store']);
        Route::put('users/{id}', [UserController::class, 'update']);
        Route::delete('users/{id}', [UserController::class, 'destroy']);

        // Dashboard stats
        Route::get('dashboard/stats', function () {
            return response()->json([
                'articles_count' => \App\Models\Article::count(),
                'categories_count' => \App\Models\Category::count(),
                'users_count' => \App\Models\User::count(),
                'recent_articles' => \App\Models\Article::with(['category', 'author'])
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(),
            ]);
        });
    });
});

Route::prefix('v1/internal')->group(function () {
    Route::post('ai-report', [\App\Http\Controllers\Api\Internal\AiCallbackController::class, 'store']);
});

Route::prefix('v1/redaction')->group(function () {
    Route::group(['prefix' => 'auth'], function () {
        Route::post('login', [RedactionAuthController::class, 'login']);
        Route::post('logout', [RedactionAuthController::class, 'logout'])->middleware(['auth:api', 'panel:redaction']);
        Route::post('refresh', [RedactionAuthController::class, 'refresh'])->middleware(['auth:api', 'panel:redaction']);
        Route::post('me', [RedactionAuthController::class, 'me'])->middleware(['auth:api', 'panel:redaction']);
    });

    Route::middleware(['auth:api', 'panel:redaction'])->group(function () {
        Route::get('profile', [RedactionProfileController::class, 'show']);
        Route::put('profile', [RedactionProfileController::class, 'update']);
        
        // Articles journalists CRUD
        Route::get('articles', [\App\Http\Controllers\Api\Redaction\ArticleController::class, 'index']);
        Route::get('articles/{id}', [\App\Http\Controllers\Api\Redaction\ArticleController::class, 'show']);
        Route::post('articles', [\App\Http\Controllers\Api\Redaction\ArticleController::class, 'store']);
        Route::put('articles/{id}', [\App\Http\Controllers\Api\Redaction\ArticleController::class, 'update']);
        Route::post('articles/{id}/submit', [\App\Http\Controllers\Api\Redaction\ArticleController::class, 'submit']);

        // Media journalist workspace
        Route::get('media', [\App\Http\Controllers\Api\Redaction\MediaController::class, 'index']);
        Route::post('media/upload', [\App\Http\Controllers\Api\Redaction\MediaController::class, 'upload']);
        Route::delete('media/{filename}', [\App\Http\Controllers\Api\Redaction\MediaController::class, 'destroy']);

        // Dashboard stats pour le journaliste connecté
        Route::get('dashboard-stats', function (Request $request) {
            $user = $request->user();
            $userId = $user->id;

            $draftCount = \App\Models\Article::where('author_id', $userId)
                ->whereIn('status', ['draft', 'edit_requested'])
                ->count();

            $pendingCount = \App\Models\Article::where('author_id', $userId)
                ->where('status', 'pending_review')
                ->count();

            $publishedCount = \App\Models\Article::where('author_id', $userId)
                ->where('status', 'published')
                ->count();

            // Calcul simplifié de l'espace média (en MB)
            $mediaPath = storage_path('app/public/media/' . $userId);
            $storageUsed = 0;
            if (is_dir($mediaPath)) {
                $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($mediaPath));
                foreach ($files as $file) {
                    if ($file->isFile()) {
                        $storageUsed += $file->getSize();
                    }
                }
            }
            $storageUsedMb = round($storageUsed / (1024 * 1024), 1);

            return response()->json([
                'drafts' => $draftCount,
                'pending' => $pendingCount,
                'published' => $publishedCount,
                'storage_used_mb' => $storageUsedMb,
                'storage_quota_mb' => $user->storage_quota_mb ?? 100,
            ]);
        });
    });
});
