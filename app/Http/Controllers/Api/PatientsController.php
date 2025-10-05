<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientsController extends Controller
{
    /**
     * List all patients (basic info)
     */
    public function index(): JsonResponse
    {
        $patients = Patient::select('id', 'first_name', 'last_name', 'birthdate', 'gender', 'contact_num', 'address')
            ->get();

        return response()->json($patients);
    }

    /**
     * Search for a patient by name and include prescriptions
     */
    public function search(Request $request): JsonResponse
    {
        $query = $request->get('q');

        if (!$query) {
            return response()->json(['message' => 'No search query provided'], 400);
        }

        $patient = Patient::with('prescriptions') // uses relationship
            ->where('first_name', 'LIKE', "%{$query}%")
            ->orWhere('last_name', 'LIKE', "%{$query}%")
            ->first();

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        return response()->json($patient);
    }
}
