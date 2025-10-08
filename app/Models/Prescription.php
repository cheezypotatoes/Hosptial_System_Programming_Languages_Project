<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

     protected $fillable = [
        'patient_id',
        'doctor_name',      
        'medication',       
        'dosage',
        'instructions',
        'prescribed_date',
        'status',
        'dispensed_at',
    ];

    // Relations
    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }

    public function physician()
    {
        return $this->belongsTo(User::class, 'physician_id');
    }

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
