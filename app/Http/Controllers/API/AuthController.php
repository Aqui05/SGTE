<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Laravel\Socialite\Facades\Socialite;

class AuthController extends Controller
{

    //Register
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        $accessToken = $user->createToken('authToken')->accessToken;

        return response()->json(['user' => new UserResource($user), 'access_token' => $accessToken]);
    }

    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);

        if (!Auth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = $request->user();
        $accessToken = $user->createToken('authToken')->accessToken;

        return response()->json(['user' => new UserResource($user), 'access_token' => $accessToken, 'message'=>'User log in' ]);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        if ($user) {
            $token = $user->token();
            if ($token) {
                $token->revoke();
                return response()->json(['message' => 'User successfully signed out']);
            }
        }

        return response()->json(['message' => 'User not authenticated'], 401);
    }

    public function user(Request $request)
    {
        return response()->json($request->user());
    }

    public function refresh(Request $request)
    {
        return $request->user()->createToken('authToken')->accessToken;
    }

    public function change_password(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'old_password' => 'required',
            'new_password' => 'required|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['error' => $validator->errors()], 422);
        }

        if (!Hash::check($request->old_password, $request->user()->password)) {
            return response()->json(['error' => 'Old password is incorrect'], 401);
        }

        $request->user()->update([
                'password' => bcrypt($request->new_password),
            ]);
            return response()->json(['message' => 'Password changed successfully']);

    }

    public function users ()
    {
        $users = User::where('role', '!=', 'admin')
                    ->withCount(['merchandises', 'reservations'])
                    ->get();
        return UserResource::collection($users);
    }

    public function recapUsers()
    {
        // Récupérer tous les utilisateurs qui ne sont pas administrateurs, avec le nombre de marchandises et de réservations
        $users = User::where('role', '!=', 'admin')
                    ->withCount(['merchandises', 'reservations'])
                    ->get();


        /*            // Préparer le tableau de récapitulatif
        $recapData = [];

        // Parcourir chaque utilisateur pour formater les données
        foreach ($users as $user) {
            $recapData[] = [
                'user_name' => $user->name,
                'merchandises_count' => $user->merchandises_count,
                'reservations_count' => $user->reservations_count
            ];
        }
        */

        return UserResource::collection($users);
    }

    public function updateUser(Request $request)
    {
        $request->user()->update($request->all());

        return response()->json(['message' => 'Profile updated successfully', 'user' => $request->user()]);
    }




    public function deleteUser(Request $request)
    {
        $request->user()->delete();
        return response()->json(['message' => 'User deleted successfully']);
    }





    public function redirect($provider)
    {
        return Socialite::driver($provider)->redirect();
    }

    /*public function handle($provider)
    {
        $user = Socialite::driver($provider)->user();

        $user = User::firstOrCreate([
            'email' => $user->getEmail()
        ], [
            'name' => $user->name,
            'email' => $user->email,
            'provider_id' => $user->id,
            'password' => Hash::make($user->name . '@' . $user->id),
            'avatar' => $user->getAvatar()
        ]);

        $accessToken = $user->createToken('authToken')->accessToken;

        // Préparer les données à renvoyer
        $responseData = [
            'user' => new UserResource($user),
            'access_token' => $accessToken,
            'authenticated' => true
        ];

        // URL de la page du frontend pour afficher la confirmation de l'authentification
        $confirmationUrl = env('FRONTEND_URL', 'http://localhost:4200') . '/auth/confirmation';

        // Rediriger vers la page de confirmation avec les données encodées en base64
        $encodedData = base64_encode(json_encode($responseData));
        $redirectUrl = $confirmationUrl . '?data=' . $encodedData;

        // Construire la réponse avec un JavaScript pour fermer le popup, actualiser la page et rediriger
        $response = <<<EOT
    <!DOCTYPE html>
    <html>
    <head>
        <title>Authentication Confirmation</title>
    </head>
    <body>
        <script>
            // Fermer le popup
            window.opener.postMessage({ authenticated: true }, window.location.origin);
            window.close();

            // Actualiser la page principale
            window.opener.location.reload();

            // Rediriger vers la page de confirmation
            window.opener.location.href = "$redirectUrl";
        </script>
    </body>
    </html>
    EOT;

        return response($response)->header('Content-Type', 'text/html');
    }*/


    public function handle($provider)
    {
        $user = Socialite::driver($provider)->user();
        $user = User::firstOrCreate([
            'email' => $user->getEmail()
        ], [
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'provider_id' => $user->getId(),
            'password' => Hash::make($user->getName() . '@' . $user->getId()),
            'avatar' => $user->getAvatar()
        ]);

        // Générer le token d'accès
        $accessToken = $user->createToken('authToken')->accessToken;

        // Rediriger vers la page frontend avec les informations de l'utilisateur et le token d'accès
        $redirectUrl = "http://localhost:4200/auth/confirmation?token={$accessToken}&user={$user}";

        return redirect($redirectUrl);
    }


}

