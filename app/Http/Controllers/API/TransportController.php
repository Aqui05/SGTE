<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\PolylineResource;
use App\Http\Resources\RouteResource;
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
use App\Events\TransportCreated;
use App\Notifications\CancelTransport;
use App\Notifications\UpdateTransport;

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
        return response()->json(['success' => $transport], 200);
    }


    public function createRoute(Request $request, $id)
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
        $transport = Transport::findOrFail($id);

        if (!$transport) {
            return response()->json(['error' => 'Transport not found'], 404);
        }

        $route = Route::find($transport->route_id);

        if (!$route) {
            return response()->json(['error' => 'Route not found'], 404);
        }

        $polylineData = $request->validate([
            'start_coordinate' => 'required|array',
            'end_coordinate' => 'required|array',
            'distance' => 'nullable|numeric',
        ]);

        // Convertir les coordonnées en format JSON requis
        $startCoordinate = json_encode([
            'type' => 'Point',
            'coordinates' => [
                $polylineData['start_coordinate']['longitude'],
                $polylineData['start_coordinate']['latitude']
            ]
        ]);

        $endCoordinate = json_encode([
            'type' => 'Point',
            'coordinates' => [
                $polylineData['end_coordinate']['longitude'],
                $polylineData['end_coordinate']['latitude']
            ]
        ]);

        // Créer la polyline
        $polyline = Polyline::create([
            'route_id' => $route->id,
            'start_coordinate' => $startCoordinate,
            'end_coordinate' => $endCoordinate,
            'distance' => $polylineData['distance']
        ]);

        // Mettre à jour route_waypoints avec les nouvelles coordonnées
        $polylines = Polyline::where('route_id', $route->id)->get();
        $waypoints = [];

        foreach ($polylines as $polyline) {
            $start = json_decode($polyline->start_coordinate, true)['coordinates'];
            $end = json_decode($polyline->end_coordinate, true)['coordinates'];
            $waypoints[] = $start;
            $waypoints[] = $end;
        }

        $route->update([
            'route_waypoints' => json_encode([
                'type' => 'MultiPoint',
                'coordinates' => $waypoints
            ])
        ]);

        return response()->json($polyline, 201);
    }


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

        $reservations = Reservation::where('transport_id', $transport->id)->get();

        foreach ($reservations as $reservation) {
            $user = $reservation->user; // Récupérer l'utilisateur associé à la réservation
            $user->notify(new UpdateTransport($transport, $reservation));
        }

        return new TransportResource($transport);
    }

    public function destroy($id)
    {
        // Trouver le transport par ID
        $transport = Transport::find($id);

        // Vérifier si le transport existe
        if (!$transport) {
            return response()->json(['message' => 'Transport not found'], 404);
        }

        // Mettre à jour le statut du transport à 'cancelled'
        $transport->update(['status' => 'cancelled']);

        // Récupérer toutes les réservations associées à ce transport
        $reservations = Reservation::where('transport_id', $transport->id)->get();

        // Pour chaque réservation, envoyer une notification à l'utilisateur associé
        foreach ($reservations as $reservation) {
            $user = $reservation->user; // Récupérer l'utilisateur associé à la réservation
            $user->notify(new CancelTransport($transport, $reservation));
        }

        return response()->json(['message' => 'Transport cancelled successfully']);
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
















    public function showRoute(Request $request, $id)
    {
        $transport = Transport::find($id);

        if (!$transport) {
            return response()->json(['error' => 'Transport not found'], 404);
        }

        $route = Route::find($transport->route_id);

        if (!$route) {
            return response()->json(['error' => 'Route not found'], 404);
        }

        return new RouteResource($route);
    }


    public function showPolyline($id)
    {
        $transport = Transport::find($id);

        if (!$transport) {
            return response()->json(['error' => 'Transport not found'], 404);
        }

        $route = Route::find($transport->route_id);

        if (!$route) {
            return response()->json(['error' => 'Route not found'], 404);
        }

        $polylines = Polyline::where('route_id', $route->id)->get();

        return new PolylineResource($polylines);
    }


}
