<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Dispense;
use App\Models\Prescription;
use App\Models\Patient;
use App\Models\Medicine;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class DispenseController extends Controller
{
    /**
     * Store a dispense record
     */
    public function store(Request $request)
    {
        // Validate request
        $validator = Validator::make($request->all(), [
            'patient_id' => 'required|exists:patients,id',
            'prescription_id' => 'required|exists:prescriptions,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return back()->withErrors($validator)->withInput();
        }

        // Find prescription and related medicine
        $prescription = Prescription::findOrFail($request->prescription_id);
        $medicine = Medicine::findOrFail($prescription->medicine_id);

        // Check stock
        if ($medicine->stock < $request->quantity) {
            return back()->withErrors(['quantity' => 'Not enough stock available.']);
        }

        // Deduct stock
        $medicine->decrement('stock', $request->quantity);

        // Record dispense
        Dispense::create([
            'patient_id' => $request->patient_id,
            'medicine_id' => $medicine->id,
            'quantity' => $request->quantity,
            'dispensed_at' => now(),
        ]);

        return back()->with('success', 'Medicine dispensed successfully!');
    }

    /**
     * Show patient details and dispense logs
     */
    public function show($id)
    {
        $patient = Patient::with('prescriptions')->findOrFail($id);

        $dispense_logs = Dispense::where('patient_id', $id)
            ->with('medicine')
            ->latest()
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'medicine_name' => $log->medicine->name ?? 'Unknown',
                    'quantity' => $log->quantity,
                    'dispensed_at' => $log->dispensed_at->format('Y-m-d H:i:s'),
                ];
            });

        return Inertia::render('Dispensing/PatientDetails', [
            'patient' => $patient,
            'dispense_logs' => $dispense_logs,
        ]);
    }
}
