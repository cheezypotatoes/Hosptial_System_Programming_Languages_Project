<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Medicine;
use App\Models\Service;
use App\Models\Item;
use App\Models\Category;
use Carbon\Carbon;

class MedicineController extends Controller
{
    /**
     * ✅ Render the main inventory page with all data via Inertia
     */
    public function inventoryPage(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('login')->withErrors(['You must be logged in to access this page.']);
        }

        $role = strtolower($user->position ?? 'guest');

        // ✅ Fetch Medicines
        $medicines = Medicine::with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn($m) => [
                'id' => $m->id,
                'name' => $m->name,
                'stock' => $m->stock,
                'price' => $m->price,
                'expiry' => $m->expiry,
                'category' => $m->category?->name ?? 'Uncategorized',
            ]);

        // ✅ Fetch Services
        $services = Service::with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn($s) => [
                'id' => $s->id,
                'name' => $s->name,
                'description' => $s->description ?? 'No description available',
                'price' => $s->price,
                'category' => $s->category?->name ?? 'Uncategorized',
            ]);

        // ✅ Fetch Items
        $items = Item::with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn($i) => [
                'id' => $i->id,
                'name' => $i->name,
                'description' => $i->description ?? 'No description available',
                'price' => $i->price,
                'stock' => $i->stock_quantity,
                'category' => $i->category?->name ?? 'Uncategorized',
            ]);

        // ✅ Fetch Categories
        $categories = Category::orderBy('name')->get(['id', 'name', 'description']);

        return Inertia::render('Medicine/MedicineInventory', [
            'user' => [
                'user_id' => $user->user_id ?? $user->id,
                'first_name' => $user->first_name ?? '',
                'last_name' => $user->last_name ?? '',
                'email' => $user->email,
            ],
            'role' => $role,
            'categories' => $categories,
            'medicines' => $medicines,
            'services' => $services,
            'items' => $items,
        ]);
    }

    /**
     * ✅ Store a new medicine
     */
public function store(Request $request)
{
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'stock' => 'required|integer|min:0',
        'price' => 'required|numeric|min:0',
        'expiry' => 'nullable|date',
        'description' => 'nullable|string|max:255',
    ]);

    // Default expiry to today if not provided
    $validated['expiry'] = $validated['expiry'] ?? now()->toDateString();

    // Cast numeric fields
    $validated['stock'] = (int) $validated['stock'];
    $validated['price'] = (float) $validated['price'];

    // Remove any unexpected fields (e.g., category_id)
    unset($validated['category_id']);

    $medicine = \App\Models\Medicine::create($validated);

    return response()->json([
        'success' => true,
        'message' => 'Medicine added successfully!',
        'medicine' => $medicine,
    ]);
}


    /**
     * ✅ Store a new service
     */
    public function storeService(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
        ]);

        $service = Service::create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Service added successfully!',
            'service' => $service,
        ]);
    }

    /**
     * ✅ Store a new item
     */
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
            'message' => 'Item added successfully!',
            'item' => $item,
        ]);
    }

    /**
     * ✅ Dispense a medicine
     */
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

        $medicine->decrement('stock', $validated['quantity']);

        return response()->json([
            'success' => true,
            'message' => 'Medicine dispensed successfully!',
            'dispensing' => [
                'patient' => $validated['patient'],
                'medicine' => $validated['medicine'],
                'quantity' => $validated['quantity'],
                'time' => Carbon::now()->format('h:i A'),
            ],
        ]);
    }
}
