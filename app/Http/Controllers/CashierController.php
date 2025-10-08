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
use App\Models\Appointment; 


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
                'appointments' => $patient->appointments->map(function ($appointment) {
                    return [
                        'id' => $appointment->id,
                        'checkup_date' => $appointment->checkup_date?->format('Y-m-d H:i'),
                        'fee' => $appointment->fee ?? 350, // default fee if null
                        'balance' => $appointment->fee ?? 350, // placeholder, can compute from payments table
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
                'price' => $m->price ?? 350, // default to 350 if null
                'type' => 'medicine',
            ];
        })->toArray();

        // Fetch all items from DB
        $items = Item::all()->map(function ($i) {
            return [
                'id' => $i->id,
                'name' => $i->name,
                'price' => $i->price ?? 0, // use item's price
                'stock_quantity' => $i->stock_quantity,
                'type' => 'item',
            ];
        })->toArray();

        // Combine services + medicines + items
        $servicesAndItems = array_merge($services, $medicines, $items);

        return Inertia::render('Cashier/CashierDashboard', [
            'user' => $user,
            'role' => $role,
            'patients' => $patients,
            'servicesAndItems' => $servicesAndItems,
        ]);
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
    // Validate incoming data
    $validated = $request->validate([
        'appointment_id' => 'required|integer|exists:appointments,id',
        'patient_id' => 'required|integer|exists:patients,id',
        'amount_received' => 'required|numeric|min:0',
        'payment_method' => 'required|string',
    ]);

    // Find the appointment
    $appointment = \App\Models\Appointment::findOrFail($validated['appointment_id']);

    $currentFee = $appointment->fee ?? 0;
    $amountPaid = $validated['amount_received'];

    // Validate amount paid
    if ($amountPaid <= 0) {
        return redirect()->back()->withErrors(['amount_received' => 'Amount received must be greater than 0']);
    }

    // Deduct the payment from the fee
    $newFee = $currentFee - $amountPaid;
    $change = $newFee < 0 ? abs($newFee) : 0;
    $appointment->fee = max(0, $newFee);
    $appointment->save();

    // Return with payment data
    return redirect()->back()->with([
        'success' => 'Payment recorded successfully!',
        'payment_data' => [
            'appointment_id' => $appointment->id,
            'patient_id' => $validated['patient_id'],
            'amount_received' => $amountPaid,
            'new_fee' => $appointment->fee,
            'change' => $change,
        ]
    ]);
}

    // 🔹 Recent transactions
    public function transactions()
    {
        return response()->json(Transaction::latest()->take(10)->get());
    }
}
