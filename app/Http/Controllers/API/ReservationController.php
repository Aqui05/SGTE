<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
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

class ReservationController extends Controller
{
    public function store(Request $request, $TransportId)
    {
        $user = Auth::user();
        $userId = $user->id;

        $transport = Transport::findOrFail($TransportId);

        $validator = Validator::make($request->all(), [
            'reservation_datetime' => now(),
            'destination_waypoint' => 'required|string',
            'departure_waypoint' => 'required|string',
            'additional_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $reservationData = $validator->validated();

         // Vérifier s'il y a des sièges disponibles dans le transport
        if ($transport->seats > 0) {
            $reservation = Reservation::create(array_merge($reservationData, [
                'transport_id' => $TransportId,
                'user_id' => $userId,
            ]));

            //$transport->decrement('seats');

            $transport->decrement('seats');

            $this->ticket($reservation->id);

            return (new ReservationResource($reservation))
                ->response()
                ->setStatusCode(201);
        } else {
            return response()->json(['error' => 'No seats available'], 422);
        }
    }

    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $userId = auth()->id();
        $departureTime = $reservation->transport->departure_time;

        if ($departureTime > now()->addHours(2)) {
            $validator = Validator::make($request->all(), [
                'reservation_datetime' => 'now',
                'destination_waypoint' => 'required|string',
                'departure_waypoint' => 'required|string',
                'additional_info' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 422);
            }

            $reservationData = $validator->validated();

            // Vérifier s'il y a des sièges disponibles dans le transport
            if ($reservation->transport->seats >= ($reservationData['number_of_seats'] - $reservation->number_of_seats)) {
                $reservation->update($reservationData);
                $reservation->transport->decrement('seats', $reservationData['number_of_seats'] - $reservation->number_of_seats);

                // Supprimer l'ancien ticket
                if ($reservation->ticket) {
                    $ticket = $reservation->ticket;
                    $ticketFilePath = public_path($ticket->ticket_lien);
                    if (File::exists($ticketFilePath)) {
                        File::delete($ticketFilePath);
                    }
                    $ticket->delete();
                }

                // Créer un nouveau ticket
                $this->ticket($reservation->id);

                return (new ReservationResource($reservation))
                    ->response()
                    ->setStatusCode(202);
            } else {
                return response()->json(['error' => 'Not enough seats available'], 422);
            }
        } else {
            return response()->json(['error' => 'Not allowed to change.'], 403);
        }
    }


    public function destroy ($id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => 'canceled']);

        //Supprimer l'ancien ticket
        $ticketId = $reservation->ticket->id;

        $ticket = Ticket::findOrFail($ticketId);
        $ticket->delete();

        return response()->json(['message' => 'Reservation canceled successfully']);
    }

    public function show($id)
    {
        $reservation = Reservation::find($id);
        return new ReservationResource($reservation);
    }

    public function index($userId)
    {
        $reservations = Reservation::where('user_id', $userId)->get();
        return ReservationResource::collection($reservations);
    }


    public function ticket($reservationId)
    {
        $reservation = Reservation::findOrFail($reservationId);

        // Générez le code QR
        $qrCode = QrCode::format('png')->size(200)->generate('Contenu du code QR');

        // Générez le contenu de la vue HTML
        $html = View::make('ticket', compact('reservation', 'qrCode'))->render();

        // Générez le PDF à partir du HTML
        $pdf = PDF::loadHTML($html);

        // Générez un numéro de ticket unique
        $ticketNumber = 'TICKET_' . Str::random(10);

        // Enregistrez le PDF sur le serveur
        $fileName = $ticketNumber . '.pdf';
        $filePath = public_path('tickets/' . $fileName);
        $pdf->save($filePath);

        // Enregistrez les informations du ticket dans la base de données
        $ticket = new Ticket();
        $ticket->reservation_id = $reservationId;
        $ticket->ticket_number = $ticketNumber;
        $ticket->issued_at = now();
        $ticket->ticket_lien = 'tickets/' . $fileName;

        $ticket->save();

        // Retournez le lien vers le fichier PDF
        return response()->json(['ticket_lien' => asset('tickets/' . $fileName)]);
    }


    public function reservationList() {
        $reservations = Reservation::all();
        return ReservationResource::collection($reservations);
    }


}
