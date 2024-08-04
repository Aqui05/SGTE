<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('vehicles', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Type de véhicule (avion, bus, etc.)
            $table->string('brand'); // Marque du véhicule
            $table->string('model'); // Modèle du véhicule
            $table->string('license_plate')->unique(); // Plaque d'immatriculation unique
            $table->integer('seats'); // Nombre de places dans le véhicule
            $table->boolean('available')->default(true); // Disponibilité du véhicule
            $table->string('model_3d_link')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vehicles');
    }
};
