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
        // Fetch only users where position is 'doctor'
        $doctors = User::where('position', 'doctor')->get();

        return Inertia::render('Nurse/MakeAppointment', [
            'patient' => $patient,
            'doctors' => $doctors,
        ]);
    }

    // Store appointment in database
    public function store(Request $request, Patient $patient)
    {
        $request->validate([
            'doctor_id' => 'required|exists:users,id',
            'checkup_date' => 'required|date',
            'notes' => 'nullable|string',
            'fee' => 'required|numeric|min:0',
        ]);

        Appointment::create([
            'patient_id' => $patient->id,
            'doctor_id' => $request->doctor_id, // ✅ Use the doctor selected in the form
            'checkup_date' => $request->checkup_date,
            'notes' => $request->notes,
            'fee' => $request->fee,
        ]);

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
