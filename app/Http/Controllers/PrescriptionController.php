<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PDF; // If you plan to use dompdf or barryvdh/laravel-dompdf for PDF generation

class PrescriptionController extends Controller
{
    /**
     * Display a listing of all prescriptions.
     */
    public function index()
    {
        $prescriptions = Prescription::with('patient')->get();
        return view('prescriptions.index', compact('prescriptions'));
    }

    /**
     * Display a single prescription.
     */
    public function show($id)
    {
        $prescription = Prescription::with('patient')->findOrFail($id);
        return view('prescriptions.show', compact('prescription'));
    }

    /**
     * Show the print view of a prescription.
     */
    public function print($id)
    {
        $prescription = Prescription::with('patient')->findOrFail($id);
        
        // Blade view for printing
        return view('prescriptions.print', compact('prescription'));
        
        // If you want PDF instead:
        // $pdf = PDF::loadView('prescriptions.print', compact('prescription'));
        // return $pdf->stream('prescription_'.$id.'.pdf');
    }

    /**
     * Store a new prescription.
     */
    public function store(Request $request)
    {
        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'doctor_name' => 'required|string',
            'medication' => 'required|string',
            'dosage' => 'nullable|string',
            'instructions' => 'nullable|string',
            'prescribed_date' => 'required|date',
        ]);

        $prescription = Prescription::create($request->all());

        return redirect()->back()->with('success', 'Prescription added successfully.');
    }

    /**
     * Update an existing prescription.
     */
    public function update(Request $request, $id)
    {
        $prescription = Prescription::findOrFail($id);

        $request->validate([
            'doctor_name' => 'required|string',
            'medication' => 'required|string',
            'dosage' => 'nullable|string',
            'instructions' => 'nullable|string',
            'prescribed_date' => 'required|date',
        ]);

        $prescription->update($request->all());

        return redirect()->back()->with('success', 'Prescription updated successfully.');
    }

    /**
     * Delete a prescription.
     */
    public function destroy($id)
    {
        $prescription = Prescription::findOrFail($id);
        $prescription->delete();

        return redirect()->back()->with('success', 'Prescription deleted successfully.');
    }
}
