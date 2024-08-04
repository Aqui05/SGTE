<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Reservation;
use App\Models\Transport;

class CancelTransport extends Notification
{
    use Queueable;

    public $reservation;
    public $transport;

    /**
     * Create a new notification instance.
     */
    public function __construct(Transport $transport, Reservation $reservation)
    {
        $this->reservation = $reservation;
        $this->transport = $transport;
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
                    ->subject('Transport Cancellation Notice')
                    ->line('We regret to inform you that your transport has been canceled.')
                    ->line('Transport Details:')
                    ->line('Transport ID: ' . $this->transport->id)
                    ->line('Reservation ID: ' . $this->reservation->id)
                    ->action('View Details', url('/transports/' . $this->transport->id))
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
            'subject' => 'Annulation du transport',
            'transport_id' => $this->transport->id,
            'reservation_id' => $this->reservation->id,
            'transportId' => $this->transport->numero_transport,
            'reservation_date' => $this->reservation->reservation_datetime,
            'message' => 'Le transport a été annulé.'
        ];
    }
}
