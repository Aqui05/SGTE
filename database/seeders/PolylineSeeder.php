<?php

namespace Database\Seeders;

use App\Models\Polyline;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class PolylineSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Polyline::factory()->count(100)->create();
    }
}
