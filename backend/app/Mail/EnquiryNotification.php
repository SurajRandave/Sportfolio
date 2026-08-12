<?php

namespace App\Mail;

use App\Models\ContactMessage;
use App\Models\Profile;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * Sent to Suraj when a visitor submits the contact form.
 */
class EnquiryNotification extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $message) {}

    public function envelope(): Envelope
    {
        $type = ucfirst($this->message->enquiry_type);

        return new Envelope(
            subject: "{$type} enquiry from {$this->message->name}",
            // Hitting reply in any mail client answers the visitor directly.
            replyTo: [new Address($this->message->email, $this->message->name)],
            tags: ['enquiry'],
        );
    }

    public function content(): Content
    {
        $profile = Profile::current();

        return new Content(
            view: 'emails.enquiry-notification',
            with: [
                // NOT 'message' - Laravel injects its own $message (the
                // Illuminate\Mail\Message instance) into every mail view.
                'enquiry' => $this->message,
                'profileName' => $profile?->full_name ?? 'Suraj Randave',
                'profileLocation' => $profile?->location,
                'dashboardUrl' => rtrim(config('app.frontend_url'), '/').'/admin/messages',
            ],
        );
    }
}
