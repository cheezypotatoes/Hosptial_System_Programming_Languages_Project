<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Patient;
use App\Models\Payment;
use App\Models\Transaction;
use App\Models\Service;
use App\Models\Medicine;
use App\Models\Item;
use App\Models\Category; 


class CashierController extends Controller
{
    // 🔹 Dashboard view
    public function index(Request $request)
    {
        $user = $request->user();
        
    
        $role = strtolower($user->position); 
        
        $pendingPayments = Payment::where('status', 'processing')->latest()->take(5)->get();
        $recentTransactions = Transaction::latest()->take(5)->get();
        $allPatients = Patient::all();

        return Inertia::render('Cashier/CashierDashboard', [
             'user' => $user,
            'role' => $role , 
            'pendingPayments'   => $pendingPayments,
            'recentTransactions'=> $recentTransactions,
            'patients'          => $allPatients,
        ]);
    }

    // 🔹 Fetch categories (with services + items)
    public function getCategories()
    {
        $categories = Category::with(['services', 'items'])->get();
        return response()->json($categories);
    }

    // 🔹 Fetch services + medicines + items (flat list)
    public function getServicesAndItems()
    {
        $services = Service::select('id', 'name', 'price')
            ->get()
            ->map(fn($s) => [
                'id'    => $s->id,
                'name'  => $s->name,
                'price' => $s->price,
                'type'  => 'service',
            ]);

        $medicines = Medicine::select('id', 'name', 'price', 'stock')
            ->get()
            ->map(fn($m) => [
                'id'    => $m->id,
                'name'  => $m->name,
                'price' => $m->price,
                'stock' => $m->stock,
                'type'  => 'medicine',
            ]);

        $items = Item::select('id', 'name', 'price', 'stock')
            ->get()
            ->map(fn($i) => [
                'id'    => $i->id,
                'name'  => $i->name,
                'price' => $i->price,
                'stock' => $i->stock,
                'type'  => 'item',
            ]);

        return response()->json($services->merge($medicines)->merge($items));
    }

    // 🔹 Search patients
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
        return response()->json(Transaction::latest()->take(10)->get());
    }
}
