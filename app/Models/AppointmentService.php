<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentService extends Model
{
    // Table name (optional if table name follows convention)
    protected $table = 'appointment_services';

    // Define the fillable fields for mass assignment
    protected $fillable = [
        'appointment_id', 
        'name', 
        'description', 
        'cost',
        'result'
    ];

    /**
     * Get the appointment that owns the service.
     */
    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
