<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Carbon\Month;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expedition>
 */
class ExpeditionFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'vehicle_id' => Vehicle::factory(),
            'expedition_number' => $this->faker->unique()->bothify('??-####'),
            'date_expedition' => $this->faker->DateTimeBetween('now', '+5 months'),
            'date_livraison_prevue' => $this->faker->dateTimeBetween('now','+10 months'),
            'status' => $this->faker->randomElement(['confirmé', 'planification', 'en transit', 'delivré', 'annulé']),
            'destination' => $this->faker->city,
            'notes' => $this->faker->optional()->sentence,
            'origin' => $this->faker->city,
            'type' => $this->faker->randomElement(['maritime', 'routier', 'aérien', 'ferroviaire']),
        ];
    }
}
