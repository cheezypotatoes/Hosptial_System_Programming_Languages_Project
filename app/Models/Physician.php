<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Physician extends Model
{
    use HasFactory;

    // Define the table name explicitly if it's not the plural form of the model name
    protected $table = 'physicians';

    // The attributes that are mass assignable
    protected $fillable = [
        'user_id', 
        'specialization',
    ];

    // Relationship: A physician belongs to a user (doctor)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
