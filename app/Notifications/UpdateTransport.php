<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Reservation;
use App\Models\Transport;

class UpdateTransport extends Notification
{
    use Queueable;

    public $transport;
    public $reservation;

    /**
     * Create a new notification instance.
     */
    public function __construct(Transport $transport, Reservation $reservation)
    {
        $this->transport = $transport;
        $this->reservation = $reservation;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Mise à jour du transport')
                    ->line('Votre transport a été mise à jour :')
                    ->line('Date de mise à jour : ' . now()->toFormattedDateString())
                    ->action('Voir les détails du transort', url('/transports/' . $this->transport->id))
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
            'subject' => 'Mise à jour du transport',
            'transport_id' => $this->transport->id,
            'reservation_id' => $this->reservation->id,
            'message' => 'Votre transport a été mise à jour.'
        ];
    }
}
