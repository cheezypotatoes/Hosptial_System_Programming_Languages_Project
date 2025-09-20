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


Route::get('/nurse/addPatient', [PatientController::class, 'create'])->name('patients.create');
Route::post('/nurse/addPatient', [PatientController::class, 'store'])->name('patients.store');


require __DIR__.'/auth.php';
