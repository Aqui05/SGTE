<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\AuthController;

Route::get('/', function () {
    return view('welcome');
});



Route::get('auth/{provider}', [AuthController::class,'redirect'])->name('google');
Route::get('auth/{provider}/callback', [AuthController::class,'handle']);
