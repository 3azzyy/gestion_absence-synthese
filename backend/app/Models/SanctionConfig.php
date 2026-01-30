<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SanctionConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'code',
        'label',
        'threshold',
        'actions',
        'is_active',
        'order',
    ];

    protected $casts = [
        'threshold' => 'decimal:2',
        'actions' => 'array',
        'is_active' => 'boolean',
    ];

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeOrdered($query)
    {
        return $query->orderBy('order');
    }
}