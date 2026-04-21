<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Builder;

class CompanyProfile extends Model
{
    protected $fillable = [
        'name', 'slug', 'logo', 'description',
        'website', 'sector', 'is_featured', 'sort_order',
    ];

    protected function casts(): array
    {
        return [
            'is_featured' => 'boolean',
            'sort_order'  => 'integer',
        ];
    }

    /* ── Scopes ── */

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true)->orderBy('sort_order');
    }

    /* ── Helpers ── */

    /**
     * Count active job offers matching this company name.
     * Since job_offers stores company_name as a string, we match on name.
     */
    public function getActiveOffersCountAttribute(): int
    {
        return JobOffer::active()
            ->where('company_name', $this->name)
            ->count();
    }
}
