<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Project extends Model
{
    protected $guarded = ['id'];

    /** Characters that can't be confused when read aloud or typed from a CV. */
    private const CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';

    protected $appends = ['cover_image_url', 'short_url'];

    protected function casts(): array
    {
        return [
            'tech_stack' => 'array',
            'features' => 'array',
            'gallery' => 'array',
            'is_featured' => 'boolean',
            'is_published' => 'boolean',
            'completed_at' => 'date',
            'view_count' => 'integer',
        ];
    }

    protected static function booted(): void
    {
        static::saving(function (self $project) {
            if (blank($project->slug)) {
                $project->slug = static::uniqueSlug($project->title);
            }

            // Every project gets a permanent share code the moment it exists.
            if (blank($project->short_code)) {
                $project->short_code = static::generateShortCode();
            }
        });
    }

    /**
     * A short, unguessable, unambiguous code for share links (e.g. "k7mq3p").
     */
    public static function generateShortCode(int $length = 6): string
    {
        $alphabet = self::CODE_ALPHABET;
        $max = strlen($alphabet) - 1;

        do {
            $code = '';
            for ($i = 0; $i < $length; $i++) {
                $code .= $alphabet[random_int(0, $max)];
            }
        } while (static::where('short_code', $code)->exists());

        return $code;
    }

    protected static function uniqueSlug(string $title): string
    {
        $base = Str::slug($title) ?: 'project';
        $slug = $base;
        $i = 2;

        while (static::where('slug', $slug)->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    public function testimonials(): HasMany
    {
        return $this->hasMany(Testimonial::class);
    }

    public function shortLinkClicks(): HasMany
    {
        return $this->hasMany(ShortLinkClick::class);
    }

    /**
     * The shareable link. Points at the API host because that is what resolves
     * /p/{code} and records the click before redirecting to the case study.
     */
    public function getShortUrlAttribute(): ?string
    {
        return $this->short_code
            ? rtrim(config('app.url'), '/').'/p/'.$this->short_code
            : null;
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeFeatured(Builder $query): Builder
    {
        return $query->where('is_featured', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderByDesc('is_featured')
            ->orderBy('sort_order')
            ->orderByDesc('completed_at');
    }

    public function getCoverImageUrlAttribute(): ?string
    {
        if (! $this->cover_image) {
            return null;
        }

        return Str::startsWith($this->cover_image, ['http://', 'https://'])
            ? $this->cover_image
            : Storage::url($this->cover_image);
    }
}
