<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;

class ContactMessage extends Model
{
    public const STATUSES = ['new', 'read', 'replied', 'archived'];

    protected $guarded = ['id'];

    protected function casts(): array
    {
        return [
            'is_starred' => 'boolean',
            'read_at' => 'datetime',
            'replied_at' => 'datetime',
        ];
    }

    public function scopeUnread(Builder $query): Builder
    {
        return $query->where('status', 'new');
    }

    public function markAsRead(): void
    {
        if ($this->status === 'new') {
            $this->forceFill(['status' => 'read', 'read_at' => now()])->save();
        }
    }
}
