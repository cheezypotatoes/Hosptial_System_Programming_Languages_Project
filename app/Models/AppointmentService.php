<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AppointmentService extends Model
{
    protected $table = 'appointment_services';
    protected $fillable = [
        'appointment_id', 
        'name', 
        'description', 
        'cost',
        'result'
    ];

    public function appointment()
    {
        return $this->belongsTo(Appointment::class);
    }
}
