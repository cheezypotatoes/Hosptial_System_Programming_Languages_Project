<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use Carbon\Carbon;

class PatientController extends Controller
{
    /**
     * Show the form for creating a new patient.
     */
    public function create()
    {

        return inertia('Nurse/AddPatients'); // React/Inertia page
    }

    /**
     * Store a newly created patient in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'first_name'   => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'birthdate'    => 'required|date',
            'gender'       => 'required|in:Male,Female,Other',
            'contact_num'  => 'required|string|max:20',
            'address'      => 'nullable|string|max:255',
        ]);

        Patient::create($validated);

        return redirect()
            ->route('dashboard')
            ->with('success', 'Patient added successfully!');
    }

    public function index(Request $request)
{
    // Get the authenticated user
    $user = $request->user();

    // Fetch all patients
    $patients = Patient::latest()->get();

    // Return the data with role and user to the frontend
    return inertia('Nurse/PatientManagement', [
        'patients' => $patients,
        'role' => strtolower($user->position), // Convert role to lowercase
        'user' => $user, // Pass the entire user object
        'flash' => [
            'success' => session('success'), // Pass any success flash messages
        ],
    ]);
}


    public function destroy(Patient $patient)
    {
        $patient->delete();

        return redirect()->route('nurse.patients.index')
            ->with('success', 'Patient deleted successfully!');
    }


    public function edit(Patient $patient)
    {
        return inertia('Nurse/EditPatient', [
            'patient' => [
                'id' => $patient->id,
                'first_name' => $patient->first_name,
                'last_name' => $patient->last_name,
                'birthdate' => $patient->birthdate ? Carbon::parse($patient->birthdate)->format('Y-m-d') : null,
                'gender' => $patient->gender,
                'contact_num' => $patient->contact_num,
                'address' => $patient->address,
            ],
        ]);
    }

    public function update(Request $request, Patient $patient)
    {
        $validated = $request->validate([
            'first_name'   => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'birthdate'    => 'required|date',
            'gender'       => 'required|in:Male,Female,Other',
            'contact_num'  => 'required|string|max:20',
            'address'      => 'nullable|string|max:255',
        ]);

        $patient->update($validated);

        return redirect()
            ->route('nurse.patients.index')
            ->with('success', 'Patient updated successfully!');
    }

    public function getPrescriptions($id)
{
    // Fetch the patient by ID
    $patient = Patient::find($id);

    // Check if the patient exists
    if (!$patient) {
        return response()->json(['message' => 'Patient not found'], 404);
    }

    // Fetch all appointments for the patient
    $appointments = $patient->appointments;

    // Initialize an array to hold the medications (prescriptions)
    $prescriptions = [];

    // Loop through appointments and get medications for each
    foreach ($appointments as $appointment) {
        // Fetch medications associated with the appointment
        $medications = $appointment->medications;

        // Fetch the doctor using the doctor_id from the appointment
        $doctor = $appointment->doctor; // assumes doctor_id → User model

        // If medications exist, add them to the prescriptions array
        foreach ($medications as $medication) {
            $prescriptions[] = [
                'medication'       => $medication->name ?? null,         // Medication name
                'dosage'           => $medication->dosage ?? null,       // Dosage
                'instructions'     => $medication->notes ?? null,        // Notes or instructions
                'doctor_name'      => $doctor ? "{$doctor->first_name} {$doctor->last_name}" : null, // Doctor's full name
                'date_prescribed'  => $appointment->checkup_date 
                    ? \Carbon\Carbon::parse($appointment->checkup_date)->format('Y-m-d') 
                    : null, // ✅ Added prescribed date (formatted)
            ];
        }
    }

    // If no prescriptions are found, return null
    if (empty($prescriptions)) {
        return response()->json(null);
    }

    // Return the prescriptions as JSON response
    return response()->json($prescriptions);
}

    public function getMedicalConditions($id)
    {
        // Find the patient
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

        // Fetch all appointments related to the patient
        // Only select the fields we need: symptoms and checkup_date
        $appointments = $patient->appointments()
            ->select('symptoms', 'checkup_date')
            ->whereNotNull('symptoms')
            ->orderByDesc('checkup_date')
            ->get();

        // Transform the data to match frontend expectations
        $medicalConditions = $appointments->map(function ($appointment) {
            return [
                'symptom' => $appointment->symptoms,
                'date' => $appointment->checkup_date
                    ? \Carbon\Carbon::parse($appointment->checkup_date)->format('Y-m-d')
                    : null,
            ];
        });

        return response()->json($medicalConditions);
    }
}
