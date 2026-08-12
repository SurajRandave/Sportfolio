@extends('emails.layout')

@section('subject', 'Thanks for getting in touch, '.$firstName)

@section('preheader')
    Your message reached {{ $profileName }}. Expect a reply within 24 hours.
@endsection

@section('content')
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="font-family:Arial,Helvetica,sans-serif;">

                <h1 style="margin:0 0 16px 0; font-size:24px; line-height:32px; font-weight:bold; color:#1c1917;">
                    Thank you, {{ $firstName }}.
                </h1>

                <p style="margin:0 0 16px 0; font-size:15px; line-height:25px; color:#44403c;">
                    Your message has arrived and I have read it. I reply to every genuine enquiry
                    personally, usually <strong style="color:#1c1917;">within 24 hours</strong> on
                    working days.
                </p>

                @if ($enquiry->enquiry_type === 'freelance')
                    <p style="margin:0 0 24px 0; font-size:15px; line-height:25px; color:#44403c;">
                        Since this is a project enquiry, my reply will include some initial questions
                        about scope, a realistic timeline, and an honest view of whether I am the
                        right person to build it.
                    </p>
                @elseif ($enquiry->enquiry_type === 'hire')
                    <p style="margin:0 0 24px 0; font-size:15px; line-height:25px; color:#44403c;">
                        Thanks for considering me for a role. I will come back to you with my
                        availability and current notice period.
                    </p>
                @else
                    <p style="margin:0 0 24px 0; font-size:15px; line-height:25px; color:#44403c;">
                        In the meantime, feel free to reply to this email if anything else comes to mind.
                    </p>
                @endif

                {{-- Copy of what they sent, so they have a record --}}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafaf9; border:1px solid #e7e5e4; border-radius:10px;">
                    <tr>
                        <td style="padding:18px 20px;">
                            <div style="font-family:Arial,Helvetica,sans-serif; font-size:11px; letter-spacing:1px; text-transform:uppercase; color:#a8a29e; padding-bottom:10px;">
                                Your message
                            </div>

                            @if ($enquiry->subject)
                                <div style="font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:bold; color:#1c1917; padding-bottom:8px;">
                                    {{ $enquiry->subject }}
                                </div>
                            @endif

                            <div style="font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:23px; color:#57534e; white-space:pre-wrap;">{{ $enquiry->message }}</div>

                            <div style="font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#a8a29e; padding-top:14px;">
                                Sent {{ $enquiry->created_at->format('d M Y \a\t g:i A') }}
                            </div>
                        </td>
                    </tr>
                </table>

                {{-- Where to go next --}}
                <p style="margin:28px 0 12px 0; font-family:Arial,Helvetica,sans-serif; font-size:13px; letter-spacing:1px; text-transform:uppercase; color:#a8a29e;">
                    While you wait
                </p>

                <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        @if ($portfolioUrl)
                            <td style="border-radius:8px; background-color:#f59e0b;">
                                <a href="{{ $portfolioUrl }}#projects"
                                   style="display:inline-block; padding:13px 24px; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; color:#0c0a09; text-decoration:none; border-radius:8px;">
                                    See my recent work
                                </a>
                            </td>
                        @endif
                        @if ($githubUrl)
                            <td style="padding-left:10px;">
                                <a href="{{ $githubUrl }}"
                                   style="display:inline-block; padding:12px 22px; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; color:#57534e; text-decoration:none; border:1px solid #e7e5e4; border-radius:8px;">
                                    GitHub
                                </a>
                            </td>
                        @endif
                    </tr>
                </table>

                <p style="margin:28px 0 0 0; font-size:15px; line-height:25px; color:#44403c;">
                    Speak soon,<br />
                    <strong style="color:#1c1917;">{{ $profileName }}</strong><br />
                    <span style="font-size:13px; color:#78716c;">
                        Full-Stack Developer &mdash; Laravel, React.js &amp; TypeScript
                    </span>
                </p>

            </td>
        </tr>
    </table>
@endsection

@section('footer')
    This is an automatic confirmation that your message was received &mdash;
    a personal reply is on its way. You can reply to this email directly.
@endsection
