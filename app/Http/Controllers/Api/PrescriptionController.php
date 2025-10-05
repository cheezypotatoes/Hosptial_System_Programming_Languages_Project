<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Models\Patient;
use Illuminate\Http\Request;       // ✅ Import Request
use Illuminate\Http\JsonResponse; // ✅ Import JsonResponse

class PrescriptionController extends Controller
{
    /**
     * Fetch all prescriptions for a given patient.
     */
    public function getByPatient($id): JsonResponse
    {
        $patient = Patient::with('prescriptions')->find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        return response()->json($patient->prescriptions);
    }

    /**
     * Optional: Fetch all prescriptions (admin view).
     */
    public function index(): JsonResponse
    {
        $prescriptions = Prescription::with('patient')->get();
        return response()->json($prescriptions);
    }

    /**
     * Store a new prescription for a patient.
     */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'patient_id'      => 'required|exists:patients,id',
            'doctor_name'     => 'required|string|max:255',
            'medication'      => 'required|string|max:255',
            'dosage'          => 'nullable|string|max:255',
            'instructions'    => 'nullable|string',
            'prescribed_date' => 'required|date',
        ]);

        $prescription = Prescription::create($data);

        return response()->json($prescription, 201);
    }
}
