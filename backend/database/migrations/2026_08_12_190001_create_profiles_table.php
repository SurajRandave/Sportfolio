<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->string('full_name');
            $table->string('headline');
            $table->string('tagline')->nullable();
            $table->text('summary');
            $table->string('location')->nullable();
            $table->string('email');
            $table->string('phone')->nullable();
            $table->string('linkedin_url')->nullable();
            $table->string('github_url')->nullable();
            $table->string('resume_path')->nullable();
            $table->string('avatar_path')->nullable();
            $table->unsignedSmallInteger('years_experience')->default(0);
            $table->boolean('is_available_for_freelance')->default(true);
            $table->string('availability_note')->nullable();
            $table->string('meta_title')->nullable();
            $table->string('meta_description')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('profiles');
    }
};
