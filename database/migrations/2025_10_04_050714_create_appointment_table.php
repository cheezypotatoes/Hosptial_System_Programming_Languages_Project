<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')->constrained()->onDelete('cascade');
            $table->foreignId('doctor_id')->constrained('users')->onDelete('cascade');
            $table->dateTime('checkup_date');
            $table->text('notes')->nullable();
            $table->decimal('fee', 8, 2)->default(0.00);

            // New fields added to the table
            $table->text('problem')->nullable();        // Problem description
            $table->text('history')->nullable();        // Medical history
            $table->text('symptoms')->nullable();       // Symptoms reported
            $table->text('medication')->nullable();     // Medication prescribed

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointments');
    }
};
