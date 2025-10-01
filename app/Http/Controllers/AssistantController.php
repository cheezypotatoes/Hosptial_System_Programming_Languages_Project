<?php

namespace App\Http\Controllers;

use Inertia\Inertia;

class AssistantController extends Controller
{
    public function dashboard()
    {
        $appointments = [
            [
                'id' => '2032031',
                'name' => 'Jorge Macabenta',
                'time' => '10:40 AM',
                'reason' => 'Banana tree incident',
                'medicalHistory' => ['Childhood asthma (Ongoing)', 'Sakit sa kilog (Ongoing)'],
                'currentConditions' => ['Mild hypertension'],
                'medications' => ['Loperamide 10mg (daily)'],
                'contact' => '09234657891',
                'age' => 69,
                'gender' => 'Male',
                'physician' => 'Doc. Mikey',
                'date' => '2030-09-15',
            ],
            [
                'id' => '2032032',
                'name' => 'Bren Ciano',
                'time' => '1:40 PM',
                'reason' => 'Banana tree mishap',
            ],
            [
                'id' => '2032033',
                'name' => 'Rexcel Lusica',
                'time' => '2:40 PM',
                'reason' => 'Boulevard incident',
            ],
        ];

        // 👇 match your React file path
        return Inertia::render('Nurse/NurseAssistant', [
            'appointments' => $appointments
        ]);
    }
}
