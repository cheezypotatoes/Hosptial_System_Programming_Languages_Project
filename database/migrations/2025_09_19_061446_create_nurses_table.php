<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('nurses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // links to users
            $table->string('assigned_to')->nullable(); // the assignment
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('nurses');
    }
};
