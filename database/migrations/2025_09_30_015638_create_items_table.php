<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    
    public function up(): void
    {
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('name'); 
            $table->text('description')->nullable();
            $table->integer('stock_quantity')->default(0);
            $table->decimal('price', 10, 2);

  
            $table->foreignId('category_id')
                  ->nullable()
                  ->constrained('categories')
                  ->onDelete('cascade');

            $table->timestamps();
        });
    }

  
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
