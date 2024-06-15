<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Merchandise;
use Illuminate\Http\Request;
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

use App\Http\Resources\MerchandiseResource;

class MerchandiseController extends Controller
{
    public function index()
    {
        $userId = auth()->id();
        $merchandises = Merchandise::where('user_id', $userId)->get();
        return MerchandiseResource::collection($merchandises);
    }

    public function MerchandiseList($expeditionId)
    {
        $merchandises = Merchandise::where('expedition_id', $expeditionId)->get();
        return MerchandiseResource::collection($merchandises);
    }


    public function store(Request $request)
    {
        $userId = auth()->id();
        $validatedData = $request->validate([
            'expedition_id' => 'exists:expeditions,id',
            'user_id' => $userId,
            'name' => 'string',
            'description' => 'nullable|string',
            'quantity' => 'integer|min:1',
            'weight' => 'numeric|min:0',
            'volume' => 'numeric|min:0',
            'numero_suivi' => 'nullable|string',
            'depart' => 'required|string',
            'destination' => 'required|string',
        ]);

        $merchandise = Merchandise::create($validatedData);

        return new MerchandiseResource($merchandise);
    }

    public function show($id)
    {
        $merchandise = Merchandise::findOrFail($id);
        return new MerchandiseResource($merchandise);
    }

    public function update(Request $request, $id)
    {
        $merchandise = Merchandise::findOrFail($id);

        $validatedData = $request->validate([
            'expedition_id' => 'exists:expeditions,id',
            'name' => 'required|string',
            'description' => 'nullable|string',
            'quantity' => 'required|integer|min:1',
            'weight' => 'required|numeric|min:0',
            'volume' => 'required|numeric|min:0',
            'numero_suivi' => 'nullable|string',
            'depart' => 'required|string',
            'destination' => 'required|string',
        ]);

        $merchandise->update($validatedData);

        return new MerchandiseResource($merchandise);
    }

    public function destroy($id)
    {
        $merchandise = Merchandise::findOrFail($id);
        $merchandise::delete();

        return response()->json(['message' => 'Merchandise canceled successfully', 204]);
    }


}
