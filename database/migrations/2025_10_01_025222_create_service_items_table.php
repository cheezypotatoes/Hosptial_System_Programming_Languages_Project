<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('service_items', function (Blueprint $table) {
            $table->id();
            $table->string('name');                      // Name of service/item/medicine
            $table->text('description')->nullable();    // Optional description
            $table->decimal('price', 10, 2);            // Price
            $table->integer('stock')->default(0);       // Stock (for medicines/items, 0 for services)
            $table->enum('type', ['service','medicine','item']); // Type of entry
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('service_items');
    }
};
