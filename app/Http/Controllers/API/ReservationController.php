<?php

namespace App\Http\Controllers\API;

use Illuminate\Database\Eloquent\ModelNotFoundException;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Reservation;
use App\Models\Transport;
use App\Models\User;
use App\Models\Ticket;
use App\Http\Resources\ReservationResource;
use App\Notifications\ReservationAdd;
use GuzzleHttp\Psr7\Message;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

use SimpleSoftwareIO\QrCode\Facades\QrCode;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\File;

use Illuminate\Support\Facades\View;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Notification;


class ReservationController extends Controller
{

    public function store(Request $request, $TransportId)
    {
        $user = Auth::user();
        $userId = $user->id;

        $transport = Transport::findOrFail($TransportId);

        $validator = Validator::make($request->all(), [
            'destination_waypoint' => 'required|string',
            'departure_waypoint' => 'required|string',
            'additional_info' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $reservationData = $validator->validated();
        $reservationData['reservation_datetime'] = now(); // Set reservation datetime to current time

        // Check if there are available seats in the transport
        if ($transport->seats > 0) {
            $reservation = Reservation::create(array_merge($reservationData, [
                'transport_id' => $TransportId,
                'user_id' => $userId,
                'total_price' => $transport->price,
                'paid' => false, // Set initial payment status to false
            ]));

            $transport->decrement('seats'); // Decrement the number of available seats

            return (new ReservationResource($reservation))
                ->response()
                ->setStatusCode(201);
        } else {
            return response()->json(['error' => 'No seats available'], 422);
        }
    }


    public function makePayment(Request $request, $id)
{
    try {
        $user = Auth::user();
        $reservation = Reservation::findOrFail($id);

        // Simuler le processus de paiement
        $paymentSuccessful = true; // À remplacer par la logique de paiement réelle

        Log::info('User attempted to make a payment', ['user_id' => $user->id, 'reservation_id' => $id]);

        if ($paymentSuccessful) {
            $reservation->update(['paid' => true]);

            Log::info('Payment successful, generating ticket');

            // Générer le ticket et récupérer l'objet Ticket
            $ticket = $this->generateTicket($reservation->id);

            if ($ticket) {
                Notification::send($user, new ReservationAdd($reservation, $ticket));

                Log::info('Ticket generated and notification sent', ['ticket_id' => $ticket->id]);

                return response()->json(['message' => 'Reservation paid successfully', 'ticket' => $ticket]);
            } else {
                Log::error('Failed to generate ticket after successful payment');
                throw new \Exception('Failed to generate ticket');
            }
        } else {
            Log::warning('Payment failed for reservation', ['reservation_id' => $id]);
            return response()->json(['error' => 'Payment failed'], 422);
        }
    } catch (\Exception $e) {
        Log::error('Payment error: ' . $e->getMessage());
        return response()->json(['error' => 'An error occurred during payment process', 'details' => $e->getMessage()], 500);
    }
    
}

public function generateTicket($reservationId)
{
    try {
        // Log de début de génération du ticket
        Log::info("Starting ticket generation for reservation ID: {$reservationId}");

        $reservation = Reservation::findOrFail($reservationId);
        $user = $reservation->user; // Assurez-vous que la relation 'user' est définie dans le modèle Reservation
        $transport = $reservation->transport;

        // Log pour vérifier si la réservation est trouvée
        Log::info("Reservation found for ID: {$reservationId}", ['reservation' => $reservation]);

        // Génération du QR code
        $qrCodeContent = "Numéro de ticket: TICKET_{$reservation->id}\nNom & Prénoms : {$user->name}\nPrix: {$reservation->total_price}";
        try {
            $qrCode = base64_encode(QrCode::format('png')->size(100)->generate($qrCodeContent));
            Log::info('QR code generated successfully');
        } catch (\Exception $e) {
            Log::error('Error generating QR code: ' . $e->getMessage());
            throw $e; // Relancer l'exception si la génération échoue
        }

        // Génération d'un numéro de ticket unique
        $ticketNumber = 'TICKET_' . Str::random(10);

        // Log pour vérifier le numéro de ticket
        Log::info("Generated ticket number: {$ticketNumber}");

        // Génération du contenu HTML pour le ticket
        $html = view('ticket', compact('reservation', 'qrCode', 'user', 'transport', 'ticketNumber'))->render();

        // Log pour vérifier le contenu HTML
        Log::info('HTML generated for ticket');

        // Création du PDF à partir du contenu HTML
        try {
            $pdf = PDF::loadHTML($html);
            $pdf->setPaper('A6', 'landscape'); // Format paysage A6
            Log::info('PDF generated successfully');
        } catch (\Exception $e) {
            Log::error('Error generating PDF: ' . $e->getMessage());
            throw $e;
        }

        // Enregistrement du PDF sur le serveur
        $fileName = $ticketNumber . '.pdf';
        $filePath = 'tickets/' . $fileName;
        try {
            Storage::disk('public')->put($filePath, $pdf->output());
            Log::info("PDF saved to: {$filePath}");
        } catch (\Exception $e) {
            Log::error('Error saving PDF file: ' . $e->getMessage());
            throw $e;
        }

        // Sauvegarde des informations du ticket dans la base de données
        $ticket = new Ticket();
        $ticket->reservation_id = $reservationId;
        $ticket->ticket_number = $ticketNumber;
        $ticket->issued_at = now();
        $ticket->ticket_lien = $filePath;
        $ticket->save();

        // Log pour confirmer la création du ticket dans la base de données
        Log::info('Ticket saved to database', ['ticket' => $ticket]);

        return $ticket;
    } catch (\Exception $e) {
        Log::error('Ticket generation error: ' . $e->getMessage());
        return null;
    }
}

    
    /*public function generateTicket($reservationId)
    {
        try {
            $reservation = Reservation::findOrFail($reservationId);
    
            // Récupérer l'utilisateur de la réservation
            $user = $reservation->user;
    
            // Générer le contenu du QR code
            $qrCodeContent = "Reservation ID: {$reservation->id}, User ID: {$reservation->user_id}";
            $qrCode = base64_encode(QrCode::format('png')->size(200)->generate($qrCodeContent));
    
            // Générer un numéro de ticket unique
            $ticketNumber = 'TICKET_' . Str::random(10);
    
            // Générer le contenu HTML du ticket en incluant les variables nécessaires
            $html = view('ticket', compact('reservation', 'qrCode', 'user', 'ticketNumber'))->render();
    
            // Créer le PDF à partir du contenu HTML
            $pdf = PDF::loadHTML($html);
            $pdf->setPaper('A6', 'paysage');
    
            // Enregistrer le PDF sur le serveur
            $fileName = $ticketNumber . '.pdf';
            $filePath = 'tickets/' . $fileName;
    
            Storage::disk('public')->put($filePath, $pdf->output());
    
            // Enregistrer les informations du ticket dans la base de données
            $ticket = new Ticket();
            $ticket->reservation_id = $reservationId;
            $ticket->ticket_number = $ticketNumber;
            $ticket->issued_at = now();
            $ticket->ticket_lien = $filePath;
            $ticket->save();
    
            return $ticket;
        } catch (\Exception $e) {
            Log::error('Ticket generation error: ' . $e->getMessage());
            return null;
        }
    }*/
    
    



    public function update(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        //$userId = auth()->id();
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
                $this->generateTicket($reservation->id);

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

    public function index(Request $request)
    {
        $userId = Auth::id();

        $reservations = Reservation::where('user_id', $userId)->get();
        return ReservationResource::collection($reservations);
    }





    public function reservationList() {
        $reservations = Reservation::all();
        return ReservationResource::collection($reservations);
    }


    public function getTicket($reservationId)
    {
        try {
            $ticket = Ticket::where('reservation_id', $reservationId)->firstOrFail();

            $filePath = Storage::disk('public')->path($ticket->ticket_lien);

            if (!Storage::disk('public')->exists($ticket->ticket_lien)) {
                Log::error("Ticket file not found: {$filePath}");
                return response()->json(['message' => 'Ticket file not found'], 404);
            }

            return response()->file($filePath, [
                'Content-Type' => 'application/pdf',
                'Content-Disposition' => 'inline; filename="' . basename($filePath) . '"'
            ]);
        } catch (ModelNotFoundException $e) {
            Log::error("Ticket not found for reservation ID: {$reservationId}");
            return response()->json(['message' => 'Ticket not found'], 404);
        } catch (\Exception $e) {
            Log::error("Error retrieving ticket: " . $e->getMessage());
            return response()->json(['message' => 'An error occurred while retrieving the ticket'], 500);
        }
    }


    //Les réservations pour un transport


    public function reservationsTransport(Request $request, $transportId)
    {
        // Récupérer les réservations avec les informations de l'utilisateur associé
        $reservations = Reservation::where('transport_id', $transportId)
                                    ->with('user') // Charger les informations de l'utilisateur
                                    ->get();

        return ReservationResource::collection($reservations);
    }




}
