<?php

namespace App\Http\Controllers;

use App\Models\Dispense;
use Illuminate\Http\Request;
use App\Models\Medicine;

class DispensingController extends Controller
{
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

        return back()->with('success', 'Medicine dispensed successfully.');
    }

    // Get recent dispensing logs
    public function logs()
    {
        return Dispense::latest()->take(10)->get();
    }
}
