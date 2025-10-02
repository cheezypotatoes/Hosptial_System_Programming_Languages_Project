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

        $position = $user->position;

        // Get the count of today's appointments (or modify as needed)
        $appointmentsTodayCount = Appointment::whereDate('checkup_date', now()->toDateString())->count();
        
        // Or if you want to count upcoming appointments
        $upcomingAppointmentsCount = Appointment::where('checkup_date', '>', now())->count();

        return Inertia::render('Profile/Dashboard', [
            'user' => $user,
            'role' => $position,
            'appointmentsTodayCount' => $appointmentsTodayCount,
            'upcomingAppointmentsCount' => $upcomingAppointmentsCount,
        ]);
    }
}
