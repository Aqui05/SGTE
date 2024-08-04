<?php

namespace App\Http\Controllers\API;

use App\Models\Vehicle;
use App\Http\Resources\VehicleResource;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class VehicleController extends Controller
{
    public function index()
    {
        $vehicles = Vehicle::all();
        return VehicleResource::collection($vehicles);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'type' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'model' => 'required|string|max:255',
            'license_plate' => 'required|string|unique:vehicles,license_plate|max:255',
            'seats' => 'required|integer',
            'model_3d_link' => 'nullable|file|max:10240|mimes:jpg,jpeg,png,gif', // Accepter les types de fichiers courants et une taille maximale de 10 Mo
        ]);

        if ($request->hasFile('model_3d_link')) {
            $file = $request->file('model_3d_link');
            $filePath = $file->store('models_3d', 'public'); // Stocker le fichier dans le dossier "models_3d" dans le système de fichiers public
            $validatedData['model_3d_link'] = Storage::url($filePath); // Enregistrer le chemin du fichier
        }

        $vehicle = Vehicle::create($validatedData);

        return new VehicleResource($vehicle);
    }

    // public function show($id)
    // {
    //     $vehicle = Vehicle::findOrFail($id);
    //     return new VehicleResource($vehicle);
    // }

    public function show($id) {
        $vehicle = Vehicle::findorFail($id);
        if ($vehicle) {
            $vehicle->model_3d_link = url('storage/' . $vehicle->model_3d_link);
            return new VehicleResource($vehicle);
        }
        return response()->json(['error' => 'Vehicle not found'], 404);
    }


    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'type' => 'required',
            'brand' => 'required',
            'model' => 'required',
            'year' => 'required|integer',
            'license_plate' => 'required|unique:vehicles,license_plate,'.$id,
            'seats' => 'required|integer',
            'model_3d_link' => 'nullable|url',
        ]);

        $vehicle = Vehicle::findOrFail($id);
        $vehicle->update($validatedData);

        return new VehicleResource($vehicle);
    }

    public function destroy($id)
    {
        $vehicle = Vehicle::findOrFail($id);
        $vehicle->delete();

        return response()->json(['message' => 'Vehicle deleted successfully']);
    }

    public function sortBy($info)
    {
        if($info == 'type') {
            $vehicles = Vehicle::orderBy('type')->get();
        } else if ($info == 'license_plate') {
            $vehicles = Vehicle::orderBy('license_plate')->get();
        }
        return new VehicleResource($vehicles);
    }
    public function search($info, $value)
    {
        if ($info == 'type') {
            $vehicles = Vehicle::where('type', 'LIKE', '%' . $value . '%')->get();
        } elseif ($info == 'license_plate') {
            $vehicles = Vehicle::where('license_plate', 'LIKE', '%' . $value . '%')->get();
        } else {
            return response()->json(['error' => 'Invalid search type'], 400);
        }

        return VehicleResource::collection($vehicles);
    }


//Historique de l'utilisation d'un vehicle dans des expéditions et des transpots

public function history($id)
{
    try {
        // Fetch expeditions associated with the vehicle
        $expeditions = Expedition::where('vehicle_id', $id)
            ->with(['origin', 'destination'])
            ->get();

        // Fetch transports associated with the vehicle
        $transports = Transport::where('vehicle_id', $id)
            ->with(['departureLocation', 'arrivalLocation'])
            ->get();

        // Combine and format the results
        $history = [
            'expeditions' => $expeditions,
            'transports' => $transports,
        ];

        // Optionally, you could merge these and sort by date or another criteria
        // $history = $expeditions->merge($transports)->sortBy('date');

        return response()->json([
            'success' => true,
            'data' => $history,
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Erreur lors de la récupération de l\'historique du véhicule',
            'error' => $e->getMessage(),
        ], 500);
    }
}


}
