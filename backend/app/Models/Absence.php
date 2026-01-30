<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Absence extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'student_id',
        'date',
        'type',
        'duration',
        'status',
        'reason',
        'session',
        'day_number',
        'original_session',
        'created_by',
    ];

    protected $casts = [
        'date' => 'date',
        'duration' => 'decimal:2',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopeByDateRange($query, $from, $to)
    {
        return $query->whereBetween('date', [$from, $to]);
    }

    public function scopeByStatus($query, $status)
    {
        return $query->where('status', $status);
    }

    public function scopeByGroup($query, $groupId)
    {
        return $query->whereHas('student', function ($q) use ($groupId) {
            $q->where('group_id', $groupId);
        });
    }
}