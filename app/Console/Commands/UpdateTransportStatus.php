<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Transport;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UpdateTransportStatus extends Command
{
    protected $signature = 'transport:update-status';
    protected $description = 'Update transport status based on start and end dates';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Mettre à jour les statuts à "en cours"
        $transportsInProgress = Transport::where('departure_time', '<=', Carbon::now())
                                            ->where('arrival_time', '>', Carbon::now())
                                            ->where('status', '!=', 'in Progress')
                                            ->get();

        foreach ($transportsInProgress as $transport) {
            $transport->status = 'in Progress';
            $transport->save();
        }

        // Mettre à jour les statuts à "finished"
        $transportsFinished = Transport::where('arrival_time', '<=', Carbon::now())
                                        ->where('status', '!=', 'finished')
                                        ->get();

        foreach ($transportsFinished as $transport) {
            $transport->status = 'finished';
            $transport->save();
        }

        $this->info('Transport statuses updated successfully.');
    }
}
