<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient_id',
        'amount',
        'status',
        'payment_method', 
        'amount_received',
    ];

    public function patient()
    {
        return $this->belongsTo(Patient::class);
    }
}
