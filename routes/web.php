<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\PhysicianController;
use App\Http\Controllers\NurseController;
use App\Http\Controllers\PatientController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Index');
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', [LoginController::class, 'store'])->name('login.store');

Route::get('/register', function () {
    return Inertia::render('Auth/Register');
})->name('register');

Route::post('/register', action: [RegisterController::class, 'store'])->name('register.store');


Route::get('/physician/edit', [PhysicianController::class, 'edit'])
    ->name('physician.edit');

Route::get('/nurse/edit', [NurseController::class, 'edit'])->name('nurse.edit');
    Route::post('/nurse/edit', [NurseController::class, 'update'])->name('nurse.update');


Route::prefix('nurse')->group(function () {
        Route::get('/patients', [PatientController::class, 'index'])->name('nurse.patients.index');
        Route::get('/patients/create', [PatientController::class, 'create'])->name('nurse.patients.create');
        Route::post('/patients', [PatientController::class, 'store'])->name('nurse.patients.store');
        Route::get('/patients/{patient}/edit', [PatientController::class, 'edit'])->name('nurse.patients.edit');
        Route::put('/patients/{patient}', [PatientController::class, 'update'])->name('nurse.patients.update');
        Route::delete('/patients/{patient}', [PatientController::class, 'destroy'])->name('nurse.patients.destroy');
    });


require __DIR__.'/auth.php';
