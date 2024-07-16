<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vehicle extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'type',
        'brand',
        'model',
        'model_3d_link',
        'license_plate',
        'available',
        'seats',

    ];

    /*
    protected $table = 'vehicles';

    protected $casts = [
        'available' => 'boolean',
    ];

    protected $attributes = [
        'available' => true,
    ];

    protected $appends = [
        'available_label',
    ];*/

    /**
     * The attributes that should be hidden for arrays.
     *
     * @var array
     */
    protected $hidden = [
    ];


    public function transports()
    {
        return $this->hasMany(Transport::class);
    }

    public function expeditions()
    {
        return $this->hasMany(Expedition::class);
    }
}
