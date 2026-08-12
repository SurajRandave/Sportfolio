<?php

namespace App\Events;

use App\Models\Visit;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Drives the live visitor counter on the admin dashboard.
 */
class VisitorRecorded implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public Visit $visit,
        public int $todayCount,
        public int $activeNow,
    ) {}

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('admin')];
    }

    public function broadcastAs(): string
    {
        return 'visitor.recorded';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'path' => $this->visit->path,
            'device' => $this->visit->device,
            'referrer' => $this->visit->referrer,
            'today_count' => $this->todayCount,
            'active_now' => $this->activeNow,
            'at' => $this->visit->created_at?->toIso8601String(),
        ];
    }
}
