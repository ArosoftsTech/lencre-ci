<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\CategoryController;
use App\Http\Controllers\Api\V1\ArticleController;
use App\Http\Controllers\Api\V1\MediaController;
use App\Http\Controllers\Api\V1\MultimediaController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\JobOfferController;
use App\Http\Controllers\Api\V1\CompanyProfileController;
use App\Http\Controllers\Api\Redaction\AuthController as RedactionAuthController;
use App\Http\Controllers\Api\Redaction\ProfileController as RedactionProfileController;

Route::prefix('v1')->group(function () {
    // Auth Admin
    Route::group(['prefix' => 'auth'], function () {
        Route::post('login', [AuthController::class, 'login'])->name('login');
        Route::post('logout', [AuthController::class, 'logout'])->middleware(['auth:api', 'panel:admin']);
        Route::post('refresh', [AuthController::class, 'refresh'])->middleware(['auth:api', 'panel:admin']);
        Route::post('me', [AuthController::class, 'me'])->middleware(['auth:api', 'panel:admin']);
    });


    // --- Protected routes (CMS) ---
    Route::middleware(['auth:api', 'panel:admin'])->group(function () {
        // Articles CRUD
        Route::get('articles/{id}', [ArticleController::class, 'showById']);
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

        // Job Offers CRUD
        Route::post('job-offers', [JobOfferController::class, 'store']);
        Route::put('job-offers/{id}', [JobOfferController::class, 'update']);
        Route::delete('job-offers/{id}', [JobOfferController::class, 'destroy']);
        Route::post('job-offers/{id}/toggle-status', [JobOfferController::class, 'toggleStatus']);

        // Company Profiles CRUD
        Route::post('company-profiles', [CompanyProfileController::class, 'store']);
        Route::put('company-profiles/{id}', [CompanyProfileController::class, 'update']);
        Route::delete('company-profiles/{id}', [CompanyProfileController::class, 'destroy']);

        // Multimedia CRUD (admin - POST/PUT/DELETE)
        Route::post('multimedia', [MultimediaController::class, 'store']);
        Route::put('multimedia/{id}', [MultimediaController::class, 'update']);
        Route::delete('multimedia/{id}', [MultimediaController::class, 'destroy']);
        Route::post('multimedia/{id}/validate', [MultimediaController::class, 'validate_media']);
        Route::post('multimedia/{id}/reject', [MultimediaController::class, 'reject']);

        // Dashboard stats
        Route::get('dashboard/stats', function () {
            return response()->json([
                'articles_count' => \App\Models\Article::count(),
                'categories_count' => \App\Models\Category::count(),
                'users_count' => \App\Models\User::count(),
                'job_offers_count' => \App\Models\JobOffer::count(),
                'active_job_offers_count' => \App\Models\JobOffer::active()->count(),
                'companies_count' => \App\Models\CompanyProfile::count(),
                'multimedia_count' => \App\Models\Multimedia::count(),
                'published_multimedia_count' => \App\Models\Multimedia::published()->count(),
                'recent_articles' => \App\Models\Article::with(['category', 'author'])
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(),
                'recent_job_offers' => \App\Models\JobOffer::with('author')
                    ->orderBy('created_at', 'desc')
                    ->take(5)
                    ->get(),
            ]);
        });
    });

    // --- Public routes (After admin to avoid conflict) ---
    
    // Categories (public)
    Route::get('categories', [CategoryController::class, 'index']);
    Route::get('categories/{slug}', [CategoryController::class, 'show']);

    // Articles (public)
    Route::get('articles/trending', [ArticleController::class, 'trending']);
    Route::get('articles', [ArticleController::class, 'index']);
    Route::get('articles/{slug}', [ArticleController::class, 'show']);
    Route::post('articles/{id}/share', [ArticleController::class, 'incrementShare']);

    // Job Offers (public)
    Route::get('job-offers/stats', [JobOfferController::class, 'stats']);
    Route::get('job-offers', [JobOfferController::class, 'index']);
    Route::get('job-offers/{slug}', [JobOfferController::class, 'show']);

    // Multimedia (public - liste)
    Route::get('multimedia', [MultimediaController::class, 'index']);

    // Multimedia (public - détail par slug)
    Route::get('multimedia/{slug}', [MultimediaController::class, 'show']);

    // Company Profiles (public)
    Route::get('company-profiles', [CompanyProfileController::class, 'index']);
    Route::get('company-profiles/{slug}', [CompanyProfileController::class, 'show']);
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

        // Multimedia journalist CRUD
        Route::get('multimedia', [\App\Http\Controllers\Api\Redaction\MultimediaController::class, 'index']);
        Route::get('multimedia/{id}', [\App\Http\Controllers\Api\Redaction\MultimediaController::class, 'show']);
        Route::post('multimedia', [\App\Http\Controllers\Api\Redaction\MultimediaController::class, 'store']);
        Route::put('multimedia/{id}', [\App\Http\Controllers\Api\Redaction\MultimediaController::class, 'update']);
        Route::delete('multimedia/{id}', [\App\Http\Controllers\Api\Redaction\MultimediaController::class, 'destroy']);
        Route::post('multimedia/{id}/submit', [\App\Http\Controllers\Api\Redaction\MultimediaController::class, 'submit']);
        Route::delete('media/{filename}', [\App\Http\Controllers\Api\Redaction\MediaController::class, 'destroy']);

        // Dashboard stats pour le journaliste connecté
        Route::get('dashboard-stats', function (Request $request) {
            $user = $request->user();
            $userId = $user->id;

            $draftCount = \App\Models\Article::where('author_id', $userId)
                ->whereIn('status', ['draft', 'edit_requested'])
                ->count();

            $pendingCount = \App\Models\Article::where('author_id', $userId)
                ->where('status', 'review_pending')
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
