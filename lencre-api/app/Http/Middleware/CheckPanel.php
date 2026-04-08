<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckPanel
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $panel): Response
    {
        try {
            $payload = auth('api')->payload();
            
            if ($payload->get('panel') !== $panel) {
                return response()->json(['error' => 'Accès interdit à ce panel. Connectez-vous sur le bon portail.'], 403);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Token invalide ou expiré.'], 401);
        }

        return $next($request);
    }
}
