<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Patient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PatientsController extends Controller
{
    public function index(): JsonResponse
    {
        $patients = Patient::select('id', 'first_name', 'last_name', 'birthdate', 'gender', 'contact_num', 'address')
            ->get();

        return response()->json($patients);
    }
}
