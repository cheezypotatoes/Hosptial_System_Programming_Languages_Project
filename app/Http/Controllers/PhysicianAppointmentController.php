<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AppointmentService;
use App\Models\AppointmentMedication;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PhysicianAppointmentController extends Controller
{
    /**
     * Display a listing of the physician's appointments.
     *
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {

        $user = $request->user();
        
        // Get the position of the user and convert it to lowercase
        $role = strtolower($user->position); // this is the `role` you're passing
        
        // Get the currently authenticated user (physician)
        $physician = $request->user();

        // Fetch the physician's appointments
        $appointments = Appointment::where('doctor_id', $physician->id)
            ->with(['patient'])  // Eager load the patient relationship
            ->orderBy('checkup_date', 'desc')
            ->get();

        // Pass the physician and appointments to the Inertia view
        return Inertia::render('Physician/Appointments', [
            'role' => $role,
            'physician' => $physician,
            'appointments' => $appointments
        ]);
    }

    public function show($patientId)
{
    // Fetch appointment for the given patient ID and include related medications and services
    $appointment = Appointment::with('patient', 'doctor', 'medications', 'services')  // Eager load medications and services
        ->where('patient_id', $patientId)  // Filter by patient_id
        ->firstOrFail();  // Ensure we get only one or fail if not found

    // Return the appointment details along with medications and services to the Inertia page
    return Inertia::render('Physician/AppointmentDetails', [
        'appointment' => $appointment,  // Pass appointment data to the view
    ]);


}

public function store(Request $request, $appointmentId = null)
{
    // Log the incoming request data for medications and services
    $medications = $request->input('medications');
    $services = $request->input('services');

    // Check if an appointment ID is provided, and fetch the existing appointment if found
    $appointment = $appointmentId ? Appointment::find($appointmentId) : new Appointment();
    
    if ($appointmentId && !$appointment) {
        return redirect()->route('physician.appointments.index')
                        ->with('error', 'Appointment not found.');
    }

    // Update or create the appointment with notes
    if ($request->has('notes')) {
        $appointment->notes = $request->input('notes');
    }
    $appointment->save(); // Save the appointment

    // Store medications
    foreach ($medications as $medication) {
        AppointmentMedication::create([
            'appointment_id' => $appointmentId, 
            'name' => $medication['name'],
            'dosage' => $medication['dosage'],
            'frequency' => $medication['frequency'],
            'duration' => $medication['duration'],
            'notes' => $medication['notes'],
        ]);
    }

    // Store services
    foreach ($services as $service) {
        AppointmentService::create([
            'appointment_id' => $appointmentId, 
            'name' => $service['name'],
            'description' => $service['description'],
            'cost' => $service['cost'] ?? 0.00,
        ]);
    }

    // Redirect with a success message
    return redirect()->route('physician.appointments.index', $appointment->patient_id)
                     ->with('success', 'Appointment updated successfully');
    }
}
