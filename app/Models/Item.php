<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Item extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'description',
        'price',
        'stock_quantity',
        'category_id',
    ];

public function category()
{
    return $this->belongsTo(Category::class);
}
    protected static function booted()
    {
        static::saving(function ($item) {
            if ($item->stock_quantity < 0) {
                $item->stock_quantity = 0;
            }
        });
    }
}
