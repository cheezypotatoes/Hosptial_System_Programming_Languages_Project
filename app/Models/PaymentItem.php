<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PaymentItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'payment_id',
        'item_type',
        'item_id',
        'quantity',
        'price',
    ];

    public function payment()
    {
        return $this->belongsTo(Payment::class);
    }
}
