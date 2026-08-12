<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(['data' => Service::ordered()->get()]);
    }

    public function store(Request $request): JsonResponse
    {
        $service = Service::create($this->validated($request));

        return response()->json(['message' => 'Service created.', 'data' => $service], 201);
    }

    public function show(Service $service): JsonResponse
    {
        return response()->json(['data' => $service]);
    }

    public function update(Request $request, Service $service): JsonResponse
    {
        $service->update($this->validated($request, $service));

        return response()->json(['message' => 'Service updated.', 'data' => $service->fresh()]);
    }

    public function destroy(Service $service): JsonResponse
    {
        $service->delete();

        return response()->json(['message' => 'Service deleted.']);
    }

    /**
     * @return array<string, mixed>
     */
    protected function validated(Request $request, ?Service $service = null): array
    {
        return $request->validate([
            'title' => ['required', 'string', 'max:150'],
            'slug' => ['nullable', 'string', 'max:150', Rule::unique('services')->ignore($service)],
            'description' => ['required', 'string', 'max:2000'],
            'icon' => ['nullable', 'string', 'max:80'],
            'features' => ['nullable', 'array'],
            'features.*' => ['string', 'max:200'],
            'starting_price' => ['nullable', 'numeric', 'min:0'],
            'currency' => ['nullable', 'string', 'size:3'],
            'price_unit' => ['nullable', 'string', 'max:30'],
            'delivery_days' => ['nullable', 'integer', 'min:1', 'max:365'],
            'is_active' => ['boolean'],
            'sort_order' => ['nullable', 'integer', 'min:0'],
        ]);
    }
}
