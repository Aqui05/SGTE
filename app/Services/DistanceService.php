<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

use Illuminate\Support\Facades\Log;

class DistanceService
{
    protected $baseUrl = 'http://router.project-osrm.org/route/v1/driving/';
    protected $lastError = null;

    public function getDistanceBetweenCities($originCity, $destinationCity)
    {
        $this->lastError = null;

        // Obtenir les coordonnées des villes
        $originCoords = $this->getCoordinates($originCity);
        $destCoords = $this->getCoordinates($destinationCity);

        if (!$originCoords) {
            $this->lastError = "Impossible de trouver les coordonnées pour: $originCity";
            Log::error($this->lastError);
            return null;
        }

        if (!$destCoords) {
            $this->lastError = "Impossible de trouver les coordonnées pour: $destinationCity";
            Log::error($this->lastError);
            return null;
        }

        $url = $this->baseUrl . $originCoords['lon'] . ',' . $originCoords['lat'] . ';' .
               $destCoords['lon'] . ',' . $destCoords['lat'];

        try {
            $response = Http::timeout(10)->get($url);

            if (!$response->successful()) {
                $this->lastError = "Erreur OSRM: " . $response->status() . " - " . $response->body();
                Log::error($this->lastError);
                return null;
            }

            $data = $response->json();

            if (!isset($data['routes'][0]['distance'])) {
                $this->lastError = "Aucune route trouvée entre $originCity et $destinationCity";
                Log::error($this->lastError);
                return null;
            }

            // La distance est en mètres, on la convertit en kilomètres
            return round($data['routes'][0]['distance'] / 1000, 2);

        } catch (\Exception $e) {
            $this->lastError = "Exception lors du calcul de la distance: " . $e->getMessage();
            Log::error($this->lastError);
            return null;
        }
    }

    protected function getCoordinates($cityName)
    {
        $url = 'https://nominatim.openstreetmap.org/search';

        try {
            $response = Http::timeout(10)->get($url, [
                'q' => $cityName,
                'format' => 'json',
                'limit' => 1,
            ]);

            if (!$response->successful()) {
                $this->lastError = "Erreur Nominatim: " . $response->status() . " - " . $response->body();
                Log::error($this->lastError);
                return null;
            }

            $data = $response->json();

            if (empty($data)) {
                $this->lastError = "Aucune coordonnée trouvée pour: $cityName";
                Log::error($this->lastError);
                return null;
            }

            if (isset($data[0]['lat']) && isset($data[0]['lon'])) {
                return [
                    'lat' => $data[0]['lat'],
                    'lon' => $data[0]['lon'],
                ];
            }

            $this->lastError = "Format de réponse inattendu pour: $cityName";
            Log::error($this->lastError);
            return null;

        } catch (\Exception $e) {
            $this->lastError = "Exception lors de la recherche de coordonnées: " . $e->getMessage();
            Log::error($this->lastError);
            return null;
        }
    }

    public function getLastError()
    {
        return $this->lastError;
    }
}
