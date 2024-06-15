<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Merchandise extends Model
{
    use HasFactory;

    protected $fillable = [
        'expedition_id',
        'user_id',
        'name',
        'description',
        'quantity',
        'weight',
        'volume',
        'numero_suivi',
        'depart',
        'destination',
    ];


    public function expedition()
    {
        return $this->belongsTo(Expedition::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
