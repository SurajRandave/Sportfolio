<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Skill;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class SkillController extends Controller
{
    public const CATEGORIES = ['frontend', 'backend', 'database', 'cloud', 'tools', 'concepts'];

    public function index(): JsonResponse
    {
        return response()->json(['data' => Skill::ordered()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $skill = Skill::create($this->validated($request));

        return response()->json(['message' => 'Skill created.', 'data' => $skill], 201);
    }

    public function show(Skill $skill): JsonResponse
    {
        return response()->json(['data' => $skill]);
    }

    public function update(Request $request, Skill $skill): JsonResponse
    {
        $skill->update($this->validated($request));

        return response()->json(['message' => 'Skill updated.', 'data' => $skill->fresh()]);
    }

    public function destroy(Skill $skill): JsonResponse
    {
        $skill->delete();

        return response()->json(['message' => 'Skill deleted.']);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validated(Request $request): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'category' => ['required', Rule::in(self::CATEGORIES)],
            'proficiency' => ['nullable', 'integer', 'min:0', 'max:100'],
            'years' => ['nullable', 'numeric', 'min:0', 'max:60'],
            'icon' => ['nullable', 'string', 'max:80'],
            'is_featured' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
