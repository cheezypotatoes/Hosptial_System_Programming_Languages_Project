<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Service;
use App\Models\Medicine;
use App\Models\Item;   // ✅ Added Item model

class CashierController extends Controller
{
    // Dashboard view
    public function index()
{
    // Fetching pending payments, recent transactions, and all patients
    $pendingPayments = Payment::where('status', 'processing')->latest()->take(5)->get();
    $recentTransactions = Transaction::latest()->take(5)->get();
    $allPatients = Patient::all(); // Fetching all patients

    return Inertia::render('Cashier/CashierDashboard', [
        'pendingPayments'   => $pendingPayments,
        'recentTransactions'=> $recentTransactions,
        'patients'          => $allPatients, // Passing all patients to the view
    ]);
}

    // 🔹 Fetch services + medicines + items
    public function getServicesAndItems()
    {
        // Fetch services
        $services = Service::select('id', 'name', 'price')
            ->get()
            ->map(function ($s) {
                return [
                    'id'    => $s->id,
                    'name'  => $s->name,
                    'price' => $s->price,
                    'type'  => 'service', // mark as service
                ];
            });

        // Fetch medicines
        $medicines = Medicine::select('id', 'name', 'price', 'stock')
            ->get()
            ->map(function ($m) {
                return [
                    'id'    => $m->id,
                    'name'  => $m->name,
                    'price' => $m->price,
                    'stock' => $m->stock,
                    'type'  => 'medicine', // mark as medicine
                ];
            });

        // Fetch items
        $items = Item::select('id', 'name', 'price', 'stock')
            ->get()
            ->map(function ($i) {
                return [
                    'id'    => $i->id,
                    'name'  => $i->name,
                    'price' => $i->price,
                    'stock' => $i->stock,
                    'type'  => 'item', // mark as item
                ];
            });

        // Merge all collections
        $merged = $services->merge($medicines)->merge($items);

        return response()->json($merged);
    }

    // 🔹 Search patients (AJAX)
    public function searchPatients(Request $request)
    {
        $query = $request->get('q', '');

        $patients = Patient::where('first_name', 'like', "%$query%")
            ->orWhere('last_name', 'like', "%$query%")
            ->orWhere('id', 'like', "%$query%")
            ->get();

        return response()->json($patients);
    }

    // 🔹 Generate bill
    public function generateBill(Request $request)
    {
        $bill = Payment::create([
            'patient_id' => $request->patient_id,
            'amount'     => $request->amount,
            'status'     => 'processing',
        ]);

        return response()->json(['success' => true, 'bill' => $bill]);
    }

    // 🔹 Record payment
    public function recordPayment(Request $request)
    {
        $payment = Payment::findOrFail($request->payment_id);
        $payment->update([
            'status'         => 'paid',
            'payment_method' => $request->payment_method,
            'amount_received'=> $request->amount_received,
        ]);

        Transaction::create([
            'patient_id' => $payment->patient_id,
            'amount'     => $payment->amount,
            'status'     => 'paid',
        ]);

        return response()->json(['success' => true]);
    }

    // 🔹 Recent transactions
    public function transactions()
    {
        $transactions = Transaction::latest()->take(10)->get();
        return response()->json($transactions);
    }
}
