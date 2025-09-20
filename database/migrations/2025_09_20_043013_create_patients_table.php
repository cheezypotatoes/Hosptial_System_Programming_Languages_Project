<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Patient;

return new class extends Migration
{

    public function update(Request $request, Patient $patient)
    {
        // Validate input
        $validated = $request->validate([
            'first_name'   => 'required|string|max:100',
            'last_name'    => 'required|string|max:100',
            'birthdate'    => 'required|date',
            'gender'       => 'required|in:Male,Female,Other',
            'contact_num'  => 'required|string|max:20',
            'address'      => 'nullable|string|max:255',
        ]);

        // Update the patient
        $patient->update($validated);

        // Redirect back to nurse patients list with success message
        return redirect()
            ->route('nurse.patients.index')
            ->with('success', 'Patient updated successfully!');
    }

    public function up()
    {
        Schema::create('patients', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('birthdate')->nullable();
            $table->enum('gender', ['Male', 'Female', 'Other'])->nullable();
            $table->string('contact_num')->nullable();
            $table->string('address')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::table('patients', function (Blueprint $table) {
            $table->dropColumn(['birthdate', 'gender', 'contact_num', 'address']);
        });
    }

    

    
};
