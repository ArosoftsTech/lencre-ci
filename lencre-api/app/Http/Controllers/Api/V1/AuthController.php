<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        // JWT middleware check
    }

    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login()
    {
        $credentials = request(['email', 'password']);

        if (! $token = auth('api')->claims(['panel' => 'admin'])->attempt($credentials)) {
            \Log::warning('Login attempt failed for Admin panel', ['email' => $credentials['email']]);
            return response()->json(['error' => 'Identifiants incorrects.'], 401);
        }

        $user = auth('api')->user();
        \Log::info('Admin login successful', ['user_id' => $user->id, 'role' => $user->role]);
        $adminRoles = ['admin', 'super-admin', 'super_admin'];
        if (!in_array($user->role, $adminRoles)) {
            auth('api')->logout();
            return response()->json(['error' => 'Accès refusé. Ce portail est réservé aux administrateurs.'], 403);
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

        return response()->json(['message' => 'Successfully logged out']);
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
            'panel' => 'admin'
        ]);
    }
}
