<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Physician; // Import the Physician model
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

        // List of valid medical specializations
        $validSpecializations = [
            'Cardiology', 
            'Orthopedics', 
            'Pediatrics', 
            'Neurology', 
            'Dermatology', 
            'Gastroenterology', 
            'Psychiatry', 
            'Radiology', 
            'Surgery', 
            'Emergency Medicine', 
            'Anesthesiology', 
            'Pathology', 
            'Obstetrics and Gynecology', 
            'Internal Medicine', 
            'Endocrinology'
        ];

        // Hardcoded doctors with unique emails and valid specializations
        $doctors = [
            [
                'first_name' => 'John',
                'last_name'  => 'Doe',
                'position'   => 'Doctor',
                'email'      => 'john.doe@example.com',
                'password'   => bcrypt('password123'),
                'specialization' => 'Cardiology',
            ],
            [
                'first_name' => 'Jane',
                'last_name'  => 'Smith',
                'position'   => 'Doctor',
                'email'      => 'jane.smith@example.com',
                'password'   => bcrypt('password123'),
                'specialization' => 'Orthopedics',
            ],
            [
                'first_name' => 'Alice',
                'last_name'  => 'Johnson',
                'position'   => 'Doctor',
                'email'      => 'alice.johnson@example.com',
                'password'   => bcrypt('password123'),
                'specialization' => 'Pediatrics',
            ],
        ];

        // Insert fixed doctors if not exist
        foreach ($doctors as $doctor) {
            if (!User::where('email', $doctor['email'])->exists()) {
                // Create the user
                $user = User::create([
                    'first_name' => $doctor['first_name'],
                    'last_name' => $doctor['last_name'],
                    'position' => $doctor['position'],
                    'email' => $doctor['email'],
                    'password' => $doctor['password'],
                ]);

                // Create the corresponding Physician record with specialization
                Physician::create([
                    'user_id' => $user->id,
                    'specialization' => $doctor['specialization'],
                ]);

                $this->command->info("Doctor {$doctor['email']} created with specialization {$doctor['specialization']}.");
            } else {
                $this->command->info("User {$doctor['email']} already exists, skipping.");
            }
        }

        // Create 50 random users with varied positions
        $positions = ['Doctor', 'Nurse', 'Receptionist', 'Technician', 'Pharmacist', 'Administrator'];

        for ($i = 0; $i < 50; $i++) {
            $email = $faker->unique()->safeEmail();
            $position = $positions[array_rand($positions)];

            $user = User::create([
                'first_name' => $faker->firstName(),
                'last_name'  => $faker->lastName(),
                'position'   => $position,
                'email'      => $email,
                'password'   => bcrypt('password123'),
            ]);

            // If the user is a doctor, assign a valid specialization
            if ($position === 'Doctor') {
                $specialization = $validSpecializations[array_rand($validSpecializations)];

                Physician::create([
                    'user_id' => $user->id,
                    'specialization' => $specialization,
                ]);
            }
        }
    }
}
