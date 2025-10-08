<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Carbon\Carbon;
use App\Models\Appointment;
use App\Models\Patient;

class PhysicianController extends Controller
{
    // Display patient records
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
            $p = Patient::with(['appointmentMedications', 'medicalConditions', 'appointments'])->find($patientId);

            if ($p) {
                // Get the latest appointment for notes
                $latestAppointment = $p->appointments()->latest('checkup_date')->first();

                $selectedPatient = [
                    'id' => $p->id,
                    'name' => $p->full_name,
                    'age' => $p->birthdate ? Carbon::parse($p->birthdate)->age : null,
                    'gender' => $p->gender,
                    'contact' => $p->contact_num,
                    'notes' => $latestAppointment?->notes ?? "", // fetch notes from latest appointment
                    'latest_appointment_id' => $latestAppointment?->id ?? null, // for saving notes

                    // Past medical conditions
                    'medical_conditions' => $p->medicalConditions
                        ->map(fn($mc) => [
                            'id' => $mc->id,
                            'condition_name' => $mc->condition_name,
                            'status' => $mc->status,
                            'diagnosed_date' => $mc->diagnosed_date ? Carbon::parse($mc->diagnosed_date)->format('Y-m-d') : null,
                            'ended_date' => $mc->ended_date ? Carbon::parse($mc->ended_date)->format('Y-m-d') : null,
                        ])->values()->all(),

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

    // 🔹 Save notes to latest appointment
    public function saveNotes(Request $request, $appointmentId)
    {
        $request->validate([
            'notes' => 'nullable|string',
        ]);

        $appointment = Appointment::findOrFail($appointmentId);
        $appointment->notes = $request->notes;
        $appointment->save();

        return back()->with('success', 'Notes saved successfully.');
    }
}
