<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    // ✅ Fetch all services with category data
    public function index()
    {
        $services = Service::with('category:id,name')
            ->orderBy('name')
            ->get();

        return response()->json([
            'success' => true,
            'services' => $services
        ]);
    }

    // ✅ Add a new service
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service added successfully',
            'service' => $service
        ]);
    }
}
