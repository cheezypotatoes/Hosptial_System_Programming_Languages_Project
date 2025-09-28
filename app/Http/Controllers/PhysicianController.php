<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Physician;
use App\Models\Appointment;
use App\Models\Patient;


class PhysicianController extends Controller
{
    /**
     * Show physician dashboard (appointments + patient record)
     */
    public function records()
    {
        $user = Auth::user();

        // ✅ Ensure only doctors can access this
        if ($user->position !== 'Doctor') {
            return redirect()->route('dashboard');
        }

        // Upcoming appointments (7 days window)
        $upcomingAppointments = Appointment::with('patient')
            ->where('doctor_id', $user->id)
            ->whereDate('checkup_date', '>=', now())
            ->whereDate('checkup_date', '<=', now()->addDays(7))
            ->orderBy('checkup_date', 'asc')
            ->get()
            ->map(function ($appt) {
                return [
                    'id' => $appt->id,
                    'patientName' => $appt->patient
                        ? $appt->patient->first_name . ' ' . $appt->patient->last_name
                        : 'Unknown Patient',
                    'time' => $appt->checkup_date->format('h:i A'),
                    'reason' => $appt->notes ?? 'No reason provided',
                ];
            });

        // Example: load first patient for demo (later: you’ll load dynamically)
        $patient = Patient::first();
        $patientData = $patient ? [
            'name' => $patient->first_name . ' ' . $patient->last_name,
            'age' => $patient->age,
            'gender' => $patient->gender,
            'contact' => $patient->contact_number,
            'medicalHistory' => $patient->medical_history ?? 'N/A',
            'currentConditions' => $patient->current_conditions ?? 'N/A',
            'medications' => $patient->medications ?? 'N/A',
            'notes' => $patient->notes ?? '',
        ] : null;

        return Inertia::render('Physician/PhysicianRecords', [
            'upcomingAppointments' => $upcomingAppointments,
            'patient' => $patientData,
        ]);
    }

    /**
     * Show edit profile form
     */
    public function edit()
    {
        $user = Auth::user();

        if ($user->position !== 'Doctor') {
            return redirect()->route('dashboard');
        }

        $physician = Physician::where('user_id', $user->id)->first();

        return Inertia::render('Physician/PhysicianEdit', [
            'user'      => $user,
            'physician' => $physician,
        ]);
    }

    /**
     * Handle profile update
     */
    public function update(Request $request)
    {
        $user = Auth::user();

        if ($user->position !== 'Doctor') {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'first_name'      => 'required|string|max:255',
            'last_name'       => 'required|string|max:255',
            'specialization'  => 'required|string|max:255',
            'contract_number' => 'required|string|max:255',
            'room_number'     => 'required|string|max:255',
            'starting_time'   => 'nullable|date_format:H:i',
            'end_time'        => 'nullable|date_format:H:i',
        ]);

        // Update user basic info
        // $user->update([
        //     'first_name' => $data['first_name'],
        //     'last_name'  => $data['last_name'],
        // ]);

        // Update or create physician record
        Physician::updateOrCreate(
            ['user_id' => $user->id],
            [
                'specialization'  => $data['specialization'],
                'contract_number' => $data['contract_number'],
                'room_number'     => $data['room_number'],
                'starting_time'   => $data['starting_time'],
                'end_time'        => $data['end_time'],
            ]
        );

        return redirect()->route('dashboard')
            ->with('success', 'Profile updated successfully.');
    }
}
