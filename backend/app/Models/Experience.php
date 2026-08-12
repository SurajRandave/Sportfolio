<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    protected $guarded = ['id'];

    protected $appends = ['period', 'duration'];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'is_current' => 'boolean',
            'is_published' => 'boolean',
            'highlights' => 'array',
            'tech_stack' => 'array',
        ];
    }

    public function scopePublished(Builder $query): Builder
    {
        return $query->where('is_published', true);
    }

    public function scopeOrdered(Builder $query): Builder
    {
        return $query->orderBy('sort_order')->orderByDesc('start_date');
    }

    /** e.g. "Oct 2025 - Present" */
    public function getPeriodAttribute(): string
    {
        $start = $this->start_date?->format('M Y') ?? '';
        $end = $this->is_current ? 'Present' : ($this->end_date?->format('M Y') ?? 'Present');

        return trim("{$start} - {$end}");
    }

    /** e.g. "1 yr 2 mos" */
    public function getDurationAttribute(): string
    {
        if (! $this->start_date) {
            return '';
        }

        $end = $this->is_current ? now() : ($this->end_date ?? now());
        $months = $this->start_date->diffInMonths($end) + 1;

        $years = intdiv($months, 12);
        $remaining = $months % 12;

        $parts = [];
        if ($years > 0) {
            $parts[] = $years.' yr'.($years > 1 ? 's' : '');
        }
        if ($remaining > 0) {
            $parts[] = $remaining.' mo'.($remaining > 1 ? 's' : '');
        }

        return implode(' ', $parts) ?: '1 mo';
    }
}
