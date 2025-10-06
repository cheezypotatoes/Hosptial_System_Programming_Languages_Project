<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\MedicalCondition;
use App\Models\Prescription;
use App\Models\AppointmentMedication;
use App\Models\Appointment;
use Carbon\Carbon;

class Patient extends Model
{
    use HasFactory;

    protected $fillable = [
        'first_name',
        'last_name',
        'birthdate',
        'gender',
        'contact_num',
        'address',
        'notes',
    ];

    protected $casts = [
        'birthdate' => 'date:Y-m-d',
    ];

    /** Relationships **/

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

    // Appointment medications through appointments
    public function appointmentMedications()
    {
        return $this->hasManyThrough(
            AppointmentMedication::class, // final model
            Appointment::class,           // intermediate model
            'patient_id',                 // FK on appointments
            'appointment_id',             // FK on appointment_medications
            'id',                         // local key on patients
            'id'                          // local key on appointments
        );
    }

    /** Accessors **/

    // Current active medical conditions
    public function getCurrentMedicalConditionsAttribute()
    {
        return $this->medicalConditions()
            ->where('status', 'active')
            ->get()
            ->map(fn($mc) => [
                'id' => $mc->id,
                'condition_name' => $mc->condition_name,
                'status' => $mc->status,
                'diagnosed_date' => $mc->diagnosed_date
                    ? Carbon::parse($mc->diagnosed_date)->format('Y-m-d')
                    : null,
            ])
            ->toArray();
    }

    // Current appointment medications (all, can add date filtering if needed)
    public function getCurrentAppointmentMedicationsAttribute()
    {
        return $this->appointmentMedications
            ->map(fn($am) => [
                'id' => $am->id,
                'name' => $am->name,
                'dosage' => $am->dosage,
                'frequency' => $am->frequency,
                'duration' => $am->duration,
                'notes' => $am->notes,
            ])
            ->toArray();
    }

    // Full name accessor
    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    // Mutator for contact number
    public function setContactNumAttribute($value): void
    {
        $this->attributes['contact_num'] = preg_replace('/\D/', '', $value);
    }
}
