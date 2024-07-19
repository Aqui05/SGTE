<?php

namespace App\Console\Commands;

use App\Models\Expedition;
use App\Models\Merchandise;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;
use App\Notifications\ExpeditionMerchandiseAdd;
use App\Notifications\ExpeditionMerchandiseFinish;
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
        // Mettre à jour les statuts à "en transit"
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

        // Récupérer les utilisateurs concernés
        $users = User::whereIn('id', $merchandisesFinished->pluck('user_id'))->get()->groupBy('id');

        // Envoyer une notification aux utilisateurs concernés
        foreach ($users as $userId => $userMerchandises) {
            $user = User::find($userId);
            $merchandisesForUser = $userMerchandises;
            $expedition = $merchandisesForUser->first()->expedition; // Assurez-vous que chaque marchandise a une expédition

            Notification::send($user, new ExpeditionMerchandiseFinish($expedition, $merchandisesForUser));
        }

        $this->info('Merchandise statuses updated and notifications sent successfully.');
    }
}
