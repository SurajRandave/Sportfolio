<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('slug')->unique();
            // enterprise | client | freelance | personal
            $table->string('category')->default('client');
            $table->string('role')->nullable();
            $table->string('client_name')->nullable();
            $table->text('summary');
            $table->text('description')->nullable();
            $table->text('problem')->nullable();
            $table->text('solution')->nullable();
            $table->text('outcome')->nullable();
            $table->json('tech_stack')->nullable();
            $table->json('features')->nullable();
            $table->string('live_url')->nullable();
            $table->string('repo_url')->nullable();
            $table->string('cover_image')->nullable();
            $table->json('gallery')->nullable();
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->unsignedInteger('view_count')->default(0);
            $table->date('completed_at')->nullable();
            $table->timestamps();

            $table->index(['is_published', 'is_featured', 'sort_order']);
            $table->index('category');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
