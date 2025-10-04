<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
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
}
