<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\AppointmentService;
use App\Models\AppointmentMedication;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Medicine;
use App\Models\Service;

class PhysicianAppointmentController extends Controller
{
    /**
     * Display a listing of the physician's appointments.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $role = strtolower($user->position); // role for frontend

        $physician = $request->user();

        $appointments = Appointment::where('doctor_id', $physician->id)
            ->with(['patient'])
            ->orderBy('checkup_date', 'desc')
            ->get();

        return Inertia::render('Physician/Appointments', [
            'role' => $role,
            'physician' => $physician,
            'appointments' => $appointments
        ]);
    }

    /**
     * Show details of an appointment including medications and services.
     */
    public function show(Request $request, $patientId, $appointmentId)
    {
        $user = $request->user(); // authenticated physician
        $role = strtolower($user->position);

        $appointment = Appointment::with('patient', 'doctor', 'medications', 'services')
            ->where('patient_id', $patientId)
            ->where('id', $appointmentId)
            ->firstOrFail();

        $patient = $appointment->patient; // fetch patient from appointment

        $medicineNames = Medicine::pluck('name');
        $serviceNames = Service::pluck('name');

        return Inertia::render('Physician/AppointmentDetails', [
            'appointment' => $appointment,
            'role' => $role,
            'user' => $patient,          // pass patient here
            'medicineNames' => $medicineNames,
            'serviceNames' => $serviceNames,
        ]);
    }

    /**
     * Store or update appointment details including medications and services.
     */
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

        $appointment->save(); // create or update

        // Clear existing medications and services if updating
        if ($appointmentId) {
            $appointment->medications()->delete();
            $appointment->services()->delete();
        }

        // Store medications
        foreach ($medications as $medication) {
            if (empty($medication['name'])) {
                continue; // skip medications with no name
            }

            AppointmentMedication::create([
                'appointment_id' => $appointment->id,
                'name' => $medication['name'],
                'dosage' => $medication['dosage'],
                'frequency' => $medication['frequency'],
                'duration' => $medication['duration'],
                'notes' => $medication['notes'] ?? null,
            ]);
        }

        // Store services
        foreach ($services as $service) {
            AppointmentService::create([
                'appointment_id' => $appointment->id,
                'name' => $service['name'],
                'description' => $service['description'] ?? null,
                'cost' => $service['cost'] ?? 0.00,
                'result' => $service['result'] ?? null,
            ]);
        }
    }
}
