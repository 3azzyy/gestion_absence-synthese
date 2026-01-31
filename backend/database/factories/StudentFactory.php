<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Group;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Student>
 */
class StudentFactory extends Factory
{
    public function definition(): array
    {
        return [
            'cef' => strtoupper($this->faker->bothify('CEF#####')),
            'first_name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'group_id' => Group::factory(),
            'level' => $this->faker->randomElement(['A1', 'A2', 'B1', 'B2']),
            'cin' => strtoupper($this->faker->bothify('CIN#####')),
            'email' => $this->faker->unique()->safeEmail(),
            'hours' => $this->faker->numberBetween(0, 200),
            'tardies' => $this->faker->numberBetween(0, 10),
            'days_absent' => $this->faker->numberBetween(0, 30),
            'justified_absences' => $this->faker->numberBetween(0, 10),
            'observation' => $this->faker->optional()->sentence(),
            'class_group' => $this->faker->bothify('C-##'),
        ];
    }
}
