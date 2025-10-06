<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medicine;
use App\Models\Service;
use App\Models\Item; // ✅ import Item model
use Carbon\Carbon;

class MedicineController extends Controller
{
    // Fetch medicines, services, items along with the session user
    public function index(Request $request)
    {
        $user = $request->user(); // Get authenticated user

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthenticated'
            ], 401);
        }

        $role = strtolower($user->position ?? 'guest');

        // Medicines
        $medicines = Medicine::orderBy('name')->get();

        // Services
        $services = Service::with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(function ($service) {
                return [
                    'id' => $service->id,
                    'name' => $service->name,
                    'description' => $service->description,
                    'price' => $service->price,
                    'category' => $service->category ? $service->category->name : 'Uncategorized',
                    'created_at' => $service->created_at,
                ];
            });

        // ✅ Items
        $items = Item::with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->id,
                    'name' => $item->name,
                    'description' => $item->description,
                    'price' => $item->price,
                    'stock' => $item->stock_quantity, // use stock_quantity
                    'category' => $item->category ? $item->category->name : 'Uncategorized',
                ];
            });

        return response()->json([
            'success' => true,
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email
            ],
            'role' => $role,
            'medicines' => $medicines,
            'services' => $services,
            'items' => $items, // ✅ included items
        ]);
    }

    // Store medicine
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'stock' => 'required|integer|min:0',
            'expiry' => 'required|date',
        ]);

        $medicine = Medicine::create($validated);

        return response()->json([
            'success' => true,
            'medicine' => $medicine
        ]);
    }

    // Store item
    public function storeItem(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $item = Item::create($validated);

        return response()->json([
            'success' => true,
            'item' => $item
        ]);
    }

    // Dispense medicine
    public function dispense(Request $request)
    {
        $validated = $request->validate([
            'patient' => 'required|string|max:255',
            'medicine' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
        ]);

        $medicine = Medicine::where('name', $validated['medicine'])->first();

        if (!$medicine) {
            return response()->json(['success' => false, 'message' => 'Medicine not found'], 404);
        }

        if ($medicine->stock < $validated['quantity']) {
            return response()->json(['success' => false, 'message' => 'Not enough stock'], 400);
        }

        $medicine->stock -= $validated['quantity'];
        $medicine->save();

        return response()->json([
            'success' => true,
            'dispensing' => [
                'patient' => $validated['patient'],
                'medicine' => $validated['medicine'],
                'quantity' => $validated['quantity'],
                'time' => Carbon::now()->format('h:i A'),
            ]
        ]);
    }
}
