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
    // 🔹 Fetch all categories with services and items
    public function categories()
    {
        return Category::with(['services', 'items'])->get();
    }

    // 🔹 Store a dispensing record
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

    // 🔹 Render the dispensing page with user info and role
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            // Redirect to login if not authenticated
            return redirect()->route('login');
        }

        $role = strtolower($user->position); // Ensure 'position' exists in DB

        // Correct Inertia path matching folder structure
        return Inertia::render('Dispensing/Dispensing', [
            'user' => $user, // full user info
            'role' => $role, // role string
        ]);
    }

    // 🔹 Get the latest 10 dispense logs
    public function logs()
    {
        return Dispense::latest()->take(10)->get();
    }
}
