<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'cef',
        'first_name',
        'last_name',
        'group_id',
        'level',
        'cin',
        'email',
        'hours',
        'tardies',
        'days_absent',
        'justified_absences',
        'observation',
        'class_group',
    ];

    protected $casts = [
        'hours' => 'decimal:2',
        'tardies' => 'integer',
        'days_absent' => 'decimal:2',
        'justified_absences' => 'integer',
    ];

    protected $appends = ['full_name'];

    public function group()
    {
        return $this->belongsTo(Group::class);
    }

    public function absences()
    {
        return $this->hasMany(Absence::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function getAbsenceRateAttribute(): float
    {
        $totalDays = $this->absences()->distinct('date')->count('date');
        if ($totalDays === 0) return 0;
        
        $absentDays = $this->absences()
            ->where('status', 'absent')
            ->distinct('date')
            ->count('date');
        
        return round(($absentDays / $totalDays) * 100, 2);
    }

    public function getCurrentSanction()
    {
        $sessions = $this->hours / 2.5; // Each session is 2.5 hours
        
        return SanctionConfig::where('is_active', true)
            ->where('threshold', '<=', $sessions)
            ->orderBy('threshold', 'desc')
            ->first();
    }

    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhere('cef', 'like', "%{$search}%")
              ->orWhere('cin', 'like', "%{$search}%");
        });
    }

    public function scopeByGroup($query, $groupId)
    {
        return $query->where('group_id', $groupId);
    }

    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }
}