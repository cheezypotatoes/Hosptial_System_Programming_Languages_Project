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
        'amount_received',
        'payment_method',
        'status',
    ];

    public function paymentItems()
    {
        return $this->hasMany(PaymentItem::class);
    }
}
