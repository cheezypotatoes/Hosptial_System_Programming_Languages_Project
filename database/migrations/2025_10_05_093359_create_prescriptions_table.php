<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::create('prescriptions', function (Blueprint $table) {
        $table->id();
        $table->foreignId('patient_id')
              ->constrained('patients')
              ->onDelete('cascade');
        $table->string('doctor_name');
        $table->string('medication');
        $table->string('dosage')->nullable();
        $table->text('instructions')->nullable();
        $table->date('prescribed_date');
        $table->timestamps();
    });
}


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('prescriptions');
    }
};
