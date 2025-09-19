<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Nurse extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'assigned_to',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}