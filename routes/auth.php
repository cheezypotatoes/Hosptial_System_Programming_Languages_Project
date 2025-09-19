<?php

use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PhysicianController;
use App\Http\Controllers\NurseController;

use Illuminate\Support\Facades\Route;

Route::middleware('guest')->group(function () {
    Route::get('/', function () {
        return Inertia\Inertia::render('Index');
    });

    
    Route::get('/login', function () {
        return Inertia\Inertia::render('Auth/Login');
    })->name('login');

    Route::post('/login', [LoginController::class, 'store'])->name('login.store');

    Route::get('/register', function () {
        return Inertia\Inertia::render('Auth/Register');
    })->name('register');

    Route::post('/register', [RegisterController::class, 'store'])->name('register.store');
});

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::post('/logout', [LoginController::class, 'destroy'])->name('logout');

    Route::get('/physician/edit', [PhysicianController::class, 'edit'])->name('physician.edit');
    Route::post('/physician/edit', [PhysicianController::class, 'update'])->name('physician.update');


    Route::get('/nurse/edit', [NurseController::class, 'edit'])->name('nurse.edit');
    Route::post('/nurse/edit', [NurseController::class, 'update'])->name('nurse.update');

});
