<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\VehicleController;
use App\Http\Controllers\API\TransportController;
use App\Http\Controllers\API\ReservationController;
use App\Http\Controllers\API\ExpeditionController;
use App\Http\Controllers\API\MerchandiseController;
use App\Http\Controllers\API\FunctionController;
use App\Models\Expedition;

Route::post('/login',[AuthController::class,'login'])->name('login');
Route::post('/register',[AuthController::class,'register'])->name('register');
Route::middleware('auth:api')->get('user-details',[AuthController::class,'user'])->name('user-details');
Route::middleware('auth:api')->post('logout', [AuthController::class, 'logout']);
Route::middleware('auth:api')->post('update/user', [AuthController::class, 'updateUser']);

Route::get('auth/{provider}', [AuthController::class,'redirect'])->middleware('web');
Route::get('auth/{provider}/callback', [AuthController::class,'handle']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');

Route::group(['middleware' => ['auth:api']], function () {

    Route::get('/transport/{id}',[TransportController::class,'show']);
    Route::get('/transport/sortBy/{query}',[TransportController::class,'sortBy']);
    Route::get('/transport/search/{info}',[TransportController::class,'search']);
    Route::get('/transports',[TransportController::class,'index']);


    Route::get('/vehicle/{id}',[VehicleController::class,'show']);
    Route::get('/vehicle/sortBy/{info}',[VehicleController::class,'sortBy']);
    Route::get('/vehicle/search/{info}/{value}',[VehicleController::class,'search']);

    Route::post('/reservation/{TransportId}',[ReservationController::class,'store']);
    Route::get('/reservations',[ReservationController::class,'index']);
    Route::get('/reservation/{id}',[ReservationController::class,'show']);
    Route::put('/reservation/{id}',[ReservationController::class,'update']);
    Route::put('/reservation/{id}',[ReservationController::class,'destroy']);



    Route::get('/reservations/user/{id}',[ReservationController::class,'userReservations']);
    Route::get('/reservations/transport/{id}',[ReservationController::class,'transportReservations']);
    Route::get('/reservations/vehicle/{id}',[ReservationController::class,'vehicleReservations']);



    Route::get('/expedition/{id}',[ExpeditionController::class,'show']);



    Route::post('/merchandise',[MerchandiseController::class,'store']);
    Route::get('/merchandises',[MerchandiseController::class,'index']);
    Route::get('/merchandise/{id}',[MerchandiseController::class,'show']);
    Route::put('/merchandise/{id}',[MerchandiseController::class,'update']);
    Route::delete('/merchandise/{id}',[MerchandiseController::class,'destroy']);




    Route::get('/transports/user/list',[TransportController::class,'UserTransports']);

    Route::get('expeditions/user/list',[ExpeditionController::class,'UserExpeditions']);

    //Pour les fonctions subsidiaires.

    Route::get('/search', [FunctionController::class, 'search']);
});

Route::group(['middleware' => ['auth:api', 'is_admin']], function () {

    Route::post('/expedition',[ExpeditionController::class,'store']);
    Route::get('/expeditions',[ExpeditionController::class,'index']);
    Route::put('/expedition/{id}',[ExpeditionController::class,'update']);
    Route::put('/expedition/{id}',[ExpeditionController::class,'destroy']);

    Route::get('/vehicles', [VehicleController::class, 'index']);
    Route::post('/vehicle',[VehicleController::class,'store']);
    Route::get('/vehicle/{id}',[VehicleController::class,'show']);
    Route::put('/vehicle/{id}',[VehicleController::class,'update']);
    Route::delete('/vehicle/{id}',[VehicleController::class,'destroy']);

    Route::post('/transport',[TransportController::class,'store']);

    Route::post('/transport/{id}/route',[TransportController::class,'createRoute']);
    Route::post('/route/{id}/polyline',[TransportController::class,'createPolyline']);

    Route::put('/transport/{id}',[TransportController::class,'update']);
    Route::put('/transport/{id}',[TransportController::class,'destroy']);

    Route::get('users',[AuthController::class,'users'])->name('usersList');


    Route::get('/reservations/list',[ReservationController::class,'reservationList']);

    Route::get('/merchandises/list',[MerchandiseController::class,'merchandiseList']);

    Route::get('/expeditions/list',[ExpeditionController::class,'expeditionList']);

    Route::get('/expeditions/merchandises/{expeditionId}',[MerchandiseController::class,'MerchandisesExpedition']);

    Route::get('/get/merchandises/{depart}/{destination}',[MerchandiseController::class,'merchandiseDeAr']);

    Route::get('/get/expeditions/{depart}/{destination}',[ExpeditionController::class,'expeditionDeAr']);

    Route::put('/expeditions/{expeditionId}/merchandises',[MerchandiseController::class,'updateMerchandises']);

});
