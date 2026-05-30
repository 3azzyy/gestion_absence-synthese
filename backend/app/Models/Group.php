<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Group extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'description'];

    // Relation avec les étudiants
    public function students()
    {
        return $this->hasMany(Student::class);
    }

    // Compteur d'étudiants (exclut les supprimés par défaut)
    public function getStudentCountAttribute()
    {
        return $this->students()->count();
    }

    /**
     * Logique de cascade pour le Soft Delete et la Restauration
     */
    protected static function booted()
    {
        // Quand on supprime un Groupe
        static::deleting(function ($group) {
            // Supprime tous les étudiants liés (déclenchera aussi le booted de Student)
            $group->students()->each(function ($student) {
                $student->delete();
            });
        });

        // Quand on restaure un Groupe
        static::restoring(function ($group) {
            // Restaure uniquement les étudiants qui ont été supprimés en même temps
            $group->students()->onlyTrashed()->each(function ($student) {
                $student->restore();
            });
        });
    }
}