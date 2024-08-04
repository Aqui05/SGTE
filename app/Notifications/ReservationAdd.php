<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Reservation;
use App\Models\Ticket;

class ReservationAdd extends Notification
{
    use Queueable;

    public $reservation;
    public $ticket;

    /**
     * Create a new notification instance.
     */
    public function __construct(Reservation $reservation, Ticket $ticket)
    {
        $this->reservation = $reservation;
        $this->ticket = $ticket;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array
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
                    ->greeting('Hello ' . $notifiable->name . ',')
                    ->line('Your reservation has been successfully created.')
                    ->line('Reservation Details:')
                    ->line('Reservation ID: ' . $this->reservation->id)
                    ->line('Ticket Number: ' . $this->ticket->ticket_number)
                    ->action('View Ticket', url($this->ticket->ticket_lien))
                    ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            'ticketNumber' => $this->ticket->ticket_number,
            'issuedAt' => $this->ticket->issued_at,
            'ticketLien' => $this->ticket->ticket_lien,
            'reservationId' => $this->reservation->id,
            'transportId' => $this->reservation->transport_id,
            'destinationWaypoint' => $this->reservation->destination_waypoint,
            'departureWaypoint' => $this->reservation->departure_waypoint,
            'reservationDatetime' => $this->reservation->reservation_datetime,
            'additionalInfo' => $this->reservation->additional_info,
        ];
    }
}
