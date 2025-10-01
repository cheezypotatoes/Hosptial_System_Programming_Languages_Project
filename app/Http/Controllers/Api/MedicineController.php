<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Medicine;
use Carbon\Carbon;

class MedicineController extends Controller

{
    // Fetch all medicines with optional search
    public function index(Request $request)
    {
        $query = Medicine::query();

        if ($request->has('search') && $request->search != '') {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        $medicines = $query->orderBy('name')->get();

        return response()->json([
            'success' => true,
            'medicines' => $medicines
        ]);
    }

    // Add new medicine
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
            'message' => 'Medicine added successfully',
            'medicine' => $medicine
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

        // Update stock
        $medicine->stock -= $validated['quantity'];
        $medicine->save();

        // Dispensing record (for frontend)
        $dispensing = [
            'patient' => $validated['patient'],
            'medicine' => $validated['medicine'],
            'quantity' => $validated['quantity'],
            'time' => Carbon::now()->format('h:i A'),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Dispensed successfully',
            'dispensing' => $dispensing
        ]);
    }
}
