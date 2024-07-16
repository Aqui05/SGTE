<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Merchandise;
use Carbon\Carbon;

class UpdateMerchandiseStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'merchandise:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update merchandise statuses based on associated expedition times';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Mettre à jour les statuts à "in Progress"
        $merchandisesInProgress = Merchandise::whereHas('expedition', function ($query) {
            $query->where('date_expedition', '<=', Carbon::now())
                    ->where('date_livraison_prevue', '>', Carbon::now());
        })->where('status', '!=', 'en transit')->get();

        foreach ($merchandisesInProgress as $merchandise) {
            $merchandise->status = 'en transit';
            $merchandise->save();
        }

        // Mettre à jour les statuts à "delivré"
        $merchandisesFinished = Merchandise::whereHas('expedition', function ($query) {
            $query->where('date_livraison_prevue', '<=', Carbon::now());
        })->where('status', '!=', 'delivré')->get();

        foreach ($merchandisesFinished as $merchandise) {
            $merchandise->status = 'delivré';
            $merchandise->save();
        }

        $this->info('Merchandise statuses updated successfully.');
    }
}
