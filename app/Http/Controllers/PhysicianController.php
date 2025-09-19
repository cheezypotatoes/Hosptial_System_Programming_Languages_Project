<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PhysicianController extends Controller
{
    // Show edit form
    public function edit()
    {
        $user = Auth::user();


        // Only allow doctors
        if ($user->position !== 'Doctor') {
            return redirect()->route('dashboard');
        }

        return Inertia::render('Physician/PhysicianEdit', [
            'user' => $user,
        ]);
    }

    // Handle form submission
    public function update(Request $request)
{
    $user = Auth::user();

    if ($user->position !== 'Doctor') {
        abort(403, 'Unauthorized');
    }

    // Validate input
    $data = $request->validate([
        'first_name'      => 'required|string|max:255',
        'last_name'       => 'required|string|max:255',
        'specialization'  => 'required|string|max:255',
        'contract_number' => 'required|string|max:255',
        'room_number'     => 'required|string|max:255',
    ]);

    // Update user
    $user->update([
        'first_name' => $data['first_name'],
        'last_name'  => $data['last_name'],
    ]);

    // Update or create physician record
    $user->physician()->updateOrCreate(
        ['user_id' => $user->id],
        [
            'specialization'  => $data['specialization'],
            'contract_number' => $data['contract_number'],
            'room_number'     => $data['room_number'],
        ]
    );

    return redirect()->route('dashboard')->with('success', 'Profile updated successfully.');
}
}
