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
use App\Http\Controllers\PhysicianAppointmentController;
use App\Http\Controllers\AssistantController;
use App\Http\Controllers\Api\PaymentController;
use App\Http\Controllers\Api\TransactionController;
use App\Http\Controllers\Api\MedicineController;
use App\Http\Controllers\DispensingController;
use App\Http\Controllers\Api\PrescriptionController;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\PatientsController;
use App\Http\Controllers\MedicalConditionController;
use Inertia\Inertia;
use SebastianBergmann\CodeCoverage\Report\Html\Dashboard;



            //Api
         
            Route::get('/services', [ServiceController::class, 'index']);
            Route::get('/patients', [PatientController::class, 'index']);
            Route::get('/pending-payments', [PaymentController::class, 'pending']);
            Route::get('/transactions', [TransactionController::class, 'recent']);
            Route::get('/items', [ItemController::class, 'index']);

            //Medicine Routes
            Route::middleware(['auth'])->group(function () {
                Route::get('/medicine/inventory', [MedicineController::class, 'index'])->name('medicine.inventory');
                Route::post('/medicine/store', [MedicineController::class, 'store'])->name('medicine.store');

        
             
                });
                
                //dispensing

          
                Route::middleware(['auth'])->group(function () {
                    Route::get('/dispensing', [DispensingController::class, 'index'])->name('dispensing');
                });
                Route::get('/dispensing', function () { return Inertia::render('Dispensing/Dispensing'); })->name('dispensing');

                 Route::get('/categories', [DispensingController::class, 'categories'])->name('categories'); 
                Route::post('/dispense/store', [DispensingController::class, 'store'])->name('dispense.store');
                Route::get('/dispense/logs', [DispensingController::class, 'logs'])->name('dispense.logs');
                Route::get('/categories', [DispensingController::class, 'categories'])->name('categories');

                //patient prescription
                
              Route::get('/patients', [PatientsController::class, 'index']);
                Route::get('/patients/{id}', [PatientsController::class, 'show']);
                Route::get('/patients/{id}/prescriptions', [PrescriptionController::class, 'getByPatient']);

                // Patient Medical Condition
                Route::get('/patients/{id}/medical-conditions', [MedicalConditionController::class, 'index']);
                Route::post('/patients/{id}/medical-conditions', [MedicalConditionController::class, 'store']);
                Route::get('/medical-conditions/{id}', [MedicalConditionController::class, 'show']);

                // print
                Route::get('/prescriptions/{id}/print', [PrescriptionController::class, 'print'])->name('prescriptions.print');


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
    Route::get('/physician/appointments/{patientId}', [PhysicianAppointmentController::class, 'show']);
    Route::post('/physician/appointments/{appointmentId?}', [PhysicianAppointmentController::class, 'store'])
    ->name('physician.appointments.store');


    // Nurse edit routes
    Route::get('/nurse/edit', [NurseController::class, 'edit'])->name('nurse.edit');
    Route::post('/nurse/edit', [NurseController::class, 'update'])->name('nurse.update');
    

    Route::get('/physician/appointments', [PhysicianAppointmentController::class, 'index'])
        ->name('physician.appointments.index');


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
            
            Route::get('/appointments', [AppointmentController::class, 'viewAllAppointments'])->name('nurse.appointments.viewAll');
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
                Route::prefix('cashier')->group(function () {
                    Route::get('/dashboard', [CashierController::class, 'index'])->name('cashier.dashboard');
                          Route::get('/cashier/categories', [CashierController::class, 'getCategories'])->name('cashier.categories');
                    Route::get('/services-items', [CashierController::class, 'getServicesAndItems'])->name('cashier.services.items');
                    Route::get('/cashier/patients', [CashierController::class, 'searchPatients'])->name('cashier.patients');
                    Route::post('/bill', [CashierController::class, 'generateBill'])->name('cashier.bill');
                    Route::post('/payment', [CashierController::class, 'recordPayment'])->name('cashier.payment');
                    Route::get('/transactions', [CashierController::class, 'transactions'])->name('cashier.transactions');


            
                });


        });
});


require __DIR__.'/auth.php';
