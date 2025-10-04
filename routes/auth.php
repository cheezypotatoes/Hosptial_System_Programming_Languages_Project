<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PhysicianController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PhysicianAppointmentController;
use App\Http\Middleware\EnsureUserIsNurse;
use App\Http\Controllers\AppointmentController;

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Guest routes
Route::middleware('guest')->group(function () {
    Route::get('/', fn() => Inertia::render('Index'));

    Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
    Route::post('/login', [LoginController::class, 'store'])->name('login.store');

    Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
});

// Authenticated routes
Route::middleware('auth')->group(function () {

    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    // Physician edit routes
    Route::get('/physician/edit', [PhysicianController::class, 'edit'])->name('physician.edit');
    Route::post('/physician/edit', [PhysicianController::class, 'update'])->name('physician.update');

    // Nurse edit routes
    Route::get('/nurse/edit', [NurseController::class, 'edit'])->name('nurse.edit');
    Route::post('/nurse/edit', [NurseController::class, 'update'])->name('nurse.update');


    Route::get('/physician/appointments', [PhysicianAppointmentController::class, 'index'])
        ->name('physician.appointments.index');



    // Nurse patient management routes with middleware applied to all
    Route::prefix('nurse')->middleware(EnsureUserIsNurse::class)->group(function () {
        Route::get('/patients', [PatientController::class, 'index'])->name('nurse.patients.index');
        Route::get('/patients/create', [PatientController::class, 'create'])->name('nurse.patients.create');
        Route::post('/patients', [PatientController::class, 'store'])->name('nurse.patients.store');
        Route::get('/patients/{patient}/edit', [PatientController::class, 'edit'])->name('nurse.patients.edit');
        Route::put('/patients/{patient}', [PatientController::class, 'update'])->name('nurse.patients.update');
        Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])->name('nurse.patients.destroy');

        Route::get('/appointments', [AppointmentController::class, 'viewAllAppointments'])->name('nurse.appointments.viewAll');
        Route::get('/patients/{patient}/appointments', action: [AppointmentController::class, 'viewAppointments'])->name('nurse.patients.viewAppointments');
        Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroyAppointment'])->name('nurse.appointments.destroy');
        Route::get('/patients/{patient}/make-appointment', [AppointmentController::class, 'create'])->name('nurse.patients.makeAppointment');
        Route::post('/patients/{patient}/make-appointment', [AppointmentController::class, 'store'])->name('nurse.patients.storeAppointment');
    }); 
    

});
