import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  Eye,
  Inbox,
  Loader2,
  MessageSquareQuote,
  Package,
  Radio,
  Users,
} from 'lucide-react'
import { PageHeader } from '@/components/admin/ui'
import { api } from '@/lib/api'
import { getEcho } from '@/lib/echo'
import { formatDate, timeAgo } from '@/lib/format'
import type { ContactMessage, DashboardPayload } from '@/lib/types'

interface LiveEvent {
  key: string
  kind: 'enquiry' | 'visit'
  label: string
  detail: string
  at: string
}

export function DashboardPage() {
  const [data, setData] = useState<DashboardPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [feed, setFeed] = useState<LiveEvent[]>([])
  const [liveCounts, setLiveCounts] = useState<{ today: number; active: number } | null>(null)

  useEffect(() => {
    api
      .get<DashboardPayload>('/admin/dashboard')
      .then(({ data }) => setData(data))
      .finally(() => setLoading(false))
  }, [])

  // Live feed over Reverb. Both events ride the private 'admin' channel.
  useEffect(() => {
    const channel = getEcho().private('admin')

    channel.listen('.enquiry.received', (payload: ContactMessage) => {
      setFeed((prev) =>
        [
          {
            key: `enquiry-${payload.id}`,
            kind: 'enquiry' as const,
            label: `New enquiry from ${payload.name}`,
            detail: payload.subject || payload.message.slice(0, 90),
            at: payload.created_at,
          },
          ...prev,
        ].slice(0, 12),
      )

      setData((prev) =>
        prev
          ? {
              ...prev,
              cards: {
                ...prev.cards,
                unread_messages: prev.cards.unread_messages + 1,
                total_messages: prev.cards.total_messages + 1,
              },
              recent_messages: [payload, ...prev.recent_messages].slice(0, 6),
            }
          : prev,
      )
    })

    channel.listen(
      '.visitor.recorded',
      (payload: {
        path: string
        device: string
        referrer: string | null
        today_count: number
        active_now: number
        at: string
      }) => {
        setLiveCounts({ today: payload.today_count, active: payload.active_now })
        setFeed((prev) =>
          [
            {
              key: `visit-${payload.at}-${payload.path}`,
              kind: 'visit' as const,
              label: `Visitor on ${payload.path}`,
              detail: `${payload.device}${payload.referrer ? ` · via ${payload.referrer}` : ''}`,
              at: payload.at,
            },
            ...prev,
          ].slice(0, 12),
        )
      },
    )

    return () => {
      getEcho().leave('private-admin')
    }
  }, [])

  if (loading || !data) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 size={26} className="animate-spin text-brand-400" />
      </div>
    )
  }

  const cards = [
    {
      label: 'Unread enquiries',
      value: data.cards.unread_messages,
      icon: Inbox,
      to: '/admin/messages',
      tone: data.cards.unread_messages > 0 ? 'text-amber-300' : 'text-ink-100',
    },
    {
      label: 'Active now',
      value: liveCounts?.active ?? data.cards.active_now,
      icon: Radio,
      tone: 'text-emerald-300',
    },
    {
      label: 'Visits today',
      value: liveCounts?.today ?? data.cards.visits_today,
      icon: Users,
      tone: 'text-ink-100',
    },
    {
      label: 'Total visits',
      value: data.cards.visits_total,
      icon: Eye,
      tone: 'text-ink-100',
    },
    {
      label: 'Published projects',
      value: data.cards.published_projects,
      icon: Package,
      to: '/admin/projects',
      tone: 'text-ink-100',
    },
    {
      label: 'Pending testimonials',
      value: data.cards.pending_testimonials,
      icon: MessageSquareQuote,
      to: '/admin/testimonials',
      tone: data.cards.pending_testimonials > 0 ? 'text-amber-300' : 'text-ink-100',
    },
  ]

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Live traffic and enquiries, pushed over websockets as they happen."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const content = (
            <div className="panel h-full rounded-xl p-5 transition-colors hover:border-ink-600">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wide text-ink-400">
                  {card.label}
                </span>
                <card.icon size={16} className="text-ink-500" />
              </div>
              <p className={`mt-3 text-3xl font-semibold ${card.tone}`}>{card.value}</p>
            </div>
          )

          return card.to ? (
            <Link key={card.label} to={card.to}>
              {content}
            </Link>
          ) : (
            <div key={card.label}>{content}</div>
          )
        })}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <section className="panel rounded-xl p-6">
          <h2 className="mb-5 text-sm font-semibold text-ink-100">Visits, last 14 days</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.visits_last_14_days}>
                {/* Recharts takes literal colours, so these mirror the amber
                    theme tokens in index.css rather than reading them. */}
                <defs>
                  <linearGradient id="visitFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#3a3532" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value: string) => formatDate(value, true).replace(/ \d{4}/, '')}
                  stroke="#a8a29e"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#a8a29e"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={{
                    background: '#17130f',
                    border: '1px solid #3a3532',
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                  labelFormatter={(value) => formatDate(String(value ?? ''), true)}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  name="Visits"
                  stroke="#fbbf24"
                  strokeWidth={2}
                  fill="url(#visitFill)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="panel rounded-xl p-6">
          <h2 className="mb-1 flex items-center gap-2 text-sm font-semibold text-ink-100">
            <Radio size={14} className="text-emerald-400" />
            Live activity
          </h2>
          <p className="mb-4 text-xs text-ink-500">
            Events appear here the moment they happen.
          </p>

          {feed.length === 0 ? (
            <p className="py-10 text-center text-xs text-ink-500">
              Waiting for activity. Open the public site in another tab to see it fill up.
            </p>
          ) : (
            <ul className="space-y-3">
              {feed.map((event) => (
                <li key={event.key} className="animate-fade-up border-l-2 border-ink-700 pl-3">
                  <p
                    className={`text-xs font-medium ${
                      event.kind === 'enquiry' ? 'text-amber-300' : 'text-ink-200'
                    }`}
                  >
                    {event.label}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">{event.detail}</p>
                  <p className="mt-0.5 font-mono text-[0.65rem] text-ink-600">
                    {timeAgo(event.at)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="panel rounded-xl p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink-100">Recent enquiries</h2>
          {data.recent_messages.length === 0 ? (
            <p className="py-8 text-center text-xs text-ink-500">No enquiries yet.</p>
          ) : (
            <ul className="space-y-3">
              {data.recent_messages.map((message) => (
                <li key={message.id}>
                  <Link
                    to="/admin/messages"
                    className="block rounded-lg px-3 py-2.5 transition-colors hover:bg-ink-900/60"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-sm text-ink-100">{message.name}</span>
                      <span className="font-mono text-[0.65rem] text-ink-500">
                        {timeAgo(message.created_at)}
                      </span>
                    </div>
                    <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">
                      {message.subject || message.message}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel rounded-xl p-6">
          <h2 className="mb-1 text-sm font-semibold text-ink-100">Share link clicks</h2>
          <p className="mb-4 text-xs text-ink-500">
            Traffic from the short links you paste into your CV or LinkedIn.
          </p>
          {data.top_short_links.length === 0 ? (
            <p className="py-8 text-center text-xs text-ink-500">
              No clicks yet. Copy a link from the Projects page and share it.
            </p>
          ) : (
            <ul className="space-y-2.5">
              {data.top_short_links.map((link) => (
                <li
                  key={link.id}
                  className="flex items-center justify-between gap-3 border-b border-ink-800/60 pb-2.5 last:border-0"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm text-ink-200">{link.title}</span>
                    <span className="font-mono text-[0.65rem] text-brand-400">
                      /p/{link.short_code}
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-xs text-ink-400">
                    {link.short_link_clicks_count}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="panel rounded-xl p-6">
          <h2 className="mb-4 text-sm font-semibold text-ink-100">Most viewed projects</h2>
          {data.most_viewed_projects.length === 0 ? (
            <p className="py-8 text-center text-xs text-ink-500">No project views yet.</p>
          ) : (
            <ul className="space-y-2.5">
              {data.most_viewed_projects.map((project) => (
                <li
                  key={project.id}
                  className="flex items-center justify-between gap-3 border-b border-ink-800/60 pb-2.5 last:border-0"
                >
                  <span className="text-sm text-ink-200">{project.title}</span>
                  <span className="font-mono text-xs text-ink-500">{project.view_count}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  )
}
