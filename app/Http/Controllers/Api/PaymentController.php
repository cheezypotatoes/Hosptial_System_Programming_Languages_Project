<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    public function pending()
    {
        $payments = Payment::where('status', 'pending')->get();
        return response()->json($payments);
    }
}
