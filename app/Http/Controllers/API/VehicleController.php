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
            'model_3d' => 'nullable|file|mimes:obj,stl,fbx,glb,gltf|max:10240', // Accepter les types de fichiers 3D courants et une taille maximale de 10 Mo
        ]);

        // Gérer le téléchargement du fichier modèle 3D
        if ($request->hasFile('model_3d')) {
            $file = $request->file('model_3d');
            $filePath = $file->store('models_3d', 'public'); // Stocker le fichier dans le dossier "models_3d" dans le système de fichiers public
            $validatedData['model_3d_link'] = Storage::url($filePath); // Enregistrer le chemin du fichier
        }

        $vehicle = Vehicle::create($validatedData);

        return new VehicleResource($vehicle);
    }


    public function show($id)
    {
        $vehicle = Vehicle::findOrFail($id);
        return new VehicleResource($vehicle);
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

}
