<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Ticket;
use App\Models\Reservation;
use App\Models\Merchandise;
use App\Models\Transport;
use App\Http\Resources\ReservationResource;
use App\Notifications\Notif;
use App\Notifications\ReservationAdd;

class FunctionController extends Controller
{
    public function search(Request $request)
    {
        $query = $request->input('query');

        if (!$query) {
            return response()->json(['error' => 'Query is required'], 400);
        }

        // Recherche dans les utilisateurs
        $users = User::where('name', 'LIKE', "%$query%")
            ->orWhere('email', 'LIKE', "%$query%")
            ->get(['id', 'name', 'email']);

        // Recherche dans les marchandises
        $merchandises = Merchandise::where('name', 'LIKE', "%$query%")
            ->orWhere('description', 'LIKE', "%$query%")
            ->get(['id', 'name', 'description']);

        //Recherche dans les transports
        $transports = Transport::where('departure_location', 'LIKE', "%$query%")
            ->orWhere('numero_transport', 'LIKE', "%$query%")
            ->get(['id', 'departure_location', 'numero_transport']);

        // Combinez les résultats
        $results = [
            'users' => $users,
            'merchandises' => $merchandises,
            'transports' => $transports,
        ];

        return response()->json($results);
    }

    public function sendNotification()
    {
        $user = User::first();
        $reservation = Reservation::first();
        $ticket = Ticket::first();

        if ($user) {
            $user->notify(new ReservationAdd($reservation, $ticket));
        } else {
            echo "User not found";
        }
        dd($user);
        return response()->json(['message' => 'Notification sent successfully']);
    }
}
