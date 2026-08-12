<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Profile extends Model
{
    protected $guarded = ['id'];

    protected $appends = ['avatar_url', 'resume_url'];

    protected function casts(): array
    {
        return [
            'is_available_for_freelance' => 'boolean',
            'years_experience' => 'integer',
        ];
    }

    /**
     * The portfolio has exactly one profile row; this is the accessor the rest
     * of the app uses so nothing has to care about the id.
     */
    public static function current(): ?self
    {
        return static::query()->first();
    }

    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar_path ? Storage::url($this->avatar_path) : null;
    }

    public function getResumeUrlAttribute(): ?string
    {
        return $this->resume_path ? Storage::url($this->resume_path) : null;
    }
}
