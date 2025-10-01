<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MedicineSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('medicines')->insert([
            [
                'name' => 'Paracetamol 500mg',
                'stock' => 120,
                'expiry' => Carbon::parse('2025-09-11'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Amoxicillin 250mg',
                'stock' => 30,
                'expiry' => Carbon::parse('2024-09-11'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Ibuprofen 200mg',
                'stock' => 85,
                'expiry' => Carbon::parse('2026-09-11'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Omeprazole 20mg',
                'stock' => 15,
                'expiry' => Carbon::parse('2025-09-11'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Cough Syrup',
                'stock' => 50,
                'expiry' => Carbon::parse('2024-09-11'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
