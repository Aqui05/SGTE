<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Transport>
 */
class TransportFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_id' => \App\Models\Vehicle::factory(),
            'numero_transport' => $this->faker->unique()->bothify('??-####'),
            'type' => $this->faker->randomElement(['maritime', 'routier', 'aérien', 'ferroviaire']),
            'departure_location' => $this->faker->city,
            'destination_location' => $this->faker->city,
            'departure_time' => $this->faker->dateTimeBetween('now', '+10 month'),
            'arrival_time' => $this->faker->dateTimeBetween('now', '+10 month'),
            'price' => $this->faker->randomFloat(2, 10, 1000),
            'seats' => $this->faker->numberBetween(1, 1000),
            'status' => $this->faker->randomElement(['in Progress', 'confirmed', 'cancelled', 'finished']),
        ];
    }
}
