<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Which part of the uploaded photo survives the hero's circular crop.
     * Stored as a CSS object-position value. Defaults to 'top', which is what
     * the hero was hardcoded to before this was configurable.
     */
    public function up(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->string('avatar_position', 20)->default('top')->after('avatar_path');
        });
    }

    public function down(): void
    {
        Schema::table('profiles', function (Blueprint $table) {
            $table->dropColumn('avatar_position');
        });
    }
};
