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
use Illuminate\Support\Str;

/**
 * Auto-reply sent to the visitor confirming their message arrived.
 */
class EnquiryConfirmation extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public ContactMessage $message) {}

    public function envelope(): Envelope
    {
        $profile = Profile::current();
        $firstName = Str::before($this->message->name, ' ');

        return new Envelope(
            subject: "Thanks for getting in touch, {$firstName}",
            // Replies land in Suraj's real inbox, not a no-reply void.
            replyTo: array_filter([
                $profile?->email
                    ? new Address($profile->email, $profile->full_name)
                    : null,
            ]),
            tags: ['enquiry-confirmation'],
        );
    }

    public function content(): Content
    {
        $profile = Profile::current();

        return new Content(
            view: 'emails.enquiry-confirmation',
            with: [
                // NOT 'message' - Laravel injects its own $message (the
                // Illuminate\Mail\Message instance) into every mail view.
                'enquiry' => $this->message,
                'firstName' => Str::before($this->message->name, ' ') ?: $this->message->name,
                'profileName' => $profile?->full_name ?? 'Suraj Randave',
                'profileLocation' => $profile?->location,
                'portfolioUrl' => rtrim(config('app.frontend_url'), '/'),
                'githubUrl' => $profile?->github_url,
            ],
        );
    }
}
