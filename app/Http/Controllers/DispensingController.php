<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Dispense;
use App\Models\Medicine;
use App\Models\Category;
use Illuminate\Http\Request;

class DispensingController extends Controller
{
    // ✅ API endpoint for categories with services and items
    public function categories()
    {
        return Category::with(['services', 'items'])->get();
    }

    // Store a dispensing record
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|string',
            'medicine'   => 'required|string',
            'dosage'     => 'required|string',
            'quantity'   => 'required|integer|min:1',
        ]);

        // Save dispensing
        Dispense::create([
            'patient_id' => $request->patient_id,
            'medicine'   => $request->medicine,
            'dosage'     => $request->dosage,
            'quantity'   => $request->quantity,
            'time'       => now(),
        ]);

        // Update medicine stock
        $med = Medicine::where('name', $request->medicine)->first();
        if ($med) {
            $med->stock -= $request->quantity;
            $med->status = $med->stock > 20 ? 'In stock' : 'Low stock';
            $med->save();
        }

        return response()->json(['message' => 'Medicine dispensed successfully.']);
    }

    public function index()
{
    $nurse = Auth::user();
    return Inertia::render('Dispensing', [
        'role' => $nurse->role ?? 'nurse',
        'nurseName' => $nurse->name,
    ]);
}
    public function logs()
    {
        return Dispense::latest()->take(10)->get();
    }
}
