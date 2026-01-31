<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SanctionConfig>
 */
class SanctionConfigFactory extends Factory
{
    public function definition(): array
    {
        return [
            'code' => strtoupper($this->faker->bothify('SANC_##')),
            'label' => $this->faker->sentence(3),
            'threshold' => $this->faker->randomFloat(2, 1, 50),
            'actions' => ['email' => true, 'block' => $this->faker->boolean(20)],
            'is_active' => true,
            'order' => $this->faker->numberBetween(1, 10),
        ];
    }
}
