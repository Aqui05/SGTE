<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Merchandise;
use Illuminate\Http\Request;
use App\Models\Transport;
use App\Models\User;
use App\Models\Ticket;
use App\Http\Resources\ReservationResource;
use GuzzleHttp\Psr7\Message;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;

use App\Http\Resources\MerchandiseResource;
use App\Models\Expedition;
use App\Notifications\ExpeditionMerchandiseAdd;
use App\Services\DistanceService;

class MerchandiseController extends Controller
{
    protected $distanceService;

    public function __construct(DistanceService $distanceService)
    {
        $this->distanceService = $distanceService;
    }

public function calculateDistance($origin, $destination)
{
    $distance = $this->distanceService->getDistanceBetweenCities($origin, $destination);
    if ($distance === null) {
        $error = $this->distanceService->getLastError();
        return response()->json(['error' => 'Unable to calculate distance', 'details' => $error], 404);
    }
    return response()->json(['distance' => $distance]);
}
    public function index()
    {
        $userId = Auth::id();
        $merchandises = Merchandise::where('user_id', $userId)->get();
        return MerchandiseResource::collection($merchandises);
    }

    public function MerchandisesExpedition($expeditionId)
    {
        $merchandises = Merchandise::where('expedition_id', $expeditionId)
                                    ->with('user')
                                    ->get();
        return MerchandiseResource::collection($merchandises);
    }


    public function store(Request $request)
    {
        $userId = Auth::id();
        // Valider les données du formulaire
        $validatedData = $request->validate([
            'name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'nullable|integer|min:1',
            'weight' => 'nullable|numeric|min:0',
            'volume' => 'nullable|numeric|min:0',
            'category' => 'nullable|string',
            'numero_suivi' => 'nullable|string',
            'depart' => 'required|string',
            'destination' => 'required|string',
        ]);

        // Calculer la distance entre les villes
        $distanceResponse = $this->calculateDistance($validatedData['depart'], $validatedData['destination']);

        // Initialiser la distance avec la valeur par défaut
        $distance = 250;

        if (!is_a($distanceResponse, \Illuminate\Http\JsonResponse::class)) {
            // Si la réponse n'est pas une JsonResponse, on suppose que c'est la distance calculée
            $distance = $distanceResponse;
        } else {
            // Si c'est une JsonResponse, on essaie d'extraire la distance
            $responseData = json_decode($distanceResponse->getContent(), true);
            if (isset($responseData['distance'])) {
                $distance = $responseData['distance'];
            }
            // Si on ne peut pas extraire la distance, on garde la valeur par défaut (250)
        }

        // Calculer le prix d'expédition
        $shippingPrice = $this->calculateShippingPrice(
            $distance,
            $validatedData['quantity'] ?? 1,
            $validatedData['weight'] ?? 0,
            $validatedData['volume'] ?? 0
        );

        $shippingPrice = ceil($shippingPrice);

        // Ajouter user_id, prix total et distance aux données validées
        $validatedData['user_id'] = $userId;
        $validatedData['total_price'] = $shippingPrice;
        //$validatedData['distance'] = $distance;

        // Créer une nouvelle marchandise avec les données validées
        $merchandise = Merchandise::create($validatedData);

        // Retourner la ressource de la marchandise nouvellement créée
        return new MerchandiseResource($merchandise);
    }

    private function calculateShippingPrice($distance, $quantity, $weight, $volume)
    {
        // Prix de base pour la distance
        $basePrice = $distance * 0.1; // Par exemple, 0.1 par km

        // Facteur de quantité
        $quantityFactor = max(1, log($quantity, 2)); // Utilise une échelle logarithmique pour la quantité

        // Facteur de poids
        $weightFactor = $weight * 0.5; // Par exemple, 0.5 par kg

        // Facteur de volume
        $volumeFactor = $volume * 10; // Par exemple, 10 par m³

        // Calcul du prix total
        $totalPrice = ($basePrice + $weightFactor + $volumeFactor) * $quantityFactor;

        // Arrondir à deux décimales
        return round($totalPrice, 2);
    }

    public function makePayment(Request $request, $id)
    {
        $merchandise = Merchandise::findOrFail($id);
        $merchandise->update(['paid' => true]);
        return response()->json(['message' => 'Reservation paid successfully']);
    }


    public function show($id)
    {
        $merchandise = Merchandise::with('user')->find($id);

        // Vérifier si la marchandise existe
        if (!$merchandise) {
            return response()->json(['message' => 'Marchandise non trouvée'], 404);
        }

        // Retourner la marchandise transformée en ressource
        return new MerchandiseResource($merchandise);
    }


    public function update(Request $request, $id)
    {
        $merchandise = Merchandise::findOrFail($id);

        $validatedData = $request->validate([
            'expedition_id' => 'exists:expeditions,id',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'weight' => 'required|numeric|min:0',
            'volume' => 'required|numeric|min:0',
            'numero_suivi' => 'nullable|string',
            'depart' => 'required|string',
            'destination' => 'required|string',
        ]);

        $merchandise->update($validatedData);

        return MerchandiseResource::collection($merchandise);
    }

    public function destroy($id)
    {
        $merchandise = Merchandise::findOrFail($id);
        $merchandise::delete();

        return response()->json(['message' => 'Merchandise destroyed successfully', 204]);
    }

    public function cancel($id)
    {
        $merchandise = Merchandise::findOrFail($id);
        $merchandise->update([
            'status' => 'annulé',
        ]);

        return response()->json(['message' => 'Merchandise canceled successfully', 204]);
    }


    public function merchandiseList()
    {
        $merchandise = Merchandise::all();
        return MerchandiseResource::collection($merchandise);
    }

    public function updateMerchandises(Request $request, $expeditionId)
    {
        // Valider les données de la requête
        $validatedData = $request->validate([
            'merchandiseIds' => 'required|array',
            'merchandiseIds.*' => 'integer|exists:merchandises,id',
        ]);

        // Récupérer les IDs des marchandises à mettre à jour
        $merchandiseIds = $validatedData['merchandiseIds'];

        // Mettre à jour les marchandises avec le nouvel ID d'expédition
        Merchandise::whereIn('id', $merchandiseIds)->update([
            'expedition_id' => $expeditionId,
            'status' => 'planification',
        ]);

        // Récupérer les utilisateurs dont les marchandises sont sélectionnées
        // Assume that you have a relationship defined in the Merchandise model to get the associated users
        $users = User::whereIn('id', Merchandise::whereIn('id', $merchandiseIds)->pluck('user_id'))->get();

        // Préparer les informations pour la notification
        $merchandises = Merchandise::whereIn('id', $merchandiseIds)->get();
        $expedition = Expedition::findOrFail($expeditionId);

        // Envoyer les notifications aux utilisateurs
        Notification::send($users, new ExpeditionMerchandiseAdd($expedition, $merchandises));

        return response()->json(['message' => 'Marchandises mises à jour pour l’expédition avec succès !'], 200);
    }



    // récupérer les marchandises selon le lieu de départ et d'arrivée

    public function merchandiseDeAr(Request $request, $depart, $destination)
    {
        $merchandises = Merchandise::where('destination', $destination)
                                        ->where('depart', $depart)
                                        ->get();
        return MerchandiseResource::collection($merchandises);
    }


    //Marchandises à expédier :: si status == 'confirmé'


    public function MerchandisesShip()
    {
        // si status == 'confirmé'

        $merchandises = Merchandise::where('status', 'confirmé')->get();
        return MerchandiseResource::collection($merchandises);
    }

}
