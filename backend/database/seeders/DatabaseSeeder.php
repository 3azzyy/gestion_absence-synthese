<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin / creators
        $admin = User::factory()->create([
            'username' => 'admin',
            'full_name' => 'Admin User',
            'role' => 'admin',
        ]);

        // Create some additional users who will "create" absences
        $creators = User::factory(3)->create();

        // Create groups
        $groups = \App\Models\Group::factory()->count(5)->create();

        // Create sanction configs
        \App\Models\SanctionConfig::factory()->count(4)->create();

        // Create students (spread across groups)
        $students = \App\Models\Student::factory()
            ->count(60)
            ->make()
            ->each(function ($student) use ($groups) {
                $student->group_id = $groups->random()->id;
                $student->save();
            });

        // Create absences for students with varying dates and statuses
        foreach ($students as $student) {
            $count = rand(0, 8);
            for ($i = 0; $i < $count; $i++) {
                \App\Models\Absence::factory()->create([
                    'student_id' => $student->id,
                    'created_by' => $creators->random()->id,
                ]);
            }
        }

        // Keep a test user for manual login
        User::factory()->create([
            'username' => 'test',
            'full_name' => 'Test User',
            'role' => 'staff',
        ]);
    }
}
