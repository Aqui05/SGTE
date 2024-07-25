<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

Schedule::command('transport:update-status')->everySecond();

Schedule::command('vehicle:update-availability')->everySecond();

Schedule::command('expedition:update-status')->everySecond();

Schedule::command('merchandise:update-status')->everySecond();

Schedule::command('expedition:update-status')->everySecond();


/* Execute this
php artisan schedule:run
*/
