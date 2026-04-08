<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Article extends Model
{
    protected $fillable = ['title', 'slug', 'excerpt', 'content', 'featured_image', 'is_trending', 'is_urgent', 'published_at', 'category_id', 'author_id', 'status', 'meta_title', 'meta_description', 'meta_keywords', 'audio_url', 'credit_photo', 'ai_score', 'ai_level', 'ai_reviewed_at', 'ai_override', 'ai_override_by', 'ai_override_reason', 'shares_count'];

    protected function casts(): array
    {
        return [
            'is_trending' => 'boolean',
            'is_urgent' => 'boolean',
            'published_at' => 'datetime',
            'meta_keywords' => 'array',
            'ai_reviewed_at' => 'datetime',
            'ai_override' => 'boolean',
            'shares_count' => 'integer',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    public function versions(): HasMany
    {
        return $this->hasMany(ArticleVersion::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(ArticleReview::class);
    }

    public function aiAnalysisReports(): HasMany
    {
        return $this->hasMany(AiAnalysisReport::class);
    }
}
