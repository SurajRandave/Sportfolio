<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProjectController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json([
            'data' => Project::withCount('shortLinkClicks')->ordered()->get(),
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $project = Project::create($this->validated($request));

        return response()->json(['message' => 'Project created.', 'data' => $project], 201);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json(['data' => $project]);
    }

    public function update(Request $request, Project $project): JsonResponse
    {
        $project->update($this->validated($request, $project));

        return response()->json(['message' => 'Project updated.', 'data' => $project->fresh()]);
    }

    public function destroy(Project $project): JsonResponse
    {
        $project->delete();

        return response()->json(['message' => 'Project deleted.']);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validated(Request $request, ?Project $project = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:190'],
            'slug' => ['nullable', 'string', 'max:190', Rule::unique('projects')->ignore($project)],
            'category' => ['required', Rule::in(['enterprise', 'client', 'freelance', 'personal'])],
            'role' => ['nullable', 'string', 'max:120'],
            'client_name' => ['nullable', 'string', 'max:150'],
            'summary' => ['required', 'string', 'max:1000'],
            'description' => ['nullable', 'string', 'max:10000'],
            'problem' => ['nullable', 'string', 'max:5000'],
            'solution' => ['nullable', 'string', 'max:5000'],
            'outcome' => ['nullable', 'string', 'max:5000'],
            'tech_stack' => ['nullable', 'array'],
            'tech_stack.*' => ['string', 'max:60'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:300'],
            'live_url' => ['nullable', 'url', 'max:190'],
            'repo_url' => ['nullable', 'url', 'max:190'],
            'cover_image' => ['nullable', 'string', 'max:190'],
            'gallery' => ['nullable', 'array'],
            'is_featured' => ['boolean'],
            'is_published' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
            'completed_at' => ['nullable', 'date'],
        ]);
    }
}
