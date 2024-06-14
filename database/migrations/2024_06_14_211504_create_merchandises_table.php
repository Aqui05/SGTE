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
        Schema::create('merchandises', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('expedition_id')->nullable();
                $table->string('name')->nullable();
                $table->text('description')->nullable();
                $table->integer('quantity');
                $table->decimal('weight', 8, 2);
                $table->decimal('volume', 8, 2)->nullable();
                $table->string('numero_suivi')->nullable()->unique();
                $table->string('depart')->nullable();
                $table->string('destination')->nullable();
                $table->timestamps();

                $table->foreign('expedition_id')->references('id')->on('expeditions');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('merchandises');
    }
};
