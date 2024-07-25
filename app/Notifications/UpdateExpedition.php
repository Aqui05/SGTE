<?php

namespace App\Notifications;

use App\Models\Expedition;
use App\Models\Merchandise;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class UpdateExpedition extends Notification
{
    use Queueable;

    protected $expedition;
    protected $merchandise;

    /**
     * Create a new notification instance.
     *
     * @param Expedition $expedition
     * @param Merchandise $merchandise
     */
    public function __construct(Expedition $expedition, Merchandise $merchandise)
    {
        $this->expedition = $expedition;
        $this->merchandise = $merchandise;
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
                    ->subject('Mise à jour de l\'expédition')
                    ->line('Votre expédition a été mise à jour :')
                    ->line('ID de l\'expédition : ' . $this->expedition->id)
                    ->line('Nom de la marchandise : ' . $this->merchandise->name)
                    ->line('Date de mise à jour : ' . now()->toFormattedDateString())
                    ->action('Voir l\'expédition', url('/expeditions/' . $this->expedition->id))
                    ->line('Merci d\'utiliser notre application !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray($notifiable)
    {
        return [
            'expedition_id' => $this->expedition->id,
            'merchandise_id' => $this->merchandise->id,
            'merchandise_name' => $this->merchandise->name,
            'message' => 'Votre expédition a été mise à jour.'
        ];
    }
}
