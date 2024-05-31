<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'transport_id',
        'user_id',
        'reservation_datetime',
        'number_of_seats',
        'total_price',
        'status',
        'destination_waypoint',
        'additional_info',
        'departure_waypoint',
        'ticket_lien'

    ];

    public function transport()
    {
        return $this->belongsTo(Transport::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function ticket()
    {
        return $this->hasOne(Ticket::class);
    }
}
