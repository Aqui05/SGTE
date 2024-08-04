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
        Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('route_name')->nullable();  // Nom de l'itinéraire
            $table->string('start_latitude'); // Latitude du point de départ
            $table->string('start_longitude'); // Longitude du point de départ
            $table->string('end_latitude'); // Latitude du point d'arrivée
            $table->string('end_longitude'); // Longitude du point d'arrivée
            $table->float('distance'); // Distance totale de l'itinéraire en kilomètres
            $table->string('duration')->nullable(); // Durée totale de l'itinéraire (format: HH:MM)
            $table->text('navigation_instructions')->nullable(); // Instructions de navigation
            $table->text('route_geometry')->nullable(); // Géométrie de l'itinéraire (format: GeoJSON)
            $table->text('route_waypoints')->nullable(); // Waypoints de l'itinéraire (format: GeoJSON)

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('routes');
    }
};
