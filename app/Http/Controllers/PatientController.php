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

    public function index()
    {
        $patients = Patient::latest()->get();

        return inertia('Nurse/Index', [
            'patients' => $patients,
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
}
