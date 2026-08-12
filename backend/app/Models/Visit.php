<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Visit extends Model
{
    protected $guarded = ['id'];

    /**
     * Very small UA sniff - enough to split desktop/mobile/tablet on the
     * dashboard without pulling in a full device-detection package.
     */
    public static function deviceFromUserAgent(?string $userAgent): string
    {
        $ua = strtolower((string) $userAgent);

        return match (true) {
            str_contains($ua, 'ipad') || str_contains($ua, 'tablet') => 'tablet',
            str_contains($ua, 'mobi') || str_contains($ua, 'android') => 'mobile',
            $ua === '' => 'unknown',
            default => 'desktop',
        };
    }
}
