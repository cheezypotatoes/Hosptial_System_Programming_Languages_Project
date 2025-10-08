<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
  public function up()
{
    Schema::table('appointments', function (Blueprint $table) {
        $table->decimal('balance', 10, 2)->default(0);
        $table->enum('status', ['pending','paid','failed'])->default('pending');
    });
}

public function down()
{
    Schema::table('appointments', function (Blueprint $table) {
        $table->dropColumn(['balance','status']);
    });
}

};
