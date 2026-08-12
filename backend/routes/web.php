<?php

use App\Http\Controllers\ShortLinkController;
use App\Mail\EnquiryConfirmation;
use App\Mail\EnquiryNotification;
use App\Models\ContactMessage;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect(config('app.frontend_url'));
});

/*
|--------------------------------------------------------------------------
| Short share links
|--------------------------------------------------------------------------
|
| /p/{code} redirects to a project case study and records the click, so a
| link pasted into a CV or LinkedIn message is short and measurable.
|
*/
Route::get('/p/{code}', ShortLinkController::class)
    ->where('code', '[a-z0-9]{4,12}')
    ->middleware('throttle:120,1')
    ->name('short-link');

/*
|--------------------------------------------------------------------------
| Email template preview (local only)
|--------------------------------------------------------------------------
|
| Renders the transactional emails in the browser so the templates can be
| tweaked without sending anything. Uses the most recent real enquiry, or a
| realistic dummy if the inbox is empty.
|
|   /preview/email/notification   what Suraj receives
|   /preview/email/confirmation   what the visitor receives
|
*/
if (app()->environment('local')) {
    $sample = function (): ContactMessage {
        return ContactMessage::latest()->first() ?? new ContactMessage([
            'name' => 'Ananya Kulkarni',
            'email' => 'ananya@example.com',
            'phone' => '+91-98220 11223',
            'company' => 'BrightStitch Apparel',
            'subject' => 'E-commerce dashboard with live order tracking',
            'message' => "Hi Suraj,\n\nWe need an admin dashboard where our team can see orders in real time. Can you take this on?",
            'enquiry_type' => 'freelance',
            'budget_range' => '₹75k - ₹2L',
            'timeline' => '8 weeks',
            'created_at' => now(),
        ]);
    };

    Route::get('/preview/email/notification', fn () => new EnquiryNotification($sample()));
    Route::get('/preview/email/confirmation', fn () => new EnquiryConfirmation($sample()));
}
