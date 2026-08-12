<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class MessageController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $messages = ContactMessage::query()
            ->when($request->filled('status'), fn ($q) => $q->where('status', $request->string('status')))
            ->when($request->boolean('starred'), fn ($q) => $q->where('is_starred', true))
            ->when($request->filled('search'), function ($q) use ($request) {
                $term = '%'.$request->string('search').'%';
                $q->where(fn ($sub) => $sub->where('name', 'ilike', $term)
                    ->orWhere('email', 'ilike', $term)
                    ->orWhere('message', 'ilike', $term));
            })
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return response()->json($messages);
    }

    public function show(ContactMessage $message): JsonResponse
    {
        $message->markAsRead();

        return response()->json(['data' => $message]);
    }

    public function update(Request $request, ContactMessage $message): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['nullable', Rule::in(ContactMessage::STATUSES)],
            'is_starred' => ['nullable', 'boolean'],
            'admin_notes' => ['nullable', 'string', 'max:5000'],
        ]);

        if (($validated['status'] ?? null) === 'replied' && ! $message->replied_at) {
            $validated['replied_at'] = now();
        }

        $message->update($validated);

        return response()->json(['message' => 'Message updated.', 'data' => $message->fresh()]);
    }

    public function destroy(ContactMessage $message): JsonResponse
    {
        $message->delete();

        return response()->json(['message' => 'Message deleted.']);
    }
}
