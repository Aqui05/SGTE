<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Vehicle>
 */
class VehicleFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        /**
         *         'type',
        'brand',
        'model',
        'model_3d_link',
        'license_plate',
        'available',
        'seats',
         */
        return [

            'type' => $this->faker->randomElement(['maritime', 'routier', 'aérien', 'ferroviaire']),
            'brand' => $this->faker->word(),
            'model' => $this->faker->word(),
            'license_plate' => $this->faker->unique()->bothify('??-####'),
            'available' => $this->faker->boolean(),
            'seats' => $this->faker->numberBetween(1, 1000),
        ];
    }
}
