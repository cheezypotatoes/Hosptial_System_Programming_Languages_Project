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

public function show(Request $request, $patientId, $appointmentId)
{
    $user = $request->user();
    
    // Get the position of the user and convert it to lowercase
    $role = strtolower($user->position);
    
    // Fetch the appointment for the given patientId and appointmentId, including related medications and services
    $appointment = Appointment::with('patient', 'doctor', 'medications', 'services')  // Eager load medications and services
        ->where('patient_id', $patientId)  // Filter by patient_id
        ->where('id', $appointmentId)  // Filter by appointment_id
        ->firstOrFail();  // Ensure we get only one or fail if not found

    // Return the appointment details along with medications and services to the Inertia page
    return Inertia::render('Physician/AppointmentDetails', [
        'appointment' => $appointment,  // Pass appointment data to the view
        'role' => $role,
    ]);
}

public function store(Request $request, $appointmentId = null)
{
    $medications = $request->input('medications', []);
    $services = $request->input('services', []);

    $appointment = $appointmentId ? Appointment::find($appointmentId) : new Appointment();

    if ($appointmentId && !$appointment) {
        return redirect()->route('physician.appointments.index')
                         ->with('error', 'Appointment not found.');
    }

    if ($request->has('notes')) {
        $appointment->notes = $request->input('notes');
    }
    $appointment->save(); // Save the appointment (create or update)

    // Clear existing medications and services if updating
    if ($appointmentId) {
        $appointment->medications()->delete();
        $appointment->services()->delete();
    }

    // Store medications
    foreach ($medications as $medication) {
        AppointmentMedication::create([
            'appointment_id' => $appointment->id,
            'name' => $medication['name'],
            'dosage' => $medication['dosage'],
            'frequency' => $medication['frequency'],
            'duration' => $medication['duration'],
            'notes' => $medication['notes'] ?? null,
        ]);
    }

    // Store services with result field
    foreach ($services as $service) {
        AppointmentService::create([
            'appointment_id' => $appointment->id,
            'name' => $service['name'],
            'description' => $service['description'] ?? null,
            'cost' => $service['cost'] ?? 0.00,
            'result' => $service['result'] ?? null,  // Add this line
        ]);
    }

     $user = $request->user();
        
        // Get the position of the user and convert it to lowercase
        $role = strtolower($user->position); // this is the `role` you're passing
        
        // Get the count of today's appointments (or modify as needed)
        $appointmentsTodayCount = Appointment::whereDate('checkup_date', now()->toDateString())->count();
        
        // Or if you want to count upcoming appointments
        $upcomingAppointmentsCount = Appointment::where('checkup_date', '>', now())->count();




    return Inertia::render('Profile/Dashboard', [
            'user' => $user, // Passing full user info
            'role' => $role, // Passing lowercase position as role
            'appointmentsTodayCount' => $appointmentsTodayCount,
            'upcomingAppointmentsCount' => $upcomingAppointmentsCount,
        ]);
}

}
