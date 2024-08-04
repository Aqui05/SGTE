<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Route>
 */
use App\Models\Route;
class RouteFactory extends Factory
{
    protected $model = Route::class;

    public function definition()
    {
        return [
            'route_name' => $this->faker->word(),
            'start_latitude' => $this->faker->latitude(),
            'start_longitude' => $this->faker->longitude(),
            'end_latitude' => $this->faker->latitude(),
            'end_longitude' => $this->faker->longitude(),
            'distance' => $this->faker->randomFloat(2, 0, 1000),
            'duration' => $this->faker->time(),
            'navigation_instructions' => $this->faker->sentence(),
            'route_geometry' => '{"type": "LineString", "coordinates": [[-122.4194, 37.7749], [-118.2437, 34.0522]]}',
            'route_waypoints' => '{"type": "MultiPoint", "coordinates": [[-122.4194, 37.7749], [-118.2437, 34.0522]]}'
        ];
    }
}
