<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Polyline extends Model
{
    use HasFactory;


    protected $fillable = [
        'route_id',
        'start_coordinate',
        'end_coordinate',
        'distance',
    ];

    public function route()
    {
        return $this->belongsTo(Route::class);
    }

    /*public function getCoordinatesAttribute($value)
    {
        return json_decode($value);
    }

    public function setCoordinatesAttribute($value)
    {
        $this->attributes['coordinates'] = json_encode($value);
    }

    public function getRouteGeometryAttribute($value)
    {
        return json_decode($value);
    }

    public function setRouteGeometryAttribute($value)
    {
        $this->attributes['route_geometry'] = json_encode($value);
    }*/

    /*
        *{"coordinates": [
            { "lat": 40.7128, "lng": -74.0060 }, // Point depart
            { "lat": 41.8781, "lng": -87.6298 }, // Point arrive
        *]}
    */
}
