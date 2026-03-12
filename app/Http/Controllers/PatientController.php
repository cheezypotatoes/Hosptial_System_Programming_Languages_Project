<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;
use Carbon\Carbon;

class PatientController extends Controller
{
   
    public function create()
    {

        return inertia('Nurse/AddPatients'); 
    }

  
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
  
    $user = $request->user();

    
    $patients = Patient::latest()->get();

    
    return inertia('Nurse/PatientManagement', [
        'patients' => $patients,
        'role' => strtolower($user->position), 
        'user' => $user, 
        'flash' => [
            'success' => session('success'), 
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

    $patient = Patient::find($id);

    if (!$patient) {
        return response()->json(['message' => 'Patient not found'], 404);
    }

    $appointments = $patient->appointments;

      $prescriptions = [];

    foreach ($appointments as $appointment) {
         $medications = $appointment->medications;

        $doctor = $appointment->doctor; 

        
        foreach ($medications as $medication) {
            $prescriptions[] = [
                'medication'       => $medication->name ?? null,         
                'dosage'           => $medication->dosage ?? null,       
                'instructions'     => $medication->notes ?? null,       
                'doctor_name'      => $doctor ? "{$doctor->first_name} {$doctor->last_name}" : null, 
                'date_prescribed'  => $appointment->checkup_date 
                    ? \Carbon\Carbon::parse($appointment->checkup_date)->format('Y-m-d') 
                    : null, 
            ];
        }
    }

   
    if (empty($prescriptions)) {
        return response()->json(null);
    }

 
    return response()->json($prescriptions);
}

    public function getMedicalConditions($id)
    {
        $patient = Patient::find($id);

        if (!$patient) {
            return response()->json(['message' => 'Patient not found'], 404);
        }

         $appointments = $patient->appointments()
            ->select('symptoms', 'checkup_date')
            ->whereNotNull('symptoms')
            ->orderByDesc('checkup_date')
            ->get();

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
