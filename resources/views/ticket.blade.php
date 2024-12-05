<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Ticket</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
        }
        .page-wrapper {
            width: 100%;
            padding: 5px;
        }
        .ticket-container {
            width: 100%;
            margin: 0;
            position: relative;
            display: block;
        }
        .column1 {
            width: 45%;
            padding: 10px;
            float: left;
        }
        .column2 {
            width: 45%;
            padding: 10px;
            float: right;
        }
        .ticket-header {
            font-size: 15px;
            font-weight: bold;
            margin-bottom: 15px;
            overflow: hidden;
        }
        .ticket-header img {
            width: 70px;
            margin-right: 10px;
            float: left;
            
        }
        .ticket-header span {
            display: block;
            margin-top: 15px;
        }
        .ticket-info {
            font-size: 10px;
            margin-bottom: 8px;
        }
        .section-title {
            font-size: 12px;
            font-weight: bold;
            margin-top: 10px;
        }
        .footer {
            font-size: 12px;
            color: #777;
            text-align: center;
            width: 100%;
            clear: both;
        }
        .qr-code {
            text-align: center;
            top: 50%
        }
        /* Séparateur compatible avec dompdf */
        .separator {
            position: absolute;
            left: 49%;
            top: 0;
            bottom: 0;
            border-left: 2px dashed #888;
            height: 100%;
        }
    </style>
</head>
<body>
    <div class="page-wrapper">
        <div class="ticket-container">
            <div class="column1">
                <!-- Header Section -->
                <div class="ticket-header">
                    <img src="D:\Développement\code-sgte\SGTE-BACK\resources\views\logiTrack.png" alt="Logo LogiTrack">
                    <span>LogiTrack Transport</span>
                </div>
               
                <!-- Ticket Information -->
                <div class="section-title">Détails de la Réservation</div>
                <br>
                <div class="ticket-info"><strong>Nom & Prénoms:</strong> {{ $user->name }}</div>
                <br>
                <div class="ticket-info"><strong>Numéro de ticket:</strong> {{ $ticketNumber }}</div>
                <br>
                <div class="ticket-info"><strong>Prix:</strong> {{ $reservation->total_price }} F</div>
                <br>
                <div class="ticket-info"><strong>Date de réservation:</strong> {{ $reservation->reservation_datetime }}</div>  
                <br>
            </div>

            <!-- Séparateur -->
            <div class="separator"></div>

            <div class="column2">
                <!-- QR Code Section -->
                <div class="qr-code">
                    <img src="data:image/png;base64,{{ $qrCode }}" alt="QR Code" width="100" height="100">
                    <br>
                    <br>
                    <div class="ticket-info"><strong>Transport N°:</strong> {{ $reservation->transport_id }}</div>
                </div>
            </div>
        </div>
        <!-- Footer 
            <div class="footer">
                Merci d'avoir choisi LogiTrack pour votre transport!
            </div>
        -->
    </div>
</body>
</html>