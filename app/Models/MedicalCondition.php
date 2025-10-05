<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalCondition extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'condition_name',
        'notes',
        'diagnosed_date',
        'status',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class, 'patient_id');
    }
}
