<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ServiceItemSeeder extends Seeder
{
    public function run(): void
    {
        $serviceItems = [
            // Services
            ['name' => 'General Consultation', 'description' => 'Basic doctor consultation', 'price' => 500.00, 'stock' => 0, 'type' => 'service'],
            ['name' => 'Specialist Consultation', 'description' => 'Specialist doctor visit', 'price' => 1200.00, 'stock' => 0, 'type' => 'service'],
            ['name' => 'X-Ray', 'description' => 'Chest X-ray diagnostic test', 'price' => 800.00, 'stock' => 0, 'type' => 'service'],
            ['name' => 'MRI Scan', 'description' => 'Magnetic Resonance Imaging', 'price' => 5000.00, 'stock' => 0, 'type' => 'service'],
            ['name' => 'Blood Test', 'description' => 'Complete blood count test', 'price' => 350.00, 'stock' => 0, 'type' => 'service'],
            ['name' => 'Urinalysis', 'description' => 'Basic urine test', 'price' => 200.00, 'stock' => 0, 'type' => 'service'],

            // Items / Medicines
            ['name' => 'Paracetamol 500mg', 'description' => 'Pain reliever and fever reducer', 'price' => 5.00, 'stock' => 100, 'type' => 'item'],
            ['name' => 'Amoxicillin 500mg', 'description' => 'Antibiotic capsule', 'price' => 12.00, 'stock' => 50, 'type' => 'item'],
            ['name' => 'Cough Syrup 100ml', 'description' => 'For cough relief', 'price' => 60.00, 'stock' => 30, 'type' => 'item'],
            ['name' => 'Face Mask (Box of 50)', 'description' => 'Disposable face masks', 'price' => 120.00, 'stock' => 200, 'type' => 'item'],
            ['name' => 'Alcohol 70% 500ml', 'description' => 'Disinfectant solution', 'price' => 75.00, 'stock' => 80, 'type' => 'item'],
        ];

        DB::table('service_items')->insert($serviceItems);
    }
}
