<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Dispense;
use App\Models\Medicine;
use App\Models\Category;
use App\Models\Prescription;
use App\Models\Patient;

class DispensingController extends Controller
{
    /**
     * 🔹 Show all patients for the listing page
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if (!$user) return redirect()->route('login');

        $role = strtolower($user->position);

        $patients = Patient::select(
            'id', 'first_name', 'last_name', 'birthdate', 'gender', 'contact_num', 'address'
        )
        ->orderBy('last_name')
        ->get();

        return Inertia::render('Dispensing/Dispensing', [
            'user' => $user,
            'role' => $role,
            'patients' => $patients,
        ]);
    }

    /**
     * 🔹 Show full details of one patient (PatientDetails page)
     */
    public function show($id)
    {
        $patient = Patient::with(['prescriptions', 'medicalConditions'])->findOrFail($id);

        // Ensure prescriptions is always a collection
        $prescriptions = $patient->prescriptions ?? collect();

        // Fetch dispense logs for this patient
        $dispenseLogs = Dispense::where('patient_id', $patient->id)
            ->with('medicine')
            ->orderByDesc('dispensed_at')
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'medicine_name' => $log->medicine->name ?? 'Unknown',
                    'quantity' => $log->quantity,
                    'dispensed_at' => $log->dispensed_at,
                ];
            });

        return Inertia::render('Dispensing/PatientDetails', [
            'patient' => $patient,
            'prescriptions' => $prescriptions,
            'dispense_logs' => $dispenseLogs,
        ]);
    }

    /**
     * 🔹 Store a new dispense record
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'prescription_id' => 'required|exists:prescriptions,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $prescription = Prescription::findOrFail($request->prescription_id);
        $medicine = Medicine::findOrFail($prescription->medicine_id);

        if ($medicine->stock < $request->quantity) {
            return back()->with('error', 'Not enough stock available.');
        }

        // Deduct stock
        $medicine->decrement('stock', $request->quantity);

        // Record dispense
        Dispense::create([
            'patient_id' => $request->patient_id,
            'medicine_id' => $medicine->id,
            'quantity' => $request->quantity,
            'dispensed_at' => now(),
        ]);

        return back()->with('success', 'Medicine dispensed successfully!');
    }

    /**
     * 🔹 Fetch all prescriptions
     */
    public function prescriptions()
    {
        $prescriptions = Prescription::with('patient', 'medicine')->get()->map(function ($pres) {
            return [
                'id' => $pres->id,
                'patient_name' => $pres->patient->first_name . ' ' . $pres->patient->last_name,
                'medicine_name' => $pres->medicine->name ?? $pres->medication,
                'dosage' => $pres->dosage,
                'instructions' => $pres->instructions,
                'doctor_name' => $pres->doctor_name,
                'prescribed_date' => optional($pres->prescribed_date)->format('Y-m-d'),
            ];
        });

        return Inertia::render('Dispensing/Prescriptions', [
            'prescriptions' => $prescriptions,
        ]);
    }

    /**
     * 🔹 Fetch categories with services/items (optional)
     */
    public function categories()
    {
        $categories = Category::with(['services', 'items'])->get();

        return Inertia::render('Dispensing/Categories', [
            'categories' => $categories,
        ]);
    }

    /**
     * 🔹 Latest 10 dispense logs globally
     */
    public function logs()
    {
        $logs = Dispense::with(['medicine', 'patient'])
            ->orderByDesc('dispensed_at')
            ->take(10)
            ->get()
            ->map(function ($log) {
                return [
                    'id' => $log->id,
                    'patient_name' => $log->patient->first_name . ' ' . $log->patient->last_name,
                    'medicine_name' => $log->medicine->name ?? 'Unknown',
                    'quantity' => $log->quantity,
                    'dispensed_at' => $log->dispensed_at,
                ];
            });

        return Inertia::render('Dispensing/Logs', [
            'logs' => $logs,
        ]);
    }
}
