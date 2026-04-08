<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Attributes\Fillable;

#[Fillable(['name', 'slug', 'color_code'])]
class Category extends Model
{
    public function articles(): HasMany
    {
        return $this->hasMany(Article::class);
    }
}
