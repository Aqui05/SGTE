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
        Schema::create('expeditions', function (Blueprint $table) {
            $table->id();
            $table->string('expedition_number')->unique();
            $table->string('origin');
            $table->string('destination');
            $table->dateTime('date_expedition')->nullable();
            $table->dateTime('date_livraison_prevue')->nullable();
            $table->enum('status', ['confirmé', 'retardé', 'en cours', 'delivré', 'annulé']);
            $table->unsignedBigInteger('vehicle_id')->constrained();
            $table->unsignedBigInteger('user_id');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users');
            $table->foreign('vehicle_id')->references('id')->on('vehicles');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('expeditions');
    }
};
