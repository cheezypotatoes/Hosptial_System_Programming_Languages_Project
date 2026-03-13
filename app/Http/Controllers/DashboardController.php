<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Appointment;
use App\Models\Medicine; 

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        
        $role = strtolower($user->position); 

        $appointmentsTodayCount = Appointment::whereDate('checkup_date', now()->toDateString())->count();
        
        $upcomingAppointmentsCount = Appointment::where('checkup_date', '>', now())->count();

        $lowStockCount = Medicine::where('stock', '<=', 15)->count();

        return Inertia::render('Profile/Dashboard', [
            'user' => $user, 
            'role' => $role, 
            'appointmentsTodayCount' => $appointmentsTodayCount,
            'upcomingAppointmentsCount' => $upcomingAppointmentsCount,
            'lowStockCount' => $lowStockCount, 
        ]);
    }
}
