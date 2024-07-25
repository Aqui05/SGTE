<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class IsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param \Illuminate\Http\Request $request
     * @param \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response) $next
     * @return \Illuminate\Http\Response
     */
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            if (Auth::user()->isAdmin()) {
                return $next($request);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Vous n\'êtes pas un administrateur.',
                ], 403);
            }
        } else {
            return response()->json([
                'status' => 'error',
                'message' => 'Vous devez d\'abord vous connecter',
            ], 401);
        }
    }
}
