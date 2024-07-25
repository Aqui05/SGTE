<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Ticket</title>
</head>
<body>
    <h1>Reservation Ticket</h1>
    <p>Reservation ID: {{ $reservation->id }}</p>
    <p>User ID: {{ $reservation->user_id }}</p>
    <p>Destination: {{ $reservation->destination_waypoint }}</p>
    <p>Departure: {{ $reservation->departure_waypoint }}</p>
    <p>Reservation Datetime: {{ $reservation->reservation_datetime }}</p>
    @if($reservation->additional_info)
        <p>Additional Info: {{ $reservation->additional_info }}</p>
    @endif
    <div>
        <img src="data:image/png;base64,{{ $qrCode }}" alt="QR Code">
    </div>
</body>
</html>
