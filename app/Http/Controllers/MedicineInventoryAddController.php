<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Medicine;
use App\Models\Service;
use App\Models\Item;

class MedicineInventoryAddController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $role = strtolower($user->position);

        // ✅ Fetch data
        $medicines = Medicine::orderBy('name')->get();

        $services = Service::with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn($service) => [
                'id' => $service->id,
                'name' => $service->name,
                'description' => $service->description,
                'price' => $service->price,
                'category' => $service->category?->name ?? 'Uncategorized',
            ]);

        $items = Item::with('category:id,name')
            ->orderBy('name')
            ->get()
            ->map(fn($item) => [
                'id' => $item->id,
                'name' => $item->name,
                'description' => $item->description,
                'price' => $item->price,
                'stock' => $item->stock_quantity,
                'category' => $item->category?->name ?? 'Uncategorized',
            ]);

        return Inertia::render('Medicine/MedicineInventory', [
            'user' => $user,
            'role' => $role,
            'medicines' => $medicines,
            'services' => $services,
            'items' => $items,
        ]);
    }

    // ✅ Medicine Store
    public function storeMedicine(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'stock' => 'required|integer|min:0',
            'price' => 'required|numeric|min:0',
            'expiry' => 'nullable|date',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        if (empty($validated['expiry'])) {
            $validated['expiry'] = now()->toDateString();
        }

        Medicine::create($validated);

        return redirect()->back()->with('success', 'Medicine added successfully!');
    }

    // ✅ Service Store
    public function storeService(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        Service::create($validated);

        return redirect()->back()->with('success', 'Service added successfully!');
    }

    // ✅ Item Store
    public function storeItem(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string|max:500',
            'price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        Item::create($validated);

        return redirect()->back()->with('success', 'Item added successfully!');
    }

    // ✅ Dispense Medicine
    public function dispense(Request $request)
    {
        $validated = $request->validate([
            'patient' => 'required|string|max:255',
            'medicine' => 'required|string|max:255',
            'quantity' => 'required|integer|min:1',
        ]);

        $medicine = Medicine::where('name', $validated['medicine'])->first();

        if (!$medicine) {
            return redirect()->back()->with('error', 'Medicine not found.');
        }

        if ($medicine->stock < $validated['quantity']) {
            return redirect()->back()->with('error', 'Not enough stock.');
        }

        $medicine->stock -= $validated['quantity'];
        $medicine->save();

        return redirect()->back()->with('success', 'Medicine dispensed successfully.');
    }
}
