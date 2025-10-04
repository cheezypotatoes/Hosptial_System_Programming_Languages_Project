<?php
// database/migrations/xxxx_xx_xx_create_physicians_table.php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePhysiciansTable extends Migration
{
    public function up()
    {
        Schema::create('physicians', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');  // Foreign key to users table
            $table->string('specialization'); // Store specialization for the physician
            $table->timestamps();

            // Add foreign key constraint to link user_id with users table
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('physicians');
    }
}
