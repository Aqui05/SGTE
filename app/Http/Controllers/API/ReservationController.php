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

            // Simulate the payment process
            $paymentSuccessful = true; // This should be replaced with actual payment gateway logic

            if ($paymentSuccessful) {
                $reservation->update(['paid' => true]);

                // Generate the ticket and retrieve the Ticket object
                $ticket = $this->generateTicket($reservation->id);

                if ($ticket) {
                    Notification::send($user, new ReservationAdd($reservation, $ticket));
                    return response()->json(['message' => 'Reservation paid successfully', 'ticket' => $ticket]);
                } else {
                    throw new \Exception('Failed to generate ticket');
                }
            } else {
                return response()->json(['error' => 'Payment failed'], 422);
            }
        } catch (\Exception $e) {
            Log::error('Payment error: ' . $e->getMessage());
            return response()->json(['error' => 'An error occurred during payment process'], 500);
        }
    }

    public function generateTicket($reservationId)
    {
        try {
            $reservation = Reservation::findOrFail($reservationId);

            // Generate the QR code with relevant content
            $qrCodeContent = "Reservation ID: {$reservation->id}, User ID: {$reservation->user_id}";
            $qrCode = base64_encode(QrCode::format('png')->size(200)->generate($qrCodeContent));

            // Generate the HTML content for the ticket
            $html = view('ticket', compact('reservation', 'qrCode'))->render();

            // Create the PDF from the HTML content
            $pdf = PDF::loadHTML($html);
            $pdf->setPaper('A4', 'portrait');

            // Generate a unique ticket number
            $ticketNumber = 'TICKET_' . Str::random(10);

            // Save the PDF on the server
            $fileName = $ticketNumber . '.pdf';
            $filePath = 'tickets/' . $fileName;

            Storage::disk('public')->put($filePath, $pdf->output());

            // Save the ticket information in the database
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
