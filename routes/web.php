<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\PhysicianController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\PatientController;
use App\Http\Middleware\EnsureUserIsNurse;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\CashierController;
use App\Http\Controllers\Api\ItemController;
use App\Http\Controllers\Api\ServiceController;
use App\Http\Controllers\Api\PatientsController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\DispensingController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;



            //Api
            Route::get('/services', [ServiceController::class, 'index']);
            Route::get('/patients', [PatientController::class, 'index']);
            Route::get('/pending-payments', [PaymentController::class, 'pending']);
            Route::get('/transactions', [TransactionController::class, 'recent']);
            Route::get('/items', [ItemController::class, 'index']);

            //Medicine Routes
            Route::get('/medicines', function () {
                return Inertia::render('Medicine/MedicineInventory');
            })->name('medicine.inventory');

            
            Route::middleware(['auth'])->group(function () {
                Route::get('/medicine/inventory', [MedicineController::class, 'index'])->name('medicine.inventory');
                Route::post('/medicine/store', [MedicineController::class, 'store'])->name('medicine.store');

                // Dispensing
                Route::post('/dispensing/store', [DispensingController::class, 'store'])->name('dispensing.store');
                Route::get('/dispensing/logs', [DispensingController::class, 'logs'])->name('dispensing.logs');
            });


                Route::get('/dispensing', function () { return Inertia::render('Dispensing/Dispensing'); })->name('dispensing');

            // API routes for data/actions
            Route::prefix('medicines')->group(function () {
                Route::get('/list', [MedicineController::class, 'index']);        
                Route::post('/', [MedicineController::class, 'store']);      
                Route::post('/dispense', [MedicineController::class, 'dispense']); 
            });

            // Public routes
            Route::get('/', fn() => Inertia::render('Index'));
            Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
            Route::post('/login', [LoginController::class, 'store'])->name('login.store');

            Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
            Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

            // Authenticated routes
            Route::middleware('auth')->group(function () {



    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');

    // Physician edit routes
    Route::get('/physician/edit', [PhysicianController::class, 'edit'])->name('physician.edit');
    // Physician Records routes
    Route::get('/physician/records', [PhysicianController::class, 'records'])
        ->name('physician.records');

    Route::post('/physician/update', [PhysicianController::class, 'update'])
        ->name('physician.update');

    // Nurse edit routes
    Route::get('/nurse/edit', [NurseController::class, 'edit'])->name('nurse.edit');
    Route::post('/nurse/edit', [NurseController::class, 'update'])->name('nurse.update');
    
    // Nurse patient management routes with middleware applied to the whole group
    Route::prefix('nurse')
        ->middleware(EnsureUserIsNurse::class)
        ->group(function () {
            Route::get('/patients', [PatientController::class, 'index'])->name('nurse.patients.index');
            Route::get('/patients/create', [PatientController::class, 'create'])->name('nurse.patients.create');
            Route::post('/patients', [PatientController::class, 'store'])->name('nurse.patients.store');
            Route::get('/patients/{patient}/edit', [PatientController::class, 'edit'])->name('nurse.patients.edit');
            Route::put('/patients/{patient}', [PatientController::class, 'update'])->name('nurse.patients.update');
            Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])->name('nurse.patients.destroy');
            
            Route::get('/patients/{patient}/appointments', [AppointmentController::class, 'viewAppointments'])
                ->name('nurse.patients.viewAppointments');
            Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroyAppointment'])
                ->name('nurse.appointments.destroy');
            Route::get('/patients/{patient}/make-appointment', [AppointmentController::class, 'create'])
                ->name('nurse.patients.makeAppointment');
            Route::post('/patients/{patient}/make-appointment', [AppointmentController::class, 'store'])
                ->name('nurse.patients.storeAppointment');
                    
            Route::get('/nurse/assistant', [AssistantController::class, 'dashboard'])
                ->name('nurse.assistant.dashboard');


            // Cashier routes
            Route::get('/cashier', [CashierController::class, 'index'])->name('cashier.dashboard');
            Route::get('/cashier/services-items', [CashierController::class, 'getServicesAndItems']);
            Route::get('/cashier/patients', [CashierController::class, 'searchPatients']);
            Route::post('/cashier/generate-bill', [CashierController::class, 'generateBill']);
            Route::post('/cashier/record-payment', [CashierController::class, 'recordPayment']);
            Route::get('/cashier/transactions', [CashierController::class, 'transactions']);

        });
});

require __DIR__.'/auth.php';
