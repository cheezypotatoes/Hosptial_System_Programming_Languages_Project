<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // Hardcoded doctors with unique emails
        $doctors = [
            [
                'first_name' => 'John',
                'last_name'  => 'Doe',
                'position'   => 'Doctor',
                'email'      => 'john.doe@example.com',
                'password'   => bcrypt('password123'),
            ],
            [
                'first_name' => 'Jane',
                'last_name'  => 'Smith',
                'position'   => 'Doctor',
                'email'      => 'jane.smith@example.com',
                'password'   => bcrypt('password123'),
            ],
            [
                'first_name' => 'Alice',
                'last_name'  => 'Johnson',
                'position'   => 'Doctor',
                'email'      => 'alice.johnson@example.com',
                'password'   => bcrypt('password123'),
            ],
        ];

        // Insert fixed doctors if not exist
        foreach ($doctors as $doctor) {
            if (!User::where('email', $doctor['email'])->exists()) {
                User::create($doctor);
                $this->command->info("User {$doctor['email']} created.");
            } else {
                $this->command->info("User {$doctor['email']} already exists, skipping.");
            }
        }

        // Create 50 random users with varied positions
        $positions = ['Doctor', 'Nurse', 'Receptionist', 'Technician', 'Pharmacist', 'Administrator'];

        for ($i = 0; $i < 50; $i++) {
            $email = $faker->unique()->safeEmail();
            $user = [
                'first_name' => $faker->firstName(),
                'last_name'  => $faker->lastName(),
                'position'   => $positions[array_rand($positions)],
                'email'      => $email,
                'password'   => bcrypt('password123'),
            ];

            User::create($user);
        }
    }
}
