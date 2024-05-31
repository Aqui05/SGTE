<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateTransportsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transports', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('vehicle_id'); // Clé étrangère pour le véhicule associé
            $table->unsignedBigInteger('route_id')->nullable();
            $table->string('numero_transport')->unique()->nullable(); // Référence unique du transport
            $table->string('type'); // Type de transport (maritime, aérien, terrestre, ferroviaire, en autobus, en métro, taxi, en voiture particulière
            $table->string('departure_location'); // Lieu de départ
            $table->string('destination_location'); // Lieu de destination
            $table->dateTime('departure_time'); // Heure de départ
            $table->dateTime('arrival_time')->nullable(); // Heure d'arrivée
            $table->decimal('price', 10, 2)->nullable(); // Prix du transport
            $table->integer('seats')->nullable();
            $table->string('status')->default('confirmed');
            $table->timestamps();

            // Contrainte de clé étrangère
            $table->foreign('route_id')->references('id')->on('routes')->onDelete('cascade');
            $table->foreign('vehicle_id')->references('id')->on('vehicles')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('transports');
    }
}
