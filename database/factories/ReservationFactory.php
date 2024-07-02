<?php

namespace Database\Factories;

use App\Models\Reservation;
use App\Models\Transport;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReservationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Reservation::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'transport_id' => Transport::factory(),
            'user_id' => User::factory(),
            'reservation_datetime' => $this->faker->dateTimeBetween('now', '+10 month'),
            'number_of_seats' => $this->faker->numberBetween(1, 1000),
            'total_price' => $this->faker->randomFloat(2, 10, 1000),
            'status' => $this->faker->randomElement(['cancelled', 'confirmed', 'delayed', 'used']),
            'destination_waypoint' => $this->faker->city,
            'additional_info' => $this->faker->optional()->sentence,
            'departure_waypoint' => $this->faker->city,
            //'ticket_lien' => $this->faker->optional()->url,
        ];
    }
}
