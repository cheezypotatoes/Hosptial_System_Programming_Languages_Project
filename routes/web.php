<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

// Controllers
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PhysicianController;
use App\Http\Controllers\PhysicianAppointmentController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\Api\PatientsController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\Api\PrescriptionController;
use App\Http\Controllers\MedicalConditionController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\SessionController;
use App\Http\Controllers\DispensingController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\PharmacistController;
// Middleware
use App\Http\Middleware\EnsureUserIsNurse;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', fn() => Inertia::render('Index'));
Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.store');

Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

/*
|--------------------------------------------------------------------------
| Pharmacist Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {
    Route::get('/pharmacist', [PharmacistController::class, 'index'])->name('pharmacist.index');
    Route::get('/pharmacist/prescriptions', [PharmacistController::class, 'prescriptions']);
    
    // Patient-specific prescriptions
    Route::get('/patients/{patient}/prescriptions', [PharmacistController::class, 'patientPrescriptions']);
    Route::post('/pharmacist/dispense/{id}', [PharmacistController::class, 'dispense']);
});
/*
|--------------------------------------------------------------------------
| Session Routes
|--------------------------------------------------------------------------
*/
Route::get('/sessions', [SessionController::class, 'index'])->name('sessions.index');
Route::post('/sessions', [SessionController::class, 'store'])->name('sessions.store');
Route::delete('/sessions/{key}', [SessionController::class, 'destroy'])->name('sessions.destroy');

/*
|--------------------------------------------------------------------------
| API Routes (Accessible by Frontend)
|--------------------------------------------------------------------------
*/
Route::get('/services/list', [ServiceController::class, 'index']);
Route::post('/services/store', [ServiceController::class, 'store']);
Route::get('/pending-payments', [PaymentController::class, 'pending']);
Route::get('/transactions', [TransactionController::class, 'recent']);
Route::get('/items', [ItemController::class, 'index']);

/*
|--------------------------------------------------------------------------
| Medicine Routes
|--------------------------------------------------------------------------
*/
Route::prefix('medicines')->group(function () {
    Route::get('/list', [MedicineController::class, 'index']);
    Route::post('/', [MedicineController::class, 'store']);
    Route::post('/dispense', [MedicineController::class, 'dispense']);
});

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware('auth')->group(function () {

    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Dispensing
    Route::get('/dispensing', [DispensingController::class, 'index'])->name('dispensing');
    Route::get('/categories', [DispensingController::class, 'categories'])->name('categories');
    Route::post('/dispense/store', [DispensingController::class, 'store'])->name('dispense.store');
    Route::get('/dispense/logs', [DispensingController::class, 'logs'])->name('dispense.logs');

    // Medicine Inventory
    Route::get('/medicine/inventory', fn() => Inertia::render('Medicine/MedicineInventory'))->name('medicine.inventory');
    Route::get('/medicine/data', [MedicineController::class, 'index'])->name('medicine.data');
    Route::post('/medicine/store', [MedicineController::class, 'store'])->name('medicine.store');

    // Physician Routes
    Route::prefix('physician')->group(function () {
        Route::get('/edit', [PhysicianController::class, 'edit'])->name('physician.edit');
        Route::post('/update', [PhysicianController::class, 'update'])->name('physician.update');
        Route::get('/records', [PhysicianController::class, 'records'])->name('physician.records');
        Route::get('/records/search', [PhysicianController::class, 'records'])->name('physician.records.search');
        Route::get('/appointments', [PhysicianAppointmentController::class, 'index'])->name('physician.appointments.index');
        Route::get('/appointments/{patientId}/{appointmentId}', [PhysicianAppointmentController::class, 'show'])->name('physician.appointments.show');
        Route::post('/appointments/{appointmentId?}', [PhysicianAppointmentController::class, 'store'])->name('physician.appointments.store');
    });

    // Nurse Routes
    Route::prefix('nurse')->middleware(EnsureUserIsNurse::class)->group(function () {

        // Patient Management
        Route::get('/patients', [PatientController::class, 'index'])->name('nurse.patients.index');
        Route::get('/patients/create', [PatientController::class, 'create'])->name('nurse.patients.create');
        Route::post('/patients', [PatientController::class, 'store'])->name('nurse.patients.store');
        Route::get('/patients/{patient}/edit', [PatientController::class, 'edit'])->name('nurse.patients.edit');
        Route::put('/patients/{patient}', [PatientController::class, 'update'])->name('nurse.patients.update');
        Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])->name('nurse.patients.destroy');

        // Appointment Management
        Route::get('/appointments', [AppointmentController::class, 'viewAllAppointments'])->name('nurse.appointments.viewAll');
        Route::get('/patients/{patient}/appointments', [AppointmentController::class, 'viewAppointments'])->name('nurse.patients.viewAppointments');
        Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroyAppointment'])->name('nurse.appointments.destroy');
        Route::get('/patients/{patient}/make-appointment', [AppointmentController::class, 'create'])->name('nurse.patients.makeAppointment');
        Route::post('/patients/{patient}/make-appointment', [AppointmentController::class, 'store'])->name('nurse.patients.storeAppointment');

        // Assistant
        Route::get('/assistant', [AssistantController::class, 'dashboard'])->name('nurse.assistant.dashboard');

        /*
        |--------------------------------------------------------------------------
        | Cashier Routes (Inside Nurse)
        |--------------------------------------------------------------------------
        */
        Route::prefix('cashier')->group(function () {
            Route::get('/dashboard', [CashierController::class, 'index'])->name('cashier.dashboard');
            Route::get('/categories', [CashierController::class, 'getCategories']);
            Route::get('/services-items', [CashierController::class, 'getServicesAndItems']);
            Route::get('/patients', [CashierController::class, 'searchPatients']);
            Route::post('/generate-bill', [CashierController::class, 'generateBill']);
            Route::post('/record-payment', [CashierController::class, 'recordPayment'])->name('cashier.recordPayment');
            Route::get('/transactions', [CashierController::class, 'transactions']);
        });
    });

    // Patient API Routes
    Route::get('/patients', [PatientsController::class, 'index']);
    Route::get('/patients/{id}', [PatientsController::class, 'show']);
    Route::get('/patients/{id}/prescriptions', [PrescriptionController::class, 'getByPatient']);
    Route::get('/prescriptions/{id}/print', [PrescriptionController::class, 'print'])->name('prescriptions.print');

    // Medical Conditions
    Route::get('/patients/{id}/medical-conditions', [MedicalConditionController::class, 'index']);
    Route::post('/patients/{id}/medical-conditions', [MedicalConditionController::class, 'store']);
    Route::get('/medical-conditions/{id}', [MedicalConditionController::class, 'show']);
});

require __DIR__.'/auth.php';
