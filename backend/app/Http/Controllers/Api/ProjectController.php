<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProjectController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $projects = Project::published()
            ->when($request->filled('category'), fn ($q) => $q->where('category', $request->string('category')))
            ->when($request->boolean('featured'), fn ($q) => $q->featured())
            ->ordered()
            ->get();

        return response()->json(['data' => $projects]);
    }

    public function show(string $slug): JsonResponse
    {
        $project = Project::published()->where('slug', $slug)->firstOrFail();

        // Cheap counter - no model events, no updated_at churn. The in-memory
        // model is bumped too so the response reflects this view, not the last.
        Project::whereKey($project->id)->increment('view_count');
        $project->view_count++;

        return response()->json([
            'data' => $project->load('testimonials'),
        ]);
    }
}
