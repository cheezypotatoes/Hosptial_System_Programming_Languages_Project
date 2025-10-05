<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Prescription extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'patient_id',
        'doctor_name',
        'medication',
        'dosage',
        'instructions',
        'prescribed_date',
    ];

    /**
     * The attributes that should be cast to native types.
     */
    protected $casts = [
        'prescribed_date' => 'datetime:Y-m-d',
    ];

    /**
     * Relationships
     */
  public function patient()
{
    return $this->belongsTo(Patient::class, 'patient_id');
}
}
