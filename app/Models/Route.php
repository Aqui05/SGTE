<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Route extends Model
{
    use HasFactory;

    protected $fillable = [
        'route_name',
        'start_latitude',
        'start_longitude',
        'end_latitude',
        'end_longitude',
        'distance',
        'duration',
        'navigation_instructions',
        'route_geometry',
        'route_waypoints',
    ];

    public function polylines()
    {
        return $this->hasMany(Polyline::class);
    }

    public function transport()
    {
        return $this->belongsTo(Transport::class);
    }

    // Add other relationships as needed



    /*public function getRouteWaypointsAttribute($value)
    {
        return json_decode($value);
    }

    public function setRouteWaypointsAttribute($value)
    {
        $this->attributes['route_waypoints'] = json_encode($value);
    }*/
}
