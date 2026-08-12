<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use App\Models\Profile;
use App\Models\Service;
use App\Models\Skill;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;

/**
 * Read-only endpoints for the individual public sections. Most of the SPA
 * reads /api/site instead; these exist for deep links and for anyone
 * consuming the portfolio as an API.
 */
class ContentController extends Controller
{
    public function profile(): JsonResponse
    {
        return response()->json(['data' => Profile::current()]);
    }

    public function experiences(): JsonResponse
    {
        return response()->json(['data' => Experience::published()->ordered()->get()]);
    }

    public function skills(): JsonResponse
    {
        return response()->json(['data' => Skill::ordered()->get()->groupBy('category')]);
    }

    public function services(): JsonResponse
    {
        return response()->json(['data' => Service::active()->ordered()->get()]);
    }

    public function testimonials(): JsonResponse
    {
        return response()->json([
            'data' => Testimonial::approved()->ordered()->with('project:id,title,slug')->get(),
        ]);
    }
}
