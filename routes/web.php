<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\PhysicianController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\PatientController;
use App\Http\Middleware\EnsureUserIsNurse;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Public routes
Route::get('/', fn() => Inertia::render('Index'));

Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::post('/login', [LoginController::class, 'store'])->name('login.store');

Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
Route::post('/register', [RegisterController::class, 'store'])->name('register.store');

// Authenticated routes
Route::middleware('auth')->group(function () {

    // Physician edit routes
    Route::get('/physician/edit', [PhysicianController::class, 'edit'])->name('physician.edit');

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
        });
});

require __DIR__.'/auth.php';
