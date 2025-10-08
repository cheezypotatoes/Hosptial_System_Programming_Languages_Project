<?php

namespace App\Http\Controllers;

use App\Models\Appointment;
use App\Models\Patient;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class AppointmentController extends Controller
{
    // Show form to create appointment for a patient

    public function index(Request $request)
{
    $user = $request->user();
    $role = strtolower($user->position); // e.g., 'nurse'

    // Fetch all patients
    $patients = Patient::orderBy('created_at', 'desc')->get();

    // Return to Inertia page with patients, role, and user
    return Inertia::render('Nurse/PatientManagement', [
        'patients' => $patients,
        'role' => $role,
        'user' => $user,
        'flash' => [
            'success' => $request->session()->get('success'), // optional flash message
        ],
    ]);
}

    public function create(Patient $patient)
{
    // Fetch users where position is 'Doctor' and eagerly load the physician relationship
    $doctors = User::where('position', 'Doctor')
        ->with('physician')  // Eager load the physician relationship
        ->get()
        ->map(function ($doctor) {
            return [
                'id' => $doctor->id,
                'first_name' => $doctor->first_name,
                'last_name' => $doctor->last_name,
                'specialization' => $doctor->physician ? $doctor->physician->specialization : null, // Access specialization
            ];
        });

    // Prepare data to send to the view
    return Inertia::render('Nurse/MakeAppointment', [
        'patient' => $patient,
        'doctors' => $doctors,
    ]);
}


    // Store appointment in database
public function store(Request $request, Patient $patient)
{
    $request->validate([
        'doctor_id' => 'required|exists:users,id',
        'checkup_date' => 'required|date',
        'problem' => 'required|string',       
        'history' => 'nullable|string',       
        'symptoms' => 'nullable|string', 
        'notes' => 'nullable|string',     
        'medication' => 'nullable|string',
        'fee' => 'required|numeric|min:0',    
    ]);

    Appointment::create([
        'patient_id' => $patient->id,
        'doctor_id' => $request->doctor_id,  
        'checkup_date' => $request->checkup_date,
        'problem' => $request->problem,      
        'history' => $request->history,      
        'symptoms' => $request->symptoms,    
        'medication' => $request->medication,
        'notes'=> $request->notes,
        'fee' => $request->fee,
    ]);

    // Redirect to PatientManagement, flash only the success message
    return redirect()->route('nurse.patients.index')
                     ->with('success', 'Appointment scheduled successfully!');
}




    // View appointments for a patient
    public function viewAppointments(Request $request, Patient $patient)
    {
        $user = $request->user();
            
        // Get the position of the user and convert it to lowercase
        $role = strtolower($user->position);

        // Eager load appointments with doctor, services, and medications
        $appointments = $patient->appointments()
            ->with(['doctor', 'services', 'medications'])  // Load doctor, services, and medications
            ->get();

        // Loop through the appointments to add patient and doctor details
        $appointments = $appointments->map(function ($appointment) {
            // Get the full name of the patient
            $appointment->patient_full_name = $appointment->patient->first_name . ' ' . $appointment->patient->last_name;

            // Get the first name and last name of the doctor
            $appointment->doctor_first_name = $appointment->doctor->first_name;
            $appointment->doctor_last_name = $appointment->doctor->last_name;

            return $appointment;
        });


        // Return the appointments data to the view
        return Inertia::render('Nurse/ViewSpecificPatientAppointments', [
            'role' => $role,
            'patient' => $patient,
            'appointments' => $appointments,
        ]);
    }

    



    public function viewAllAppointments(Request $request)
    {
        $user = $request->user();
        
        // Get the position of the user and convert it to lowercase
        $role = strtolower($user->position); // this is the `role` you're passing
        

        // Fetch all appointments along with related patient and doctor data
        $appointments = Appointment::with('patient')
        ->join('users', 'appointments.doctor_id', '=', 'users.id') // Join with the users table for doctor's data
        ->select('appointments.*', 'users.first_name as doctor_first_name', 'users.last_name as doctor_last_name') // Select doctor's name along with appointment data
        ->orderBy('checkup_date', 'desc') // Order by checkup date in descending order
        ->get();
        

        return Inertia::render('Nurse/ViewAllAppointments', [
            'appointments' => $appointments,
            'role' => $role,
        ]);
    }

    // Delete appointment
    public function destroyAppointment(Appointment $appointment)
    {
        $appointment->delete();
        return redirect()->back()->with('success', 'Appointment deleted successfully.');
    }
}
