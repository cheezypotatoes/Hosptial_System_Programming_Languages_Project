<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;

class PatientSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create();

        $patients = [];

        foreach (range(1, 10) as $i) {
            $patients[] = [
                'first_name'   => $faker->firstName,
                'last_name'    => $faker->lastName,
                'birthdate'    => $faker->date(),
                'gender'       => $faker->randomElement(['Male', 'Female', 'Other']),
                'contact_num'  => $faker->phoneNumber,
                'address'      => $faker->address,
                'created_at'   => now(),
                'updated_at'   => now(),
            ];
        }

        DB::table('patients')->insert($patients);

        $this->command->info('Patients seeded successfully!');
    }
}
