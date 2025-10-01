<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    public function recent()
    {
        $transactions = Transaction::latest()->take(10)->get();
        return response()->json($transactions);
    }
}
