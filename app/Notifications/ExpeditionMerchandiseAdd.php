<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Expedition;
use App\Models\Merchandise;
use Illuminate\Support\Carbon;

class ExpeditionMerchandiseAdd extends Notification
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
    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        $merchandiseList = $this->merchandises->map(function ($merchandise) {
            return $merchandise->name;
        })->implode(', ');

        $merchandiseNumber = $this->merchandises->map(function ($merchandise) {
            return $merchandise->numero_suivi;
        })->implode(', ');


        return (new MailMessage)
                    ->subject('Nouvelle Expédition Ajoutée')
                    ->line('Une nouvelle expédition a été ajoutée pour les marchandises suivantes :')
                    ->line('ID de l\'expédition : ' . $this->expedition->expedition_number)
                    ->line('Marchandises : ' . $merchandiseList)
                    ->line('Marchandises Number : ' . $merchandiseNumber)
                    ->line('Date d\'expédition : ' . Carbon::parse($this->expedition->date_expedition)->toFormattedDateString())
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
            'subject' => 'Ajout d\'une l\'expédition',
            'expedition_id' => $this->expedition->id,
            'expeditionId' => $this->expedition->expedition_number,
            'merchandises_id' => $this->merchandises->pluck('id')->toArray(),
            'merchandisesNumber' => $this->merchandises->pluck('numero_suivi')->toArray(),
            'message' => 'Une nouvelle expédition a été ajoutée pour vos marchandises.'
        ];
    }
}
