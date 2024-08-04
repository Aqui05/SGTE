<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'ticket_number',
        'issued_at',
        'ticket_lien',
    ];

    public function reservation()
    {
        return $this->belongsTo(Reservation::class);
    }
}