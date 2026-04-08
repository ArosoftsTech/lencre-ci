<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AiAnalysisReport extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'report' => 'json',
            'analyzed_at' => 'datetime',
        ];
    }

    public function article(): BelongsTo
    {
        return $this->belongsTo(Article::class);
    }

    public function flags(): HasMany
    {
        return $this->hasMany(AiFlag::class, 'report_id');
    }

    public function feedbacks(): HasMany
    {
        return $this->hasMany(AiFeedback::class, 'report_id');
    }
}
