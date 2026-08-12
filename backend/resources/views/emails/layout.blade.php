{{--
    Shared shell for both transactional emails.

    Email clients are not browsers: no external stylesheets, no flexbox/grid,
    no <style> support in Outlook. Everything here is table-based layout with
    inline styles, which is the only combination that renders reliably in
    Gmail, Outlook, Apple Mail and mobile clients alike.
--}}
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="x-apple-disable-message-reformatting" />
    <title>@yield('subject', 'Suraj Randave')</title>
</head>
<body style="margin:0; padding:0; width:100%; background-color:#f5f5f4; -webkit-font-smoothing:antialiased;">

    {{-- Preheader: the grey preview line in the inbox list. Hidden in the body. --}}
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent; height:0; width:0;">
        @yield('preheader')
        &nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;
    </div>

    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f5f5f4;">
        <tr>
            <td align="center" style="padding:32px 16px;">

                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px; width:100%;">

                    {{-- Header --}}
                    <tr>
                        <td style="padding:0 0 24px 0;">
                            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="width:44px; height:44px; background-color:#f59e0b; border-radius:10px; text-align:center; vertical-align:middle; font-family:'Courier New',Courier,monospace; font-size:16px; font-weight:bold; color:#0c0a09;">
                                        SR
                                    </td>
                                    <td style="padding-left:12px; font-family:Arial,Helvetica,sans-serif; font-size:15px; font-weight:bold; color:#1c1917;">
                                        {{ $profileName ?? 'Suraj Randave' }}
                                        <div style="font-size:12px; font-weight:normal; color:#78716c; padding-top:2px;">
                                            Full-Stack Developer
                                        </div>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    {{-- Card --}}
                    <tr>
                        <td style="background-color:#ffffff; border:1px solid #e7e5e4; border-radius:14px; overflow:hidden;">

                            {{-- Amber accent bar --}}
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="height:4px; background-color:#f59e0b; font-size:0; line-height:0;">&nbsp;</td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td style="padding:32px;">
                                        @yield('content')
                                    </td>
                                </tr>
                            </table>

                        </td>
                    </tr>

                    {{-- Footer --}}
                    <tr>
                        <td style="padding:24px 8px 0 8px; font-family:Arial,Helvetica,sans-serif; font-size:12px; line-height:20px; color:#a8a29e;">
                            @yield('footer')
                            <div style="padding-top:10px;">
                                &copy; {{ date('Y') }} {{ $profileName ?? 'Suraj Randave' }}
                                @if (! empty($profileLocation))
                                    &nbsp;&middot;&nbsp; {{ $profileLocation }}
                                @endif
                            </div>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>

</body>
</html>
