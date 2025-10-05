<?php

namespace App\Models;

use App\Models\Prescription;
use App\Models\MedicalCondition;
use App\Models\Appointment;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Patient extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'first_name',
        'last_name',
        'birthdate',
        'gender',
        'contact_num',
        'address',
    ];

    /**
     * Cast attributes to proper types.
     */
    protected $casts = [
        'birthdate' => 'date:Y-m-d', // Ensure consistent date formatting
    ];

    /**
     * Relationships
     */
    public function appointments()
    {
        return $this->hasMany(Appointment::class, 'patient_id');
    }
    public function medicalConditions()
{
    return $this->hasMany(MedicalCondition::class, 'patient_id');
}

    public function prescriptions()
    {
        return $this->hasMany(Prescription::class, 'patient_id');
    }

    /**
     * Accessors & Mutators
     */
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function setContactNumAttribute($value): void
    {
        // Normalize contact number format (e.g., remove spaces, dashes)
        $this->attributes['contact_num'] = preg_replace('/\D/', '', $value);
    }
}
