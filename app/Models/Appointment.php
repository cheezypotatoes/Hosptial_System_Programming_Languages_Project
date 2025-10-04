<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Appointment extends Model
{
    use HasFactory;

    // Add the new fields to the fillable array
    protected $fillable = [
        'patient_id',
        'doctor_id',
        'checkup_date',
        'notes',
        'fee',
        'problem',      // New field for problem
        'history',      // New field for medical history
        'symptoms',     // New field for symptoms
        'medication',   // New field for medication
    ];

    protected $casts = [
        'checkup_date' => 'datetime',
        'fee' => 'decimal:2',
    ];

    // Define relationships
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function doctor()
    {
        return $this->belongsTo(User::class, 'doctor_id');
    }
}
