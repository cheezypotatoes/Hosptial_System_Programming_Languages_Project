<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock_quantity',
        'category_id',
    ];

    /**
     * Item belongs to a category
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * Ensure stock quantity is always non-negative
     */
    protected static function booted()
    {
        static::saving(function ($item) {
            if ($item->stock_quantity < 0) {
                $item->stock_quantity = 0;
            }
        });
    }
}
