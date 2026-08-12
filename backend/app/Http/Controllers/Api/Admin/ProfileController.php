<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function show(): JsonResponse
    {
        return response()->json(['data' => Profile::current()]);
    }

    public function update(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'full_name' => ['required', 'string', 'max:120'],
            'headline' => ['required', 'string', 'max:190'],
            'tagline' => ['nullable', 'string', 'max:190'],
            'summary' => ['required', 'string', 'max:5000'],
            'location' => ['nullable', 'string', 'max:120'],
            'email' => ['required', 'email', 'max:190'],
            'phone' => ['nullable', 'string', 'max:30'],
            'linkedin_url' => ['nullable', 'url', 'max:190'],
            'github_url' => ['nullable', 'url', 'max:190'],
            'years_experience' => ['nullable', 'integer', 'min:0', 'max:60'],
            'is_available_for_freelance' => ['boolean'],
            'availability_note' => ['nullable', 'string', 'max:190'],
            'meta_title' => ['nullable', 'string', 'max:190'],
            'meta_description' => ['nullable', 'string', 'max:300'],
        ]);

        $profile = Profile::current() ?? new Profile;
        $profile->fill($validated)->save();

        return response()->json([
            'message' => 'Profile updated.',
            'data' => $profile->fresh(),
        ]);
    }

    /**
     * Avatar and resume PDF uploads land on the public disk so the SPA can
     * link straight to them.
     */
    public function uploadAsset(Request $request): JsonResponse
    {
        $request->validate([
            'type' => ['required', 'in:avatar,resume'],
            'file' => ['required', 'file', 'max:8192', 'mimes:jpg,jpeg,png,webp,pdf'],
        ]);

        $profile = Profile::current() ?? new Profile;
        $column = $request->input('type') === 'avatar' ? 'avatar_path' : 'resume_path';

        if ($profile->{$column}) {
            Storage::disk('public')->delete($profile->{$column});
        }

        $profile->{$column} = $request->file('file')->store($request->input('type').'s', 'public');
        $profile->save();

        return response()->json([
            'message' => ucfirst($request->input('type')).' uploaded.',
            'data' => $profile->fresh(),
        ]);
    }
}
