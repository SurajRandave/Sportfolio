<?php

namespace App\Http\Controllers\Api;

use App\Events\VisitorRecorded;
use App\Http\Controllers\Controller;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class VisitController extends Controller
{
    /**
     * The SPA pings this on each route change so the admin dashboard has a
     * live traffic feed.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'path' => ['nullable', 'string', 'max:190'],
            'referrer' => ['nullable', 'string', 'max:190'],
            'session_id' => ['nullable', 'string', 'max:64'],
        ]);

        $visit = Visit::create([
            'path' => $validated['path'] ?? '/',
            'referrer' => $validated['referrer'] ?? null,
            'session_id' => $validated['session_id'] ?? null,
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device' => Visit::deviceFromUserAgent($request->userAgent()),
        ]);

        VisitorRecorded::dispatch(
            $visit,
            Visit::whereDate('created_at', today())->count(),
            // "Active now" = distinct sessions seen in the last five minutes.
            Visit::where('created_at', '>=', now()->subMinutes(5))
                ->distinct('session_id')
                ->count('session_id'),
        );

        return response()->json(['recorded' => true], 202);
    }
}
