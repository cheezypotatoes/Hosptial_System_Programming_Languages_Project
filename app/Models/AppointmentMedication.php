<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentMedication extends Model
{
      protected $table = 'appointment_medications';

    protected $fillable = [
        'appointment_id', 
        'name', 
        'dosage', 
        'frequency', 
        'duration', 
        'notes'
    ];


    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
