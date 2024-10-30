<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
     public function run(): void
    {
        User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('123456'),
            'remember_token' => Str::random(10),
            'role' => 'admin',
            'phone' => fake()->phoneNumber(),
            'city' => fake()->city(),
            'zip' => fake()->postcode(),
            'country' => fake()->countryCode(),
        ]);


        User::create([
            'name' => 'User',
            'email' => 'user@gmail.com',
            'email_verified_at' => now(),
            'password' => Hash::make('123456'),
            'remember_token' => Str::random(10),
            'role' => 'user',
            'phone' => fake()->phoneNumber(),
            'city' => fake()->city(),
            'zip' => fake()->postcode(),
            'country' => fake()->countryCode(),
        ]);

        User::factory(50)->create();
    }
}
