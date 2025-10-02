<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Appointment;
use App\Models\User;
use App\Models\Patient;
use Faker\Factory as Faker;
use Illuminate\Support\Carbon;

class AppointmentSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        $today = Carbon::today();

        $doctorIds = User::where('position', 'Doctor')->pluck('id')->toArray();
        $patientIds = Patient::pluck('id')->toArray();

        if (empty($doctorIds) || empty($patientIds)) {
            $this->command->error('No doctors or patients found. Seed those first!');
            return;
        }

        // Seed 35 appointments for today
        for ($i = 0; $i < 35; $i++) {
            Appointment::create([
                'checkup_date' => $today->copy()->addMinutes($faker->numberBetween(480, 1020)), // 8 AM to 5 PM today
                'doctor_id' => $faker->randomElement($doctorIds),
                'patient_id' => $faker->randomElement($patientIds),
                'fee' => $faker->randomFloat(2, 50, 300),
                'notes' => $faker->sentence(),
            ]);
        }

        // Seed 100 upcoming appointments from tomorrow to 30 days ahead
        for ($i = 0; $i < 100; $i++) {
            Appointment::create([
                'checkup_date' => $today->copy()->addDays($faker->numberBetween(1, 30))->addMinutes($faker->numberBetween(480, 1020)), // 8 AM to 5 PM future days
                'doctor_id' => $faker->randomElement($doctorIds),
                'patient_id' => $faker->randomElement($patientIds),
                'fee' => $faker->randomFloat(2, 50, 300),
                'notes' => $faker->sentence(),
            ]);
        }

        $this->command->info('35 appointments for today and 100 upcoming appointments created successfully.');
    }
}
