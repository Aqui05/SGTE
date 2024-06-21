<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Expedition extends Model
{
    use HasFactory;

    protected $fillable = [
        'expedition_number',
        'origin',
        'destination',
        'date_expedition',
        'date_livraison_prevue',
        'status',
        'type',
        'vehicle_id',
        'notes',
    ];


    public function vehicle()
    {
        return $this->belongsTo(Vehicle::class);
    }

    public function merchandises()
    {
        return $this->hasMany(Merchandise::class);
    }
}
