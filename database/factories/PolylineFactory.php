<?php

namespace Database\Factories;


use App\Models\Polyline;
use App\Models\Route;
use Illuminate\Database\Eloquent\Factories\Factory;

class PolylineFactory extends Factory
{
    protected $model = Polyline::class;

    public function definition()
    {
        return [
            'route_id' => Route::factory(),
            'start_coordinate' => '{"type": "Point", "coordinates": [' . $this->faker->longitude() . ', ' . $this->faker->latitude() . ']}',
            'end_coordinate' => '{"type": "Point", "coordinates": [' . $this->faker->longitude() . ', ' . $this->faker->latitude() . ']}',
            'distance' => $this->faker->randomFloat(2, 0, 1000)
        ];
    }
}
