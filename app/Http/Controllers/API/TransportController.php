<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Transport;
use App\Http\Resources\TransportResource;
use App\Models\Polyline;
use App\Models\Route;
use App\Models\Vehicle;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Support\Carbon;
use App\Jobs\UpdateVehicleAvailability;
use App\Models\Reservation;
use Illuminate\Support\Facades\Auth;

class TransportController extends Controller
{

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'numero_transport' => 'string|max:5',
            'type' => 'required|string',
            'departure_location' => 'required|string',
            'destination_location' => 'required|string',
            'departure_time' => 'required|date',
            'arrival_time' => 'nullable|date',
            'seats' => 'integer',
            'vehicle_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $transportData = $validator->validated();
        $transport = Transport::create($transportData);

        $vehicle = Vehicle::findOrFail($transport->vehicle_id);

        $transport->update([
            'seats' => $vehicle->seats,
        ]);

        $vehicle->update([
            'available' => false,
        ]);

        // Mettre à jour la disponibilité du véhicule après l'arrivée
        if ($transport->arrival_time) {
            $arrivalTime = Carbon::parse($transport->arrival_time);

            // Planifier une tâche pour rendre le véhicule disponible après l'arrivée
            $job = (new UpdateVehicleAvailability($vehicle->id))->delay($arrivalTime);
            dispatch($job);
        }

        return response()->json(['success' => $transport], 200);
    }


    /*public function createRoute(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'route_name' => 'string',
            'start_latitude' => 'required',
            'start_longitude' => 'required',
            'end_latitude' => 'required',
            'end_longitude' => 'required',
            'distance' => 'nullable',
            'navigation_instructions' => 'nullable',
            'route_geometry' => 'nullable',
            'route_waypoints' => 'nullable',
        ]);

        $routeData = $validator->validated();

        $route = Route::create($routeData);

        $transport= Transport::findOrFail($id);

        $transport->update([
            'route_id' => $route->id
        ]);

        //$route->transport()->associate($transport);

        return response()->json([$route]);
    }

    public function createPolyline(Request $request, $id)
    {
        $route = Route::findOrFail($id);

        $polylineData = $request->validate([
            'route_id' => '',
            'start_coordinate' => 'required',
            'end_coordinate' => 'required',
            'distance' => 'nullable',
        ]);
        $polylineData['route_id'] = $route->id;

        return Polyline::create($polylineData);
    }*/

    public function index(Request $request)
    {
        $transports = Transport::all();
        return TransportResource::collection($transports);
    }

    public function show($id)
    {
        $transport = Transport::find($id);
        return new TransportResource($transport);
    }

    public function update(Request $request, $id)
    {
        $transport = Transport::find($id);
        $transport->update($request->all());

        return new TransportResource($transport);
    }

    public function destroy($id)
    {
        $transport = Transport::find($id);
        $transport->update(['status' => 'canceled']);

        return response()->json(['message' => 'Transport deleted successfully']);
    }

    public function sortBy($query)
    {
        $transports = Transport::orderBy($query)->get();
        return TransportResource::collection($transports);
    }

    public function search ($info)
    {
        $transports = Transport::where('numero_transport', 'like', '%'. $info. '%');
        return new TransportResource($transports);
    }


    // list des transports effectués par un utilisateur :: on utilisera la table réservation.

    public function UserTransports(Request $request)
    {
        $userId = Auth::id();

        // Récupérer les transports basés sur les réservations de l'utilisateur
        $transports = Transport::whereHas('reservations', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->get();

        return new TransportResource($transports);
    }

}
