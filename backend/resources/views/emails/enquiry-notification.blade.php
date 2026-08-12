@extends('emails.layout')

@section('subject', 'New '.$enquiry->enquiry_type.' enquiry from '.$enquiry->name)

@section('preheader')
    {{ $enquiry->name }}{{ $enquiry->company ? ' at '.$enquiry->company : '' }} —
    {{ \Illuminate\Support\Str::limit($enquiry->message, 90) }}
@endsection

@section('content')
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
            <td style="font-family:Arial,Helvetica,sans-serif;">

                <div style="display:inline-block; background-color:#fef3c7; color:#92400e; font-size:11px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; padding:5px 10px; border-radius:20px;">
                    {{ $enquiry->enquiry_type }} enquiry
                </div>

                <h1 style="margin:16px 0 6px 0; font-size:22px; line-height:30px; font-weight:bold; color:#1c1917;">
                    New message from {{ $enquiry->name }}
                </h1>

                <p style="margin:0 0 24px 0; font-size:14px; line-height:22px; color:#78716c;">
                    Received {{ $enquiry->created_at->format('d M Y \a\t g:i A') }} via your portfolio contact form.
                </p>

                {{-- Sender details --}}
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fafaf9; border:1px solid #e7e5e4; border-radius:10px;">
                    @foreach ([
                        'Name' => $enquiry->name,
                        'Email' => $enquiry->email,
                        'Phone' => $enquiry->phone,
                        'Company' => $enquiry->company,
                        'Budget' => $enquiry->budget_range,
                        'Timeline' => $enquiry->timeline,
                    ] as $label => $value)
                        @if (! empty($value))
                            <tr>
                                <td style="padding:11px 16px; font-family:Arial,Helvetica,sans-serif; font-size:12px; color:#a8a29e; width:96px; vertical-align:top; border-bottom:1px solid #f0efee;">
                                    {{ $label }}
                                </td>
                                <td style="padding:11px 16px; font-family:Arial,Helvetica,sans-serif; font-size:14px; color:#1c1917; vertical-align:top; border-bottom:1px solid #f0efee;">
                                    @if ($label === 'Email')
                                        <a href="mailto:{{ $value }}" style="color:#b45309; text-decoration:none;">{{ $value }}</a>
                                    @elseif ($label === 'Phone')
                                        <a href="tel:{{ $value }}" style="color:#b45309; text-decoration:none;">{{ $value }}</a>
                                    @else
                                        {{ $value }}
                                    @endif
                                </td>
                            </tr>
                        @endif
                    @endforeach
                </table>

                {{-- The message --}}
                @if ($enquiry->subject)
                    <h2 style="margin:28px 0 8px 0; font-size:16px; line-height:24px; font-weight:bold; color:#1c1917;">
                        {{ $enquiry->subject }}
                    </h2>
                @else
                    <h2 style="margin:28px 0 8px 0; font-size:13px; letter-spacing:1px; text-transform:uppercase; color:#a8a29e;">
                        Message
                    </h2>
                @endif

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                        <td style="padding:16px 18px; background-color:#fffbeb; border-left:3px solid #f59e0b; border-radius:0 8px 8px 0; font-family:Arial,Helvetica,sans-serif; font-size:15px; line-height:24px; color:#292524; white-space:pre-wrap;">{{ $enquiry->message }}</td>
                    </tr>
                </table>

                {{-- Actions --}}
                <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:28px;">
                    <tr>
                        <td style="border-radius:8px; background-color:#f59e0b;">
                            <a href="mailto:{{ $enquiry->email }}?subject={{ rawurlencode('Re: '.($enquiry->subject ?: 'Your enquiry')) }}"
                               style="display:inline-block; padding:13px 24px; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; color:#0c0a09; text-decoration:none; border-radius:8px;">
                                Reply to {{ \Illuminate\Support\Str::before($enquiry->name, ' ') }}
                            </a>
                        </td>
                        <td style="padding-left:10px;">
                            <a href="{{ $dashboardUrl }}"
                               style="display:inline-block; padding:12px 22px; font-family:Arial,Helvetica,sans-serif; font-size:14px; font-weight:bold; color:#57534e; text-decoration:none; border:1px solid #e7e5e4; border-radius:8px;">
                                Open dashboard
                            </a>
                        </td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>
@endsection

@section('footer')
    You are receiving this because someone submitted your portfolio contact form.
    Reply directly to this email and it will go straight to {{ $enquiry->name }}.
@endsection
