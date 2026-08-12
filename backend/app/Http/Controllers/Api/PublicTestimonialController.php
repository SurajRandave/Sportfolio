<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PublicTestimonialController extends Controller
{
    /**
     * Clients can leave feedback from the site; it stays hidden until it is
     * approved in the admin dashboard.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'client_name' => ['required', 'string', 'max:120'],
            'client_role' => ['nullable', 'string', 'max:120'],
            'company' => ['nullable', 'string', 'max:150'],
            'message' => ['required', 'string', 'min:10', 'max:2000'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'project_id' => ['nullable', 'exists:projects,id'],
        ]);

        Testimonial::create([
            ...$validated,
            'rating' => $validated['rating'] ?? 5,
            'is_approved' => false,
        ]);

        return response()->json([
            'message' => 'Thank you for the feedback. It will appear on the site once I review it.',
        ], 201);
    }
}
