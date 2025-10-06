<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Physician;
use App\Models\Appointment;
use App\Models\Patient;

class PhysicianController extends Controller
{
    public function records(Request $request)
    {
        $user = Auth::user();

        if ($user->position !== 'Doctor') {
            return redirect()->route('dashboard');
        }

        $search = $request->input('search');
        $patientId = $request->input('patient_id');

        // 🔹 Upcoming appointments
        $upcomingAppointments = Appointment::with('patient')
            ->where('doctor_id', $user->id)
            ->whereDate('checkup_date', '>=', now())
            ->orderBy('checkup_date', 'asc')
            ->get()
            ->map(fn($appt) => [
                'id' => $appt->id,
                'patientName' => $appt->patient ? $appt->patient->full_name : 'Unknown Patient',
                'time' => Carbon::parse($appt->checkup_date)->format('h:i A'),
                'reason' => $appt->notes ?? 'No reason provided',
            ])->values();

        // 🔹 Search multiple patients
        $searchResults = [];
        if ($search) {
            $searchResults = Patient::query()
                ->where('first_name', 'like', "%{$search}%")
                ->orWhere('last_name', 'like', "%{$search}%")
                ->orWhere('id', 'like', "%{$search}%")
                ->orWhere('contact_num', 'like', "%{$search}%")
                ->limit(10)
                ->get()
                ->map(fn($patient) => [
                    'id' => $patient->id,
                    'name' => $patient->full_name,
                    'age' => now()->diffInYears($patient->birthdate),
                    'gender' => $patient->gender,
                    'contact' => $patient->contact_num,
                ])->values();
        }

        // 🔹 Selected patient full record
       $selectedPatient = null;

if ($patientId) {
    $p = Patient::with(['prescriptions', 'appointmentMedications', 'medicalConditions'])
        ->find($patientId);

    if ($p) {
        $selectedPatient = [
            'id' => $p->id,
            'name' => $p->full_name,
            'age' => $p->birthdate ? Carbon::parse($p->birthdate)->age : null, // FIXED
            'gender' => $p->gender,
            'contact' => $p->contact_num,
            'notes' => $p->notes,

            // Past medical conditions
            'medical_conditions' => $p->medicalConditions
                ->map(fn($mc) => [
                    'id' => $mc->id,
                    'condition_name' => $mc->condition_name,
                    'status' => $mc->status,
                    'diagnosed_date' => $mc->diagnosed_date ? Carbon::parse($mc->diagnosed_date)->format('Y-m-d') : null,
                    'ended_date' => $mc->ended_date ? Carbon::parse($mc->ended_date)->format('Y-m-d') : null,
                ])->values()->all(),

            // Current active medical conditions from accessor
            'current_medical_conditions' => $p->currentMedicalConditions,

            // Appointment medications
            'appointment_medications' => $p->appointmentMedications
                ->map(fn($am) => [
                    'id' => $am->id,
                    'name' => $am->name,
                    'dosage' => $am->dosage,
                    'frequency' => $am->frequency,
                    'duration' => $am->duration,
                    'notes' => $am->notes,
                ])->values()->all(),

            // Current appointment medications from accessor
            'current_appointment_medications' => $p->currentAppointmentMedications,

            // Prescriptions
            'prescriptions' => $p->prescriptions
                ->map(fn($pr) => [
                    'id' => $pr->id,
                    'doctor_name' => $pr->doctor_name,
                    'medication' => $pr->medication,
                    'dosage' => $pr->dosage,
                    'instructions' => $pr->instructions,
                    'prescribed_date' => $pr->prescribed_date ? Carbon::parse($pr->prescribed_date)->format('Y-m-d') : null,
                ])->values()->all(),
        ];
    }
}


        return Inertia::render('Physician/PhysicianRecords', [
            'upcomingAppointments' => $upcomingAppointments,
            'filters' => ['search' => $search],
            'searchResults' => $searchResults,
            'patient' => $selectedPatient,
            'role' => $user->position,
            'user' => $user,
        ]);
    }
}
