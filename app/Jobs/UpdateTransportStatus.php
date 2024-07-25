<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Transport;

class UpdateTransportStatus implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $transport;
    protected $newStatus;

    public function __construct(Transport $transport, string $newStatus)
    {
        $this->transport = $transport;
        $this->newStatus = $newStatus;
    }

    public function handle()
    {
        $this->transport->update(['status' => $this->newStatus]);
    }
}
