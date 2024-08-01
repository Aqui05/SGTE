<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class MerchandiseResource extends JsonResource
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
            'expedition_id' => $this->expedition_id,
            'name'  => $this->name,
            'description' => $this->description,
            'quantity' => $this->quantity,
            'category' => $this->category,
            'weight' => $this->weight,
            'volume' => $this->volume ,
            'numero_suivi' => $this->numero_suivi,
            'depart' => $this->depart,
            'destination' => $this->destination,
            'status' => $this->status,
            'paid' => $this->paid ,
            'user' => new UserResource($this->whenLoaded('user')),
        ];
    }
}
