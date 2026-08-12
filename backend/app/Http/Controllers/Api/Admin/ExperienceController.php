<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Experience;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Experience::ordered()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $experience = Experience::create($this->validated($request));

        return response()->json(['message' => 'Experience created.', 'data' => $experience], 201);
    }

    public function show(Experience $experience): JsonResponse
    {
        return response()->json(['data' => $experience]);
    }

    public function update(Request $request, Experience $experience): JsonResponse
    {
        $experience->update($this->validated($request));

        return response()->json(['message' => 'Experience updated.', 'data' => $experience->fresh()]);
    }

    public function destroy(Experience $experience): JsonResponse
    {
        $experience->delete();

        return response()->json(['message' => 'Experience deleted.']);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validated(Request $request): array
    {
        return $request->validate([
            'company' => ['required', 'string', 'max:150'],
            'role' => ['required', 'string', 'max:150'],
            'location' => ['nullable', 'string', 'max:150'],
            'employment_type' => ['nullable', 'string', 'max:60'],
            'company_url' => ['nullable', 'url', 'max:190'],
            'start_date' => ['required', 'date'],
            'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            'is_current' => ['boolean'],
            'description' => ['nullable', 'string', 'max:5000'],
            'highlights' => ['nullable', 'array'],
            'highlights.*' => ['string', 'max:500'],
            'tech_stack' => ['nullable', 'array'],
            'tech_stack.*' => ['string', 'max:60'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'is_published' => ['boolean'],
        ]);
    }
}
