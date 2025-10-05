<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Category extends Model
{
    use HasFactory;

    // Mass assignable fields
    protected $fillable = [
        'name',     
        'description' 
    ];

  public function services()
{
    return $this->hasMany(Service::class);
}

public function items()
{
    return $this->hasMany(Item::class);
}

}
