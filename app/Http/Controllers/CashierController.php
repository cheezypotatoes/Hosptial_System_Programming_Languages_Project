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



class CashierController extends Controller
{
    // 🔹 Dashboard view
    public function index(Request $request)
    {
        $user = $request->user();
        $role = strtolower($user->position);

        // Fetch all patients with their appointments
        $patients = Patient::with('appointments')->get()->map(function ($patient) {
            return [
                'id' => $patient->id,
                'first_name' => $patient->first_name,
                'last_name' => $patient->last_name,
                'full_name' => $patient->full_name,
                'appointments' => $patient->appointments->map(function ($appointment) use ($patient) {

                    // Calculate previous balance
                   $paymentsSum = Payment::where('patient_id', $patient->id)
                      ->sum('amount');

                $remainingBalance = max(($appointment->fee ?? 350) - $paymentsSum, 0);

                    return [
                        'id' => $appointment->id,
                        'checkup_date' => $appointment->checkup_date?->format('Y-m-d H:i'),
                        'fee' => $appointment->fee ?? 350,
                        'balance' => $remainingBalance,
                        'problem' => $appointment->problem,
                        'symptoms' => $appointment->symptoms,
                        'notes' => $appointment->notes,
                    ];
                })->toArray(),
            ];
        })->toArray();

        // Fetch all services from DB
        $services = Service::all()->map(function ($s) {
            return [
                'id' => $s->id,
                'name' => $s->name,
                'price' => $s->price ?? 350, // default to 350 if null
                'type' => 'service',
            ];
        })->toArray();

        // Fetch all medicines from DB
        $medicines = Medicine::all()->map(function ($m) {
            return [
                'id' => $m->id,
                'name' => $m->name,
                'price' => $m->price ?? 350,
                'type' => 'medicine',
            ];
        })->toArray();

        $items = Item::all()->map(function ($i) {
            return [
                'id' => $i->id,
                'name' => $i->name,
                'price' => $i->price ?? 0,
                'stock_quantity' => $i->stock_quantity,
                'type' => 'item',
            ];
        })->toArray();


        $servicesAndItems = array_merge($services, $medicines, $items);

        return Inertia::render('Cashier/CashierDashboard', [
            'user' => $user,
            'role' => $role,
            'patients' => $patients,
            'servicesAndItems' => $servicesAndItems,
        ]);
    }


    public function searchPatients(Request $request)
    {
        $query = $request->get('q', '');

        $patients = Patient::where('first_name', 'like', "%$query%")
            ->orWhere('last_name', 'like', "%$query%")
            ->orWhere('id', 'like', "%$query%")
            ->get();

        return response()->json($patients);
    }


    public function generateBill(Request $request)
    {
        $bill = Payment::create([
            'patient_id' => $request->patient_id,
            'amount'     => $request->amount,
            'status'     => 'processing',
        ]);

        return response()->json(['success' => true, 'bill' => $bill]);
    }

    public function recordPayment(Request $request)
    {

        $request->validate([
            'patient_id' => 'required|exists:patients,id',
            'total' => 'required|numeric',
            'amount_received' => 'required|numeric',
            'payment_method' => 'required|string',
            'items' => 'required|array',
        ]);


        $payment = Payment::create([
            'patient_id' => $request->patient_id,
            'amount' => $request->total,
            'amount_received' => $request->amount_received,
            'payment_method' => $request->payment_method,
            'status' => 'paid',
        ]);

        foreach ($request->items as $item) {
            $payment->paymentItems()->create([
                'item_type' => $item['type'],
                'item_id' => $item['id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
            ]);
        }


        Transaction::create([
            'patient_id' => $payment->patient_id,
            'amount' => $payment->amount,
            'status' => 'paid',
        ]);


        return response()->json(['success' => true, 'payment_id' => $payment->id]);
    }
}
