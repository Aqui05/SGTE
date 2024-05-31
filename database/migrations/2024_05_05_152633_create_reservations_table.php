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
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('transport_id');
            $table->unsignedBigInteger('user_id');
            $table->dateTime('reservation_datetime');
            $table->integer('number_of_seats');
            $table->integer('total_price');
            $table->string('status')->default('confirmed');
            $table->text('destination_waypoint')->nullable();
            $table->text('departure_waypoint')->nullable();
            $table->text('additional_info')->nullable();


            $table->foreign('transport_id')->references('id')->on('transports');
            $table->foreign('user_id')->references('id')->on('users');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};
