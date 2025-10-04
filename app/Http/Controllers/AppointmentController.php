<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    // Show form to create appointment for a patient
    public function create(Patient $patient)
{
    // Fetch users where position is 'Doctor' and eagerly load the physician relationship
    $doctors = User::where('position', 'Doctor')
        ->with('physician')  // Eager load the physician relationship
        ->get()
        ->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'first_name' => $doctor->first_name,
                'last_name' => $doctor->last_name,
                'specialization' => $doctor->physician ? $doctor->physician->specialization : null, // Access specialization
            ];
        });

    // Prepare data to send to the view
    return Inertia::render('Nurse/MakeAppointment', [
        'patient' => $patient,
        'doctors' => $doctors,
    ]);
}


    // Store appointment in database
    public function store(Request $request, Patient $patient)
    {
        // Validate the incoming data
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'checkup_date' => 'required|date',
            'problem' => 'required|string|max:255', // Add validation for the problem field
            'history' => 'nullable|string', // Medical history is optional, but should be a string if provided
            'symptoms' => 'nullable|string', // Symptoms field is optional
            'medication' => 'nullable|string', // Medication field is optional
            'fee' => 'required|numeric|min:0', // Fee must be a positive number
        ]);

        // Create a new appointment with all the necessary details
        Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $request->doctor_id,  // Store the selected doctor ID
            'checkup_date' => $request->checkup_date,
            'problem' => $request->problem,      // Store the problem field
            'history' => $request->history,      // Store the medical history
            'symptoms' => $request->symptoms,    // Store the symptoms
            'medication' => $request->medication, // Store the medication
            'fee' => $request->fee,
        ]);

        // Redirect back to the patient list with a success message
        return redirect()->route('nurse.patients.index')
                        ->with('success', 'Appointment scheduled successfully!');
    }



    // View appointments for a patient
    public function viewAppointments(Patient $patient)
    {
        $appointments = $patient->appointments()->with('doctor')->get();

        return Inertia::render('Nurse/PatientAppointments', [
            'patient' => $patient,
            'appointments' => $appointments,
        ]);
    }

    // Delete appointment
    public function destroyAppointment(Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->back()->with('success', 'Appointment deleted successfully.');
    }
}
