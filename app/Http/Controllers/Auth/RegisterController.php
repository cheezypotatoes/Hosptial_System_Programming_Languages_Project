<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Physician;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'position' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'specialization' => 'nullable|string|max:255', // Specialization for doctors (optional)
        ]);

        // Create the user
        $user = User::create([
            'first_name' => $validated['first_name'],
            'last_name' => $validated['last_name'],
            'position' => $validated['position'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // If the user is a doctor, create a physician record with specialization
        if ($validated['position'] === 'Doctor' && !empty($validated['specialization'])) {
            Physician::create([
                'user_id' => $user->id,
                'specialization' => $validated['specialization'],  // Add specialization to physicians table
            ]);
        }

        // Optionally log the user in after registration
        // auth()->login($user);

        return redirect()->route('login')->with('success', 'Account created successfully.');
    }
}
