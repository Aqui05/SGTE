<?php

namespace App\Listeners;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Events\TransportCreated;
use Carbon\Carbon;
use App\Jobs\UpdateTransportStatus;
class ScheduleTransportStatusUpdate implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(TransportCreated $event)
    {
        $transport = $event->transport;
        $now = Carbon::now();
        $departureTime = Carbon::parse($transport->departure_time);
        $arrivalTime = Carbon::parse($transport->arrival_time);

        if ($departureTime > $now) {
            UpdateTransportStatus::dispatch($transport, 'in Progress')
                ->delay($departureTime);
        } else {
            $transport->update(['status' => 'in Progress']);
        }

        if ($arrivalTime > $now) {
            UpdateTransportStatus::dispatch($transport, 'finished')
                ->delay($arrivalTime);
        } else {
            $transport->update(['status' => 'finished']);
        }
    }
}
