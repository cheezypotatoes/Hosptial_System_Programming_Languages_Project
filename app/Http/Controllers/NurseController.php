<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Nurse;

class NurseController extends Controller
{
 
    public function edit()
    {
        $user = Auth::user();

  
        if ($user->position !== 'Nurse') {
            return redirect()->route('dashboard');
        }
        
        $nurse = Nurse::where('user_id', $user->id)->first();

        return Inertia::render('Nurse/NurseEdit', [
            'user'  => $user,
            'nurse' => $nurse,
        ]);
    }

    public function update(Request $request)
    {


        $user = Auth::user();

        if ($user->position !== 'Nurse') {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'first_name'  => 'required|string|max:255',
            'last_name'   => 'required|string|max:255',
            'assigned_to' => 'required|string|max:255',
            'start_time'  => 'nullable|date_format:H:i',
            'end_time'    => 'nullable|date_format:H:i',
        ]);

       /** @var \App\Models\User $user */
        $user = Auth::user();
        $user->update([
            'first_name' => $data['first_name'],
            'last_name' => $data['last_name'],
        ]);

        
        Nurse::updateOrCreate(
            ['user_id' => $user->id],
            [
                'assigned_to' => $data['assigned_to'],
                'start_time'  => $data['start_time'] ?? null,
                'end_time'    => $data['end_time'] ?? null,
            ]
        );

        return redirect()->route('dashboard')->with('success', 'Profile updated successfully.');
    } 
}
