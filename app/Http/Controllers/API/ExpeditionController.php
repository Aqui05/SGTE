<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ExpeditionResource;
use App\Models\Expedition;
use App\Models\Merchandise;
use Illuminate\Support\Facades\Auth;
use App\Notifications\CancelExpedition;
use App\Notifications\UpdateExpedition;

class ExpeditionController extends Controller
{
    public function expeditionList ()
    {
        return ExpeditionResource::collection(Expedition::all());
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'expedition_number' => 'required|unique:expeditions',
            'origin' => 'required',
            'type'  => 'required',
            'destination' => 'required',
            'date_expedition' => 'required|date',
            'date_livraison_prevue' => 'required|date',
            'status' => 'planification',
            'vehicle_id' => 'required|exists:vehicles,id',
            'notes' => 'nullable',
        ]);

        $expedition = Expedition::create($validatedData);

        return new ExpeditionResource($expedition);
    }

    public function index()
    {
        $expeditions = Expedition::all();
        return ExpeditionResource::collection($expeditions);
    }

    public function show($id)
    {
        $expedition = Expedition::findOrFail($id);
        return new ExpeditionResource($expedition);
    }

    public function update(Request $request, $id)
    {
        $expedition = Expedition::findOrFail($id);

        // $validatedData = $request->validate([
        //     'expedition_number' => 'required|unique:expeditions,expedition_number,' . $id,
        //     'origin' => 'required',
        //     'destination' => 'required',
        //     'date_expedition' => 'required|date',
        //     'date_livraison_prevue' => 'required|date',
        //     'status' => 'planification',
        //     'vehicle_id' => 'required|exists:vehicles,id',
        //     'notes' => 'nullable',
        // ]);


        $expedition->update($request->all());

        $merchandises = Merchandise::where('expedition_id', $expedition->id)->get();

        foreach ($merchandises as $merchandise) {
            $user = $merchandise->user;
            $user->notify(new UpdateExpedition($expedition, $merchandise));
        }

        return new ExpeditionResource($expedition);
    }


    public function destroy($id)
    {
        // Trouver le expedition par ID
        $expedition = Expedition::find($id);

        // Vérifier si le expedition existe
        if (!$expedition) {
            return response()->json(['message' => 'expedition not found'], 404);
        }

        // Mettre à jour le statut du transport à 'cancelled'
        $expedition->update(['status' => 'annulé']);

        // Récupérer toutes les réservations associées à ce expedition
        $merchandises = Merchandise::where('expedition_id', $expedition->id)->get();

        // Pour chaque expedition, envoyer une notification à l'utilisateur associé
        foreach ($merchandises as $merchandise) {
            $user = $merchandise->user; // Récupérer l'utilisateur associé à la réservation
            $user->notify(new CancelExpedition($merchandise, $expedition));
        }

        return response()->json(['message' => 'Expedition canceled successfully', 204]);
    }

    public function reservationList()
    {
        $expeditions = Expedition::all();
        return ExpeditionResource::collection($expeditions);
    }




    // récupérer les marchandises selon le lieu de départ et d'arrivée

    public function expeditionDeAr(Request $request, $depart, $destination)
    {
        $expeditions = Expedition::where('destination', $destination)
                                    ->where('origin', $depart)
                                    ->get();
        return ExpeditionResource::collection($expeditions);
    }



    public function UserExpeditions(Request $request)
    {
        $userId = Auth::id();

        // Récupérer les expeditions basés sur les marchandises de l'utilisateur
        $expeditions = Expedition::whereHas('merchandises', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        return new ExpeditionResource($expeditions);
    }
}
