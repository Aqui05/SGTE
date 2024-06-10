<?php

namespace App\Jobs;

use App\Models\Vehicle;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class UpdateVehicleAvailability implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $vehicleId;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    public function __construct($vehicleId)
    {
        $this->vehicleId = $vehicleId;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $vehicle = Vehicle::findOrFail($this->vehicleId);
        $vehicle->update([
            'available' => true,
        ]);
    }
}
