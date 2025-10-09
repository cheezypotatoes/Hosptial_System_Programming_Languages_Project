<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Physician extends Model
{
    use HasFactory;

    protected $table = 'physicians';

    protected $fillable = [
        'user_id', 
        'specialization',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
