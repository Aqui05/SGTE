<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TransportResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'vehicle_id' => $this->vehicle_id,
            'route_id' => $this->route_id,
            'numero_transport' => $this->numero_transport,
            'type' => $this->type,
            'departure_location' => $this->departure_location,
            'destination_location' => $this->destination_location,
            'departure_time' => $this->departure_time,
            'arrival_time' => $this->arrival_time,
            'price' => $this->price,
            'seats' => $this->seats,
            'status'=> $this->status,
        ];
    }
}

