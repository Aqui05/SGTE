<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Expedition;
use App\Models\Merchandise;

class CancelExpedition extends Notification
{
    use Queueable;

    public $merchandise;
    public $expedition;

    /**
     * Create a new notification instance.
     */
    public function __construct(Merchandise $merchandise, Expedition $expedition)
    {
        $this->merchandise = $merchandise;
        $this->expedition = $expedition;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Expedition Cancellation Notice')
                    ->line('We regret to inform you that your expedition has been canceled by the administrator.')
                    ->action('View Details', url('/expeditions/' . $this->expedition->id))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        return [
            'subject' => 'Annulation de l\'expedition',
            'expedition_id' => $this->expedition->id,
            'merchandise_id' => $this->merchandise->id,
            'merchandise_name' => $this->merchandise->name,
            'numberId' => $this->merchandise->numero_suivi,
            'message' => 'L\'expédition a été annulé.'
        ];
    }
}
