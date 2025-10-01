<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dispense extends Model
{
    use HasFactory;

    protected $fillable = [
        'patient',
        'medicine_id',
        'quantity',
        'dispensed_at',
    ];

    public function medicine()
    {
        return $this->belongsTo(Medicine::class);
    }
}
