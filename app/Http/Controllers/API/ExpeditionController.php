<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\ExpeditionResource;
use App\Models\Expedition;

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
            'destination' => 'required',
            'date_expedition' => 'required|date',
            'date_livraison_prevue' => 'required|date',
            'status' => 'en cours de planification',
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

        $validatedData = $request->validate([
            'expedition_number' => 'required|unique:expeditions,expedition_number,' . $id,
            'origin' => 'required',
            'destination' => 'required',
            'date_expedition' => 'required|date',
            'date_livraison_prevue' => 'required|date',
            'status' => 'en cours de planification',
            'vehicle_id' => 'required|exists:vehicles,id',
            'notes' => 'nullable',
        ]);

        $expedition->update($validatedData);

        return new ExpeditionResource($expedition);
    }

    public function destroy($id)
    {
        $expedition = Expedition::findOrFail($id);
        $expedition->update(['status' => 'annulé']);

        return response()->json(['message' => 'Expedition canceled successfully', 204]);
    }

    public function reservationList()
    {
        $expeditions = Expedition::all();
        return ExpeditionResource::collection($expeditions);
    }
}
