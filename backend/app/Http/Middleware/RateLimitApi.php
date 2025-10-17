<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitApi
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $key = 'api'): Response
    {
        $key = $this->resolveRequestSignature($request);
        
        $maxAttempts = match($key) {
            'login' => 5,
            'register' => 3,
            'password' => 3,
            default => 60
        };
        
        $decayMinutes = match($key) {
            'login' => 1,
            'register' => 5,
            'password' => 15,
            default => 1
        };

        if (RateLimiter::tooManyAttempts($key, $maxAttempts)) {
            return response()->json([
                'message' => 'Demasiadas solicitudes. Por favor intente nuevamente más tarde.',
                'retry_after' => RateLimiter::availableIn($key)
            ], 429);
        }

        RateLimiter::hit($key, $decayMinutes * 60);

        $response = $next($request);

        return $this->addHeaders($response, $maxAttempts, RateLimiter::retriesLeft($key, $maxAttempts));
    }

    /**
     * Resolve request signature.
     */
    protected function resolveRequestSignature(Request $request): string
    {
        if ($request->route()->named('login')) {
            return 'login|' . $request->ip();
        }
        
        if ($request->route()->named('register')) {
            return 'register|' . $request->ip();
        }
        
        if ($request->route()->named('password.*')) {
            return 'password|' . $request->ip();
        }

        return 'api|' . ($request->user()?->id ?: $request->ip());
    }

    /**
     * Add rate limit headers to response.
     */
    protected function addHeaders(Response $response, int $maxAttempts, int $remainingAttempts): Response
    {
        $response->headers->add([
            'X-RateLimit-Limit' => $maxAttempts,
            'X-RateLimit-Remaining' => $remainingAttempts,
        ]);

        return $response;
    }
}