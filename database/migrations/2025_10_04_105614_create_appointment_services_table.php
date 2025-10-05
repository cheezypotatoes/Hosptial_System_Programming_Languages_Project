<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_services', function (Blueprint $table) {
            $table->id(); // Primary key (auto-incrementing)
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade'); // Foreign key to appointments
            $table->string('name'); // Service name (e.g., X-ray, Blood Test)
            $table->string('result')->nullable();;
            $table->string('description')->nullable(); // Description of the service
            $table->decimal('cost', 8, 2)->default(0.00); // Cost of the service
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment_services');
    }
};
