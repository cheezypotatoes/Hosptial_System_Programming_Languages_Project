<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    public function definition(): array
    {
        return [
            'first_name' => $this->faker->firstName(),
            'last_name'  => $this->faker->lastName(),
            'position'   => $this->faker->jobTitle(),
            'email'      => $this->faker->unique()->safeEmail(),
            'password'   => bcrypt('password'), // default password
            'remember_token' => Str::random(10),
        ];
    }
}
