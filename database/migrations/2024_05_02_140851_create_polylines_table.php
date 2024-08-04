<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePolylinesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('polylines', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('route_id');
            $table->foreign('route_id')->references('id')->on('routes')->onDelete('cascade');
            $table->text('start_coordinate'); // Coordonnées des waypoints de la polyline (format: GeoJSON)
            $table->text('end_coordinate');
            $table->float('distance')->nullable(); // Distance totale de l'itinéraire en kilomètres
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('polylines');
    }
}

