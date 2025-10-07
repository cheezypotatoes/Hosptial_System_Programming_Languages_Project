<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use Faker\Factory as Faker;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB; // <- Correct import

class AppointmentMedicationSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $appointmentIds = Appointment::pluck('id')->toArray();

        if (empty($appointmentIds)) {
            $this->command->error('No appointments found. Seed appointments first!');
            return;
        }

        foreach ($appointmentIds as $appointmentId) {
            // Each appointment gets 1-3 medications
            for ($i = 0; $i < $faker->numberBetween(1, 3); $i++) {
                DB::table('appointment_medications')->insert([
                    'appointment_id' => $appointmentId,
                    'name' => $faker->word() . ' ' . Str::random(2),
                    'dosage' => $faker->numberBetween(100, 500) . 'mg',
                    'frequency' => $faker->randomElement(['Once a day', 'Twice a day', 'Thrice a day']),
                    'duration' => $faker->numberBetween(3, 14) . ' days',
                    'notes' => $faker->optional()->sentence(),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Appointment medications seeded successfully.');
    }
}
