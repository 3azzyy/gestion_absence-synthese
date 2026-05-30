<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Student;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Absence>
 */
class AbsenceFactory extends Factory
{
    public function definition(): array
    {
        $status = $this->faker->randomElement(['absent', 'justified', 'late', 'present']);
        return [
            'student_id' => Student::factory(),
            'date' => $this->faker->dateTimeBetween('-90 days', 'now')->format('Y-m-d'),
            'type' => $this->faker->randomElement(['hours', 'days', 'session']),
            'duration' => $this->faker->randomFloat(2, 0.5, 8),
            'status' => $status,
            'reason' => $this->faker->optional()->sentence(6),
            'session' => $this->faker->randomElement(['S1', 'S2', 'S3', 'S4']),
            'day_number' => $this->faker->numberBetween(1, 5),
            'original_session' => null,
            'created_by' => User::factory(),
        ];
    }
}
