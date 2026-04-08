<?php

namespace App\Http\Controllers\Api\Redaction;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials for Redaction Panel.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        // Authenticate and inject panel claim
        if (! $token = auth('api')->claims(['panel' => 'redaction'])->attempt($credentials)) {
            return response()->json(['error' => 'Identifiants incorrects.'], 401);
        }

        $user = auth('api')->user();

        // Optional: restrict access to journalists only here if an admin tries to log in
        // A super_admin usually has access everywhere, but let's just make sure they aren't plain users
        $allowedRoles = ['super-admin', 'editeur_en_chef', 'journaliste', 'redacteur_web', 'pigiste', 'photographe'];
        if (!in_array($user->role, $allowedRoles)) {
            auth('api')->logout();
            return response()->json(['error' => 'Votre rôle ne vous permet pas d\'accéder à la rédaction.'], 403);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json(auth('api')->user());
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        auth('api')->logout();
        return response()->json(['message' => 'Successfully logged out from redaction panel']);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(auth('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth('api')->factory()->getTTL() * 60,
            'panel' => 'redaction'
        ]);
    }
}
