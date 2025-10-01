<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class HospitalSeeder extends Seeder
{
    public function run(): void
    {
        // Categories
        $categories = [
            ['name' => 'Consultation', 'description' => 'Doctor consultations and related services'],
            ['name' => 'Diagnostics', 'description' => 'Diagnostic services like X-rays and MRI'],
            ['name' => 'Laboratory', 'description' => 'Lab tests and examinations'],
            ['name' => 'Medicine', 'description' => 'Medicinal products available in pharmacy'],
            ['name' => 'Supplies', 'description' => 'Medical and hospital supplies'],
        ];
        DB::table('categories')->insert($categories);

        // Services
        $services = [
            ['name' => 'General Consultation', 'description' => 'Basic doctor consultation', 'price' => 500.00, 'category_id' => 1],
            ['name' => 'Specialist Consultation', 'description' => 'Specialist doctor visit', 'price' => 1200.00, 'category_id' => 1],
            ['name' => 'X-Ray', 'description' => 'Chest X-ray diagnostic test', 'price' => 800.00, 'category_id' => 2],
            ['name' => 'MRI Scan', 'description' => 'Magnetic Resonance Imaging', 'price' => 5000.00, 'category_id' => 2],
            ['name' => 'Blood Test', 'description' => 'Complete blood count test', 'price' => 350.00, 'category_id' => 3],
            ['name' => 'Urinalysis', 'description' => 'Basic urine test', 'price' => 200.00, 'category_id' => 3],
        ];
        DB::table('services')->insert($services);

        // Items
        $items = [
            ['name' => 'Paracetamol 500mg', 'description' => 'Pain reliever and fever reducer', 'stock_quantity' => 100, 'price' => 5.00, 'category_id' => 4],
            ['name' => 'Amoxicillin 500mg', 'description' => 'Antibiotic capsule', 'stock_quantity' => 50, 'price' => 12.00, 'category_id' => 4],
            ['name' => 'Cough Syrup 100ml', 'description' => 'For cough relief', 'stock_quantity' => 30, 'price' => 60.00, 'category_id' => 4],
            ['name' => 'Face Mask (Box of 50)', 'description' => 'Disposable face masks', 'stock_quantity' => 200, 'price' => 120.00, 'category_id' => 5],
            ['name' => 'Alcohol 70% 500ml', 'description' => 'Disinfectant solution', 'stock_quantity' => 80, 'price' => 75.00, 'category_id' => 5],
        ];
        DB::table('items')->insert($items);
    }
}
