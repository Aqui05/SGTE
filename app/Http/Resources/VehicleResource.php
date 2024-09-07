<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VehicleResource extends JsonResource
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
            'type' => $this->type,
            'brand' => $this->brand,
            'model' => $this->model,
            'license_plate' => $this->license_plate,
            'seats' => $this->seats,
            'model_3d_link' => $this->model_3d_link,
            'available' => $this->available,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}