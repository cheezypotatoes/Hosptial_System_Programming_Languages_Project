<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_medications', function (Blueprint $table) {
            $table->id(); // Primary key (auto-incrementing)
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade'); // Foreign key for appointment
            $table->string('name'); // Medication name
            $table->string('dosage'); // Dosage (e.g., 500mg)
            $table->string('frequency'); // Frequency (e.g., 3 times a day)
            $table->string('duration'); // Duration (e.g., 7 days)
            $table->text('notes')->nullable(); // Optional notes (e.g., take with food)
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down(): void
    {
        // Drop the table if we roll back the migration
        Schema::dropIfExists('appointment_medications');
    }
};
