<?php

namespace App\Models;

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
        'birthdate' => 'date',
    ];


    public function appointments()
    {
        return $this->hasMany(Appointment::class);
    }

}