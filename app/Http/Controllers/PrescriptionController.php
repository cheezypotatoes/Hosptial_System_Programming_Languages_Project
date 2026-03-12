<?php

namespace App\Http\Controllers;

use App\Models\Prescription;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use PDF; 
class PrescriptionController extends Controller
{
   
    public function index()
    {
        $prescriptions = Prescription::with('patient')->get();
        return view('prescriptions.index', compact('prescriptions'));
    }

   
    public function show($id)
    {
        $prescription = Prescription::with('patient')->findOrFail($id);
        return view('prescriptions.show', compact('prescription'));
    }

 
    public function print($id)
    {
        $prescription = Prescription::with('patient')->findOrFail($id);
        
        return view('prescriptions.print', compact('prescription'));
        
       
    }

 
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


    public function destroy($id)
    {
        $prescription = Prescription::findOrFail($id);
        $prescription->delete();

        return redirect()->back()->with('success', 'Prescription deleted successfully.');
    }
}
