<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Merchandise;
use App\Models\Expedition;
use App\Models\Reservation;
use App\Models\Vehicle;
use App\Models\Transport;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            VehicleSeeder::class,
            RouteSeeder::class,
            PolylineSeeder::class,
            TransportSeeder::class,
            ReservationSeeder::class,
            MerchandiseSeeder::class,
            ExpeditionSeeder::class,

        ]);
    }
}
/*
*Modifier les mois des enregistrements


UPDATE users
SET created_at = DATE_ADD(created_at, INTERVAL FLOOR(RAND() * 11) MONTH)*/