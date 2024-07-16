<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Reservation;
use App\Models\Transport;
use Carbon\Carbon;

class UpdateReservationStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'reservation:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update reservation statuses based on associated transport times';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Mettre à jour les statuts à "in Progress"
        $reservationsInProgress = Reservation::whereHas('transport', function ($query) {
            $query->where('departure_time', '<=', Carbon::now())
                    ->where('arrival_time', '>', Carbon::now());
        })->where('status', '!=', 'in Progress')->get();

        foreach ($reservationsInProgress as $reservation) {
            $reservation->status = 'in Progress';
            $reservation->save();
        }

        // Mettre à jour les statuts à "finished"
        $reservationsFinished = Reservation::whereHas('transport', function ($query) {
            $query->where('arrival_time', '<=', Carbon::now());
        })->where('status', '!=', 'finished')->get();

        foreach ($reservationsFinished as $reservation) {
            $reservation->status = 'finished';
            $reservation->save();
        }

        $this->info('Reservation statuses updated successfully.');
    }
}
