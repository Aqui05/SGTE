<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Expedition;
use App\Models\Merchandise;

class ExpeditionMerchandiseFinish extends Notification
{
    use Queueable;

    protected $expedition;
    protected $merchandises;

    /**
     * Create a new notification instance.
     *
     * @param Expedition $expedition
     * @param Collection $merchandises
     */
    public function __construct(Expedition $expedition, $merchandises)
    {
        $this->expedition = $expedition;
        $this->merchandises = $merchandises;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail','database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @return MailMessage
     */
    public function toMail(object $notifiable): MailMessage
    {
        $merchandiseList = $this->merchandises->map(function ($merchandise) {
            return $merchandise->name; // Assurez-vous que 'name' existe dans le modèle Merchandise
        })->implode(', ');

        return (new MailMessage)
                    ->subject('Expédition Terminée')
                    ->line('L\'expédition suivante est terminée :')
                    ->line('ID de l\'expédition : ' . $this->expedition->id)
                    ->line('Date d\'expédition : ' . $this->expedition->date_expedition->toFormattedDateString())
                    ->line('Marchandises : ' . $merchandiseList)
                    ->action('Voir l\'expédition', url('/expeditions/' . $this->expedition->id))
                    ->line('Merci d\'utiliser notre application !');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'expedition_id' => $this->expedition->id,
            'merchandises' => $this->merchandises->pluck('name'), // Assurez-vous que 'name' existe dans le modèle Merchandise
        ];
    }
}
