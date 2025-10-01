<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('patient_id')
                  ->constrained('patients')
                  ->onDelete('cascade'); // when patient is deleted, remove payments

            $table->decimal('amount', 10, 2);
            $table->decimal('amount_received', 10, 2)->nullable();
            $table->string('payment_method'); // e.g., Cash, GCash, Card
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
