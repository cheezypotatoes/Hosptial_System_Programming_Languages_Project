<?php

namespace App\Http\Controllers;

use App\Models\MedicalCondition;
use Illuminate\Http\Request;

class MedicalConditionController extends Controller
{

    public function index($patientId)
    {
        $conditions = MedicalCondition::where('patient_id', $patientId)->get();

        return response()->json($conditions);
    }

 
    public function show($id)
    {
        $condition = MedicalCondition::findOrFail($id);

        return response()->json($condition);
    }

  
    public function store(Request $request, $patientId)
    {
        $validated = $request->validate([
            'condition_name' => 'required|string|max:255',
            'notes' => 'nullable|string',
            'diagnosed_date' => 'nullable|date',
            'status' => 'nullable|string|max:50',
        ]);

        $validated['patient_id'] = $patientId;

        $condition = MedicalCondition::create($validated);

        return response()->json($condition, 201);
    }
}
