<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('medical_conditions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')
                  ->constrained('patients')
                  ->onDelete('cascade');
            $table->string('condition_name'); // e.g., "Diabetes", "Hypertension"
            $table->text('notes')->nullable(); // extra info
            $table->date('diagnosed_date')->nullable(); // when condition was diagnosed
            $table->enum('status', ['active', 'resolved', 'chronic'])->default('active');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('medical_conditions');
    }
};
