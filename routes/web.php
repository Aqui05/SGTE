<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\FunctionController;
use Laravel\Jetstream\Rules\Role;

Route::get('/', function () {
    return view('welcome');
});



Route::get('auth/{provider}', [AuthController::class,'redirect'])->name('google');
Route::get('auth/{provider}/callback', [AuthController::class,'handle']);


Route::get('/send/notif', [FunctionController::class,'sendNotification']);


Route::get('/notif', [FunctionController::class,'index']);
