<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_medications', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade'); 
            $table->string('name');
            $table->string('dosage'); 
            $table->string('frequency');
            $table->string('duration');
            $table->text('notes')->nullable(); 
            $table->timestamps(); 
        });
    }

    public function down(): void
    {
      
        Schema::dropIfExists('appointment_medications');
    }
};
