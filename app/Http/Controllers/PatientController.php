<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Patient;

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
}
