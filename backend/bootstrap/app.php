<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    // Channel authorisation lives under /api so the React SPA can authorise
    // private channels with its Sanctum bearer token instead of a session cookie.
    ->withBroadcasting(
        __DIR__.'/../routes/channels.php',
        ['prefix' => 'api', 'middleware' => ['api', 'auth:sanctum']],
    )
    ->withMiddleware(function (Middleware $middleware): void {
        // There is no `login` route in this API-only app. Returning null here
        // stops the auth middleware trying to redirect guests to one, so an
        // unauthenticated request raises a plain 401 instead of a 500.
        $middleware->redirectGuestsTo(fn () => null);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        // This app has no `login` route, so the default "redirect guests to
        // login" behaviour turns an unauthenticated API call into a 500.
        // Force every /api/* failure to render as JSON - an API client that
        // omits an Accept header still gets a proper 401 instead of HTML.
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );
    })->create();
