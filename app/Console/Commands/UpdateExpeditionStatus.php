<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Expedition;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class UpdateExpeditionStatus extends Command
{
    protected $signature = 'expedition:update-status';
    protected $description = 'Update expedition status based on start and end dates';

    public function __construct()
    {
        parent::__construct();
    }

    public function handle()
    {
        // Mettre à jour les statuts à "en cours"
        $expeditionsInProgress = Expedition::where('date_expedition', '<=', Carbon::now())
                                            ->where('date_livraison_prevue', '>', Carbon::now())
                                            ->where('status', '!=', 'en transit')
                                            ->get();

        foreach ($expeditionsInProgress as $expedition) {
            $expedition->status = 'en transit';
            $expedition->save();
        }

        // Mettre à jour les statuts à "finished"
        $expeditionsFinished = Expedition::where('date_livraison_prevue', '<=', Carbon::now())
                                        ->where('status', '!=', 'delivré')
                                        ->get();

        foreach ($expeditionsFinished as $expedition) {
            $expedition->status = 'delivré';
            $expedition->save();
        }

        $this->info('Expedition statuses updated successfully.');
    }
}
