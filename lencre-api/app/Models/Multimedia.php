<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class Multimedia extends Model
{
    protected $table = 'multimedia';

    protected $fillable = [
        'title',
        'slug',
        'description',
        'type',
        'external_url',
        'embed_url',
        'thumbnail',
        'duration',
        'is_featured',
        'status',
        'views_count',
        'author_id',
        'published_at',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'published_at' => 'datetime',
            'views_count' => 'integer',
        ];
    }

    // --- Relations ---

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    // --- Scopes ---

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published')->whereNotNull('published_at');
    }

    public function scopeVideos(Builder $query): Builder
    {
        return $query->where('type', 'video');
    }

    public function scopePodcasts(Builder $query): Builder
    {
        return $query->where('type', 'podcast');
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    // --- Helpers ---

    /**
     * Génère automatiquement l'embed URL à partir de l'URL externe.
     */
    public static function generateEmbedUrl(string $externalUrl): ?string
    {
        // YouTube
        if (preg_match('/(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/', $externalUrl, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        // SoundCloud — on ne peut pas générer facilement, retourner null
        // L'utilisateur devra fournir l'embed URL manuellement
        return null;
    }
}
