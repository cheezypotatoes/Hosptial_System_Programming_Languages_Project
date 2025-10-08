<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Prescription;
use App\Models\Patient;

class PharmacistController extends Controller
{
    // Render pharmacist dashboard
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return redirect()->route('login');
        }

        return Inertia::render('Pharmacist/Pharmacist', [
            'user' => $user,
            'role' => strtolower($user->position),
        ]);
    }

    // Fetch all prescriptions
    public function prescriptions()
    {
        $prescriptions = Prescription::with('patient')->get()->map(function ($pres) {
            return [
                'id' => $pres->id,
                'patient_name' => $pres->patient->first_name . ' ' . $pres->patient->last_name,
                'medicine_name' => $pres->medication,
                'dosage' => $pres->dosage,
                'instructions' => $pres->instructions,
                'doctor_name' => $pres->doctor_name,
                'prescribed_date' => $pres->prescribed_date->format('Y-m-d'),
                'status' => $pres->status ?? 'pending', // add status if needed
            ];
        });

        return response()->json([
            'success' => true,
            'prescriptions' => $prescriptions,
        ]);
    }

    // Mark prescription as dispensed
    public function dispense($id)
    {
        $prescription = Prescription::find($id);

        if (!$prescription) {
            return response()->json(['success' => false, 'message' => 'Prescription not found.'], 404);
        }

        if (($prescription->status ?? 'pending') === 'dispensed') {
            return response()->json(['success' => false, 'message' => 'Prescription already dispensed.'], 400);
        }

        $prescription->status = 'dispensed';
        $prescription->dispensed_at = now();
        $prescription->save();

        return response()->json(['success' => true, 'message' => 'Prescription dispensed successfully.']);
    }

    // Fetch prescriptions for a specific patient
   // Fetch prescriptions for a specific patient
public function patientPrescriptions($patientId)
{
    $patient = Patient::find($patientId);
    if (!$patient) {
        return response()->json(['success' => false, 'message' => 'Patient not found.'], 404);
    }

    $prescriptions = Prescription::with('patient')
        ->where('patient_id', $patientId)
        ->get()
        ->map(function ($pres) {
            return [
                'id' => $pres->id,
                'patient_name' => $pres->patient->first_name . ' ' . $pres->patient->last_name,
                'medicine_name' => $pres->medication,
                'dosage' => $pres->dosage,
                'instructions' => $pres->instructions,
                'doctor_name' => $pres->doctor_name,
                'prescribed_date' => $pres->prescribed_date->format('Y-m-d'),
                'status' => $pres->status ?? 'pending', // default to pending
            ];
        });

    return response()->json([
        'success' => true,
        'prescriptions' => $prescriptions,
    ]);
}

}
