<?php

use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\LoginController;
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

require __DIR__.'/auth.php';
