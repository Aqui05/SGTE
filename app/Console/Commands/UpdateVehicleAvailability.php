<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Vehicle;
use App\Models\Transport;
use App\Models\Expedition;
use Carbon\Carbon;

class UpdateVehicleAvailability extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'vehicle:update-availability';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update vehicle availability based on current and future transports and expeditions';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Récupérer tous les véhicules
        $vehicles = Vehicle::all();

        foreach ($vehicles as $vehicle) {
            // Vérifier si le véhicule est utilisé dans un transport en cours
            $inTransport = Transport::where('vehicle_id', $vehicle->id)
                ->where('departure_time', '<=', Carbon::now())
                ->where('arrival_time', '>', Carbon::now())
                ->exists();

            // Vérifier si le véhicule est utilisé dans une expédition en cours
            $inExpedition = Expedition::where('vehicle_id', $vehicle->id)
                ->where('date_expedition', '<=', Carbon::now())
                ->where('date_livraison_prevue', '>', Carbon::now())
                ->exists();

            // Vérification des chevauchements futurs pour les transports
            $futureTransportOverlap = Transport::where('vehicle_id', $vehicle->id)
                ->where('departure_time', '>=', Carbon::now())
                ->where(function ($query) {
                    $query->whereBetween('departure_time', [Carbon::now(), Carbon::now()->addMonths(1)])
                        ->orWhereBetween('arrival_time', [Carbon::now(), Carbon::now()->addMonths(1)]);
                })
                ->exists();

            // Vérification des chevauchements futurs pour les expéditions
            $futureExpeditionOverlap = Expedition::where('vehicle_id', $vehicle->id)
                ->where('date_expedition', '>=', Carbon::now())
                ->where(function ($query) {
                    $query->whereBetween('date_expedition', [Carbon::now(), Carbon::now()->addMonths(1)])
                        ->orWhereBetween('date_livraison_prevue', [Carbon::now(), Carbon::now()->addMonths(1)]);
                })
                ->exists();

            // Mettre à jour la disponibilité du véhicule
            if ($inTransport || $inExpedition || $futureTransportOverlap || $futureExpeditionOverlap) {
                $vehicle->available = 0; // Non disponible
            } else {
                $vehicle->available = 1; // Disponible
            }

            $vehicle->save();
        }

        $this->info('Vehicle availability statuses updated successfully.');
    }
}
