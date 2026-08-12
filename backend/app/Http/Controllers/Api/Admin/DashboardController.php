<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\ContactMessage;
use App\Models\Project;
use App\Models\Testimonial;
use App\Models\Visit;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function __invoke(): JsonResponse
    {
        return response()->json([
            'cards' => [
                'unread_messages' => ContactMessage::unread()->count(),
                'total_messages' => ContactMessage::count(),
                'published_projects' => Project::published()->count(),
                'pending_testimonials' => Testimonial::where('is_approved', false)->count(),
                'visits_today' => Visit::whereDate('created_at', today())->count(),
                'visits_total' => Visit::count(),
                'active_now' => Visit::where('created_at', '>=', now()->subMinutes(5))
                    ->distinct('session_id')->count('session_id'),
            ],
            'visits_last_14_days' => $this->visitsPerDay(14),
            'top_pages' => Visit::select('path', DB::raw('count(*) as total'))
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('path')
                ->orderByDesc('total')
                ->limit(6)
                ->get(),
            'devices' => Visit::select('device', DB::raw('count(*) as total'))
                ->where('created_at', '>=', now()->subDays(30))
                ->groupBy('device')
                ->get(),
            'recent_messages' => ContactMessage::latest()->limit(6)->get(),
            'most_viewed_projects' => Project::published()
                ->orderByDesc('view_count')
                ->limit(5)
                ->get(['id', 'title', 'slug', 'view_count']),
            // whereHas, not having() - PostgreSQL cannot reference a select
            // alias in HAVING the way MySQL can. ORDER BY on the alias is fine.
            'top_short_links' => Project::published()
                ->withCount('shortLinkClicks')
                ->whereHas('shortLinkClicks')
                ->orderByDesc('short_link_clicks_count')
                ->limit(5)
                ->get(['id', 'title', 'slug', 'short_code']),
        ]);
    }

    /**
     * Zero-filled daily series so the chart never has gaps.
     *
     * @return array<int, array{date: string, total: int}>
     */
    protected function visitsPerDay(int $days): array
    {
        $counts = Visit::select(DB::raw('date(created_at) as day'), DB::raw('count(*) as total'))
            ->where('created_at', '>=', now()->subDays($days - 1)->startOfDay())
            ->groupBy('day')
            ->pluck('total', 'day');

        return collect(range($days - 1, 0))
            ->map(function (int $ago) use ($counts) {
                $date = now()->subDays($ago)->toDateString();

                return ['date' => $date, 'total' => (int) ($counts[$date] ?? 0)];
            })
            ->all();
    }
}
