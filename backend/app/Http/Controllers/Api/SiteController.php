<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Project;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

class SiteController extends Controller
{
    /**
     * Everything the public site needs for first paint, in one round trip.
     * The SPA hydrates from this and only hits the per-resource endpoints for
     * detail pages.
     */
    public function __invoke(): JsonResponse
    {
        $skills = Skill::ordered()->get();

        return response()->json([
            'profile' => Profile::current(),
            'experiences' => Experience::published()->ordered()->get(),
            'projects' => Project::published()->ordered()->get(),
            'skills' => $skills->groupBy('category'),
            'services' => Service::active()->ordered()->get(),
            'testimonials' => Testimonial::approved()->ordered()->with('project:id,title,slug')->get(),
            'stats' => [
                'projects' => Project::published()->count(),
                'years_experience' => Profile::current()?->years_experience ?? 0,
                'technologies' => $skills->count(),
            ],
        ]);
    }
}
