<?php

use App\Models\Project;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('projects', function (Blueprint $table) {
            $table->string('short_code', 12)->nullable()->unique()->after('slug');
        });

        Schema::create('short_link_clicks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('referrer')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->string('device')->nullable();
            $table->timestamp('created_at')->nullable();

            $table->index(['project_id', 'created_at']);
        });

        // Backfill codes for projects that already exist.
        Project::whereNull('short_code')->get()->each(function (Project $project) {
            $project->forceFill(['short_code' => Project::generateShortCode()])->saveQuietly();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('short_link_clicks');

        Schema::table('projects', function (Blueprint $table) {
            $table->dropColumn('short_code');
        });
    }
};
