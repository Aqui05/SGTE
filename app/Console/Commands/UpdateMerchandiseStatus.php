<?php

namespace App\Console\Commands;

use App\Models\Expedition;
use App\Models\Merchandise;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Notification;
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
    // public function handle()
    // {
    //     // Update statuses to "en transit"
    //     $merchandisesInProgress = Merchandise::whereHas('expedition', function ($query) {
    //         $query->where('date_expedition', '<=', Carbon::now())
    //               ->where('date_livraison_prevue', '>', Carbon::now());
    //     })->where('status', '!=', 'en transit')->get();

    //     foreach ($merchandisesInProgress as $merchandise) {
    //         $merchandise->status = 'en transit';
    //         $merchandise->save();
    //     }

    //     // Update statuses to "delivré"
    //     $merchandisesFinished = Merchandise::whereHas('expedition', function ($query) {
    //         $query->where('date_livraison_prevue', '<=', Carbon::now());
    //     })->where('status', '!=', 'delivré')->get();

    //     foreach ($merchandisesFinished as $merchandise) {
    //         $merchandise->status = 'delivré';
    //         $merchandise->save();
    //     }

    //     // Notify users about finished expeditions
    //     $userIds = $merchandisesFinished->pluck('user_id');
    //     $users = User::whereIn('id', $userIds)->get();

    //     Notification::send($users, new ExpeditionMerchandiseFinish($expedition, $merchandises));



    //     $this->info('Merchandise statuses updated and notifications sent successfully.');
    // }

    public function handle()
{
    // Update statuses to "en transit"
    $merchandisesInProgress = Merchandise::whereHas('expedition', function ($query) {
        $query->where('date_expedition', '<=', Carbon::now())
            ->where('date_livraison_prevue', '>', Carbon::now());
    })->where('status', '!=', 'en transit')->get();

    foreach ($merchandisesInProgress as $merchandise) {
        $merchandise->status = 'en transit';
        $merchandise->save();
    }

    // Update statuses to "delivré" and prepare notifications
    $merchandisesFinished = Merchandise::whereHas('expedition', function ($query) {
        $query->where('date_livraison_prevue', '<=', Carbon::now());
    })->where('status', '!=', 'delivré')->get();

    $expeditionGroups = $merchandisesFinished->groupBy('expedition_id');

    foreach ($expeditionGroups as $expeditionId => $merchandises) {
        foreach ($merchandises as $merchandise) {
            $merchandise->status = 'delivré';
            $merchandise->save();
        }

        $expedition = Expedition::find($expeditionId);
        $users = User::whereIn('id', $merchandises->pluck('user_id')->unique())->get();

        Notification::send($users, new ExpeditionMerchandiseFinish($expedition, $merchandises));
    }

    $this->info('Merchandise statuses updated and notifications sent successfully.');
}
}
