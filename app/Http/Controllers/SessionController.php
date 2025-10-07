<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Session;

class SessionController extends Controller
{
    // Show session data
    public function index()
    {
        return response()->json([
            'session_data' => Session::all()
        ]);
    }

    // Store data into session
    public function store(Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'required'
        ]);

        Session::put($request->key, $request->value);

        return response()->json([
            'message' => 'Session data stored successfully!',
            'data' => [$request->key => $request->value]
        ]);
    }

    // Remove data from session
    public function destroy($key)
    {
        Session::forget($key);

        return response()->json([
            'message' => "Session data with key '{$key}' removed."
        ]);
    }
}
