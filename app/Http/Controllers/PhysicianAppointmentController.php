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

    public function index(Request $request)
    {
        $user = $request->user();
        $role = strtolower($user->position); 

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

   
    public function show(Request $request, $patientId, $appointmentId)
    {
        $user = $request->user();
        $role = strtolower($user->position);

        $appointment = Appointment::with('patient', 'doctor', 'medications', 'services')
            ->where('patient_id', $patientId)
            ->where('id', $appointmentId)
            ->firstOrFail();

        $patient = $appointment->patient; 

        $medicineNames = Medicine::pluck('name');
        $serviceNames = Service::pluck('name');

        return Inertia::render('Physician/AppointmentDetails', [
            'appointment' => $appointment,
            'role' => $role,
            'user' => $patient,         
            'medicineNames' => $medicineNames,
            'serviceNames' => $serviceNames,
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

        $appointment->save(); 

       if ($appointmentId) {
            $appointment->medications()->delete();
            $appointment->services()->delete();
        }

       foreach ($medications as $medication) {
            if (empty($medication['name'])) {
                continue; 
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
