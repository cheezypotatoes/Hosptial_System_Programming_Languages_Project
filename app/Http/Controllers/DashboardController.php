<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Appointment;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get the position of the user and convert it to lowercase
        $role = strtolower($user->position); // this is the `role` you're passing
        
        // Get the count of today's appointments (or modify as needed)
        $appointmentsTodayCount = Appointment::whereDate('checkup_date', now()->toDateString())->count();
        
        // Or if you want to count upcoming appointments
        $upcomingAppointmentsCount = Appointment::where('checkup_date', '>', now())->count();

        // Pass the role (lowercase position) to the view
        return Inertia::render('Profile/Dashboard', [
            'user' => $user, // Passing full user info
            'role' => $role, // Passing lowercase position as role
            'appointmentsTodayCount' => $appointmentsTodayCount,
            'upcomingAppointmentsCount' => $upcomingAppointmentsCount,
        ]);
    }
}
