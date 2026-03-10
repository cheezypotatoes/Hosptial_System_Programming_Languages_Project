<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('appointment_services', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('appointment_id')->constrained('appointments')->onDelete('cascade'); 
            $table->string('name');
            $table->string('result')->nullable();;
            $table->string('description')->nullable(); 
            $table->decimal('cost', 8, 2)->default(0.00); 
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('appointment_services');
    }
};
