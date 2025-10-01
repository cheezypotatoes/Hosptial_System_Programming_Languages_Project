<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = [
        'name',       // e.g., Consultation, Medication
        'description' // optional description
    ];

    /**
     * A category can have many services
     */
    public function services()
    {
        return $this->hasMany(Service::class);
    }

    /**
     * A category can have many items
     */
    public function items()
    {
        return $this->hasMany(Item::class);
    }
}
