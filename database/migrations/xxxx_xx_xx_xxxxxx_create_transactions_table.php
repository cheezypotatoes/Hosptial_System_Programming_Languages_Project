<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('payment_id')->nullable();
            $table->unsignedBigInteger('patient_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->string('status')->default('pending'); 
            $table->timestamps();

        
            $table->foreign('payment_id')->references('id')->on('payments')->onDelete('cascade');
             
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
