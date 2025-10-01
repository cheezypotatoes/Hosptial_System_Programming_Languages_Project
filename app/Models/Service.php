<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = [
        'name',
        'description',
        'price',
        'category_id',
    ];

    /**
     * Service belongs to a category
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
