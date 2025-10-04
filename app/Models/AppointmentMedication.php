<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentMedication extends Model
{
    // Define the table associated with the model (optional if table name is plural)
    protected $table = 'appointment_medications';

    // Define the fillable attributes for mass assignment
    protected $fillable = [
        'appointment_id', 
        'name', 
        'dosage', 
        'frequency', 
        'duration', 
        'notes'
    ];

    /**
     * Get the appointment that owns the medication.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
