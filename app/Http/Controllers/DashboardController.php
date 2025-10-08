<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Appointment;
use App\Models\Medicine; // <-- Import Medicine model

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Get the position of the user and convert it to lowercase
        $role = strtolower($user->position); 
        
        // Count today's appointments
        $appointmentsTodayCount = Appointment::whereDate('checkup_date', now()->toDateString())->count();
        
        // Count upcoming appointments
        $upcomingAppointmentsCount = Appointment::where('checkup_date', '>', now())->count();

        // Count medicines with stock <= 20
        $lowStockCount = Medicine::where('stock', '<=', 15)->count();

        // Pass data to Inertia
        return Inertia::render('Profile/Dashboard', [
            'user' => $user, 
            'role' => $role, 
            'appointmentsTodayCount' => $appointmentsTodayCount,
            'upcomingAppointmentsCount' => $upcomingAppointmentsCount,
            'lowStockCount' => $lowStockCount, 
        ]);
    }
}
