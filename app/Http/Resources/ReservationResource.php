<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ReservationResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {

        return [
            'id' => $this->id,
            'transport_id' => $this->transport_id,
            'reservation_datetime'  => $this->reservation_datetime,
            'number_of_seats' => $this->number_of_seats,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'destination_waypoint' => $this->destination_waypoint,
            'additional_info' => $this->additional_info ,
            'departure_waypoint' => $this->departure_waypoint,
            'paid' => $this->paid ,
            'user' => new UserResource($this->whenLoaded('user')),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}