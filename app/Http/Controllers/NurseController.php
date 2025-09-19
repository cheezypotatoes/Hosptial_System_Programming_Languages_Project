<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Nurse;

class NurseController extends Controller
{
    // Show edit form
    public function edit()
    {
        $user = Auth::user();

        // Only allow nurses
        if ($user->position !== 'Nurse') {
            return redirect()->route('dashboard');
        }

        // Fetch nurse record
        $nurse = Nurse::where('user_id', $user->id)->first();

        return Inertia::render('Nurse/NurseEdit', [
            'user'  => $user,
            'nurse' => $nurse,
        ]);
    }

    // Handle form submission
    public function update(Request $request)
    {
        $user = Auth::user();

        if ($user->position !== 'Nurse') {
            abort(403, 'Unauthorized');
        }

        // Validate input
        $data = $request->validate([
            'first_name'   => 'required|string|max:255',
            'last_name'    => 'required|string|max:255',
            'assigned_to'  => 'required|string|max:255',
        ]);

        // Update user info
        $user->update([
            'first_name' => $data['first_name'],
            'last_name'  => $data['last_name'],
        ]);

        // Update or create nurse record
        Nurse::updateOrCreate(
            ['user_id' => $user->id],
            ['assigned_to' => $data['assigned_to']]
        );

        return redirect()->route('dashboard')->with('success', 'Profile updated successfully.');
    }
}
