<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class DistanceService
{
    protected $baseUrl = 'http://router.project-osrm.org/route/v1/driving/';

    public function getDistanceBetweenCities($originCity, $destinationCity)
    {
        // Obtenir les coordonnées des villes
        $originCoords = $this->getCoordinates($originCity);
        $destCoords = $this->getCoordinates($destinationCity);

        if (!$originCoords || !$destCoords) {
            return null;
        }

        $url = $this->baseUrl . $originCoords['lon'] . ',' . $originCoords['lat'] . ';' . $destCoords['lon'] . ',' . $destCoords['lat'];

        $response = Http::get($url);

        $data = $response->json();

        if (isset($data['routes'][0]['distance'])) {
            // La distance est en mètres, on la convertit en kilomètres
            return round($data['routes'][0]['distance'] / 1000, 2);
        }

        return null;
    }

    protected function getCoordinates($cityName)
    {
        $url = 'https://nominatim.openstreetmap.org/search';
        $response = Http::get($url, [
            'q' => $cityName,
            'format' => 'json',
            'limit' => 1,
        ]);

        $data = $response->json();

        if (isset($data[0]['lat']) && isset($data[0]['lon'])) {
            return [
                'lat' => $data[0]['lat'],
                'lon' => $data[0]['lon'],
            ];
        }

        return null;
    }
}
