<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Physician; 
use Faker\Factory as Faker;

class UserSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker::create();

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

       
        foreach ($doctors as $doctor) {
            if (!User::where('email', $doctor['email'])->exists()) {
                
                $user = User::create([
                    'first_name' => $doctor['first_name'],
                    'last_name' => $doctor['last_name'],
                    'position' => $doctor['position'],
                    'email' => $doctor['email'],
                    'password' => $doctor['password'],
                ]);

               
                Physician::create([
                    'user_id' => $user->id,
                    'specialization' => $doctor['specialization'],
                ]);

                $this->command->info("Doctor {$doctor['email']} created with specialization {$doctor['specialization']}.");
            } else {
                $this->command->info("User {$doctor['email']} already exists, skipping.");
            }
        }

    
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
