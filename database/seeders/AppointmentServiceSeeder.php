<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB; // <- Correct import

class AppointmentServiceSeeder extends Seeder
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
            // Each appointment gets 0-2 services
            for ($i = 0; $i < $faker->numberBetween(0, 2); $i++) {
                DB::table('appointment_services')->insert([
                    'appointment_id' => $appointmentId,
                    'name' => $faker->randomElement(['X-ray', 'Blood Test', 'ECG', 'Ultrasound']),
                    'result' => $faker->optional()->word(),
                    'description' => $faker->optional()->sentence(),
                    'cost' => $faker->randomFloat(2, 50, 500),
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Appointment services seeded successfully.');
    }
}
