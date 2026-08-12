<?php

namespace App\Http\Controllers;

use App\Models\Project;
use App\Models\ShortLinkClick;
use App\Models\Visit;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;

class ShortLinkController extends Controller
{
    /**
     * Resolves /p/{code} to a project case study, recording the click on the
     * way through.
     *
     * An unknown or unpublished code quietly lands on the portfolio homepage
     * rather than showing an error - a dead link in someone's CV should still
     * take the reader somewhere useful.
     */
    public function __invoke(Request $request, string $code): RedirectResponse
    {
        $frontend = rtrim(config('app.frontend_url'), '/');

        $project = Project::published()->where('short_code', $code)->first();

        if (! $project) {
            return redirect()->away($frontend, 302);
        }

        ShortLinkClick::create([
            'project_id' => $project->id,
            'referrer' => $request->headers->get('referer'),
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
            'device' => Visit::deviceFromUserAgent($request->userAgent()),
            'created_at' => now(),
        ]);

        return redirect()->away("{$frontend}/projects/{$project->slug}", 302);
    }
}
