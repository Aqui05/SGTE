<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    //'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'origin' => [],

    'allowed_origins' => ['*'],

    'allowed_origins_patterns' => [],

    //'allowed_headers' => ['*'],

    //'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

    //'paths' => ['api/*', 'auth/github/callback'],

    //'allowed_origins' => ['http://localhost:4200'],

    'allowed_headers' => ['Content-Type', 'X-Auth-Token', 'Origin', 'Authorization' , 'X-My-Custom-Header', 'X-Another-Custom-Header', 'X-Requested-With'],

    'exposed_headers' => ['X-My-Custom-Header', 'X-Another-Custom-Header'],

    'Access-Control-Allow-Headers' => ['Content-Type', 'X-Requested-With', 'Authorization'],

    //'max_age' => false,**



];
