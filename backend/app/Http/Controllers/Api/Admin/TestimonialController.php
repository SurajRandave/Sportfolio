<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Testimonial;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TestimonialController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $testimonials = Testimonial::query()
            ->when($request->has('approved'), fn ($q) => $q->where('is_approved', $request->boolean('approved')))
            ->ordered()
            ->with('project:id,title,slug')
            ->get();

        return response()->json(['data' => $testimonials]);
    }

    public function store(Request $request): JsonResponse
    {
        $testimonial = Testimonial::create($this->validated($request));

        return response()->json(['message' => 'Testimonial created.', 'data' => $testimonial], 201);
    }

    public function update(Request $request, Testimonial $testimonial): JsonResponse
    {
        $testimonial->update($this->validated($request));

        return response()->json(['message' => 'Testimonial updated.', 'data' => $testimonial->fresh()]);
    }

    public function destroy(Testimonial $testimonial): JsonResponse
    {
        $testimonial->delete();

        return response()->json(['message' => 'Testimonial deleted.']);
    }

    /** Approve/unapprove in one click from the moderation list. */
    public function toggleApproval(Testimonial $testimonial): JsonResponse
    {
        $testimonial->update(['is_approved' => ! $testimonial->is_approved]);

        return response()->json([
            'message' => $testimonial->is_approved ? 'Testimonial published.' : 'Testimonial hidden.',
            'data' => $testimonial,
        ]);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validated(Request $request): array
    {
        return $request->validate([
            'client_name' => ['required', 'string', 'max:120'],
            'client_role' => ['nullable', 'string', 'max:120'],
            'company' => ['nullable', 'string', 'max:150'],
            'avatar' => ['nullable', 'string', 'max:190'],
            'message' => ['required', 'string', 'max:2000'],
            'rating' => ['nullable', 'integer', 'min:1', 'max:5'],
            'project_id' => ['nullable', 'exists:projects,id'],
            'is_approved' => ['boolean'],
            'is_featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
