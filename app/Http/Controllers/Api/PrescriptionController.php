<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Prescription;
use App\Models\Patient;
use Illuminate\Http\Request;       
use Illuminate\Http\JsonResponse; 

class PrescriptionController extends Controller
{
    
    public function getByPatient($id): JsonResponse
    {
        $patient = Patient::with('prescriptions')->find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        return response()->json($patient->prescriptions);
    }


    public function index(): JsonResponse
    {
        $prescriptions = Prescription::with('patient')->get();
        return response()->json($prescriptions);
    }


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
