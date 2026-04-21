<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class JobOffer extends Model
{
    protected $fillable = [
        'title', 'slug', 'company_name', 'company_logo', 'description',
        'sector', 'education_level', 'type', 'location', 'featured_image',
        'is_featured', 'published_at', 'deadline_at', 'external_link',
        'status', 'author_id', 'views_count',
    ];

    protected function casts(): array
    {
        return [
            'is_featured'  => 'boolean',
            'published_at' => 'datetime',
            'deadline_at'  => 'datetime',
            'views_count'  => 'integer',
        ];
    }

    /* ── Relations ── */

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'author_id');
    }

    /* ── Scopes ── */

    /** Only published offers */
    public function scopePublished(Builder $query): Builder
    {
        return $query->where('status', 'published');
    }

    /** Published AND not yet expired */
    public function scopeActive(Builder $query): Builder
    {
        return $query->published()
            ->where(function ($q) {
                $q->whereNull('deadline_at')
                  ->orWhere('deadline_at', '>=', now());
            });
    }

    /** Filter by type */
    public function scopeOfType(Builder $query, string $type): Builder
    {
        return $query->where('type', $type);
    }

    /** Filter by sector */
    public function scopeInSector(Builder $query, string $sector): Builder
    {
        return $query->where('sector', $sector);
    }

    /** Filter by education level */
    public function scopeRequiresEducation(Builder $query, string $level): Builder
    {
        return $query->where('education_level', $level);
    }

    /* ── Helpers ── */

    /** Color associated with the offer type */
    public function getTypeColorAttribute(): string
    {
        return match ($this->type) {
            'emploi'      => '#C1121F',
            'stage'       => '#2A9D8F',
            'freelance'   => '#F59E0B',
            'consultance' => '#6366F1',
            default       => '#64748B',
        };
    }

    /** Human-readable type label */
    public function getTypeLabelAttribute(): string
    {
        return strtoupper($this->type);
    }
}
