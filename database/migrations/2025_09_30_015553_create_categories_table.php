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
        // Drop table if it exists to avoid conflicts
        if (Schema::hasTable('categories')) {
            Schema::drop('categories');
        }

        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // Category name (Service, Medicine, Supplies)
            $table->text('description')->nullable(); // Optional description
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
