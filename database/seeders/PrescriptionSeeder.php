<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Patient;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;

class PrescriptionSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $patientIds = Patient::pluck('id')->toArray();

        if (empty($patientIds)) {
            $this->command->error('No patients found. Seed patients first!');
            return;
        }

        foreach ($patientIds as $patientId) {
            // Each patient gets 1-5 prescriptions
            for ($i = 0; $i < $faker->numberBetween(1, 5); $i++) {
                // Randomly decide if the prescription is already dispensed
                $isDispensed = $faker->boolean(30); // 30% chance dispensed
                DB::table('prescriptions')->insert([
                    'patient_id'      => $patientId,
                    'doctor_name'     => $faker->name(),
                    'medication'      => $faker->word() . ' ' . $faker->randomNumber(2),
                    'dosage'          => $faker->optional()->randomElement(['100mg', '200mg', '500mg']),
                    'instructions'    => $faker->optional()->sentence(),
                    'prescribed_date' => $faker->date(),
                    'status'          => $isDispensed ? 'dispensed' : 'pending',
                    'dispensed_at'    => $isDispensed ? now() : null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ]);
            }
        }

        $this->command->info('Prescriptions seeded successfully with status and dispensed_at!');
    }
}
