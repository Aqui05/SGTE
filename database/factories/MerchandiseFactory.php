<?php

namespace Database\Factories;

use App\Models\Vehicle;
use Carbon\Month;
use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Expedition;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Expedition>
 */
class MerchandiseFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'expedition_id' => Expedition::factory(),
            'user_id' => User::factory(),
            'name' => $this->faker->name(),
            'description' => $this->faker->text(),
            'quantity' => $this->faker->numberBetween(1,1000),
            'weight' => $this->faker->randomFloat(2, 10, 1000),
            'volume' => $this->faker->randomFloat(2, 10, 1000),
            'numero_suivi' => $this->faker->unique()->bothify('??-####'),
            'depart' => $this->faker->city,
            'destination' => $this->faker->city,
            'status' => $this->faker->randomElement(['confirmé', 'planification', 'en transit', 'delivré', 'annulé']),
        ];
    }
}
