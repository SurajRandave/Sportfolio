<?php

namespace App\Events;

use App\Models\ContactMessage;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

/**
 * Pushed to the admin dashboard the instant a visitor submits the contact form.
 *
 * ShouldBroadcastNow (rather than ShouldBroadcast) so the message appears
 * without a queue worker having to be running.
 */
class EnquiryReceived implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(public ContactMessage $message) {}

    /**
     * @return array<int, PrivateChannel>
     */
    public function broadcastOn(): array
    {
        return [new PrivateChannel('admin')];
    }

    public function broadcastAs(): string
    {
        return 'enquiry.received';
    }

    /**
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'id' => $this->message->id,
            'name' => $this->message->name,
            'email' => $this->message->email,
            'subject' => $this->message->subject,
            'message' => $this->message->message,
            'enquiry_type' => $this->message->enquiry_type,
            'budget_range' => $this->message->budget_range,
            'status' => $this->message->status,
            'created_at' => $this->message->created_at?->toIso8601String(),
        ];
    }
}
