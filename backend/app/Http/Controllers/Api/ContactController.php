<?php

namespace App\Http\Controllers\Api;

use App\Events\EnquiryReceived;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreContactMessageRequest;
use App\Mail\EnquiryConfirmation;
use App\Mail\EnquiryNotification;
use App\Models\ContactMessage;
use App\Models\Profile;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(StoreContactMessageRequest $request): JsonResponse
    {
        $message = ContactMessage::create([
            ...$request->safe()->except('website'),
            'enquiry_type' => $request->input('enquiry_type', 'other'),
            'status' => 'new',
            'ip_address' => $request->ip(),
            'user_agent' => $request->userAgent(),
        ]);

        // Straight to the admin dashboard over Reverb - no refresh needed.
        EnquiryReceived::dispatch($message);

        // Two Gmail SMTP handshakes take ~12s, so the emails are queued rather
        // than sent inline - the visitor gets their confirmation immediately.
        // Requires a worker: php artisan queue:work
        $this->queueEmails($message);

        return response()->json([
            'message' => "Thanks {$message->name}, your message is with me. I've sent a confirmation to {$message->email} and I usually reply within 24 hours.",
            'data' => ['id' => $message->id],
        ], 201);
    }

    /**
     * Queue the notification to Suraj and the acknowledgement to the sender.
     *
     * Deliberately never allowed to fail the request: the enquiry is already
     * saved and broadcast at this point, so a queue or mail problem must not
     * cost us the lead. Failures are logged and the message still lands in the
     * dashboard inbox regardless.
     */
    protected function queueEmails(ContactMessage $message): void
    {
        $adminEmail = Profile::current()?->email ?? config('mail.from.address');

        try {
            if ($adminEmail) {
                Mail::to($adminEmail)->queue(new EnquiryNotification($message));
            }
        } catch (\Throwable $e) {
            Log::error('Could not queue enquiry notification', [
                'contact_message_id' => $message->id,
                'error' => $e->getMessage(),
            ]);
        }

        try {
            Mail::to($message->email, $message->name)->queue(new EnquiryConfirmation($message));
        } catch (\Throwable $e) {
            Log::error('Could not queue enquiry confirmation', [
                'contact_message_id' => $message->id,
                'recipient' => $message->email,
                'error' => $e->getMessage(),
            ]);
        }
    }
}
