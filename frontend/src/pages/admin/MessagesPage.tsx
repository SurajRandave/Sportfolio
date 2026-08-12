import { useCallback, useEffect, useState } from 'react'
import {
  Archive,
  Building2,
  CornerUpLeft,
  Loader2,
  Mail,
  Phone,
  Search,
  Star,
  Trash2,
} from 'lucide-react'
import { Badge, EmptyState, PageHeader, Toast, inputClass } from '@/components/admin/ui'
import { api, errorMessage } from '@/lib/api'
import { getEcho } from '@/lib/echo'
import { cn, formatDateTime, timeAgo } from '@/lib/format'
import type { ContactMessage, MessageStatus, Paginated } from '@/lib/types'

const FILTERS: { value: MessageStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'Unread' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
]

export function MessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [selected, setSelected] = useState<ContactMessage | null>(null)
  const [filter, setFilter] = useState<MessageStatus | 'all'>('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)

  const notify = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    api
      .get<Paginated<ContactMessage>>('/admin/messages', {
        params: {
          ...(filter !== 'all' ? { status: filter } : {}),
          ...(search ? { search } : {}),
          per_page: 50,
        },
      })
      .then(({ data }) => setMessages(data.data))
      .catch((error) => notify(errorMessage(error, 'Could not load messages.'), 'error'))
      .finally(() => setLoading(false))
  }, [filter, search, notify])

  // Debounce the search box so typing doesn't hammer the API.
  useEffect(() => {
    const timer = setTimeout(load, search ? 350 : 0)
    return () => clearTimeout(timer)
  }, [load, search])

  // New enquiries drop straight into the list without a refresh.
  useEffect(() => {
    const channel = getEcho().private('admin')

    channel.listen('.enquiry.received', (payload: ContactMessage) => {
      setMessages((prev) => (prev.some((m) => m.id === payload.id) ? prev : [payload, ...prev]))
      notify(`New enquiry from ${payload.name}`)
    })

    return () => {
      getEcho().leave('private-admin')
    }
  }, [notify])

  async function open(message: ContactMessage) {
    setSelected(message)

    // Opening marks it read server-side; mirror that locally.
    if (message.status === 'new') {
      try {
        const { data } = await api.get<{ data: ContactMessage }>(`/admin/messages/${message.id}`)
        setSelected(data.data)
        setMessages((prev) => prev.map((m) => (m.id === data.data.id ? data.data : m)))
      } catch {
        // Non-critical - the message body is already on screen.
      }
    }
  }

  async function patch(message: ContactMessage, changes: Partial<ContactMessage>) {
    try {
      const { data } = await api.patch<{ data: ContactMessage }>(
        `/admin/messages/${message.id}`,
        changes,
      )
      setMessages((prev) => prev.map((m) => (m.id === data.data.id ? data.data : m)))
      if (selected?.id === data.data.id) setSelected(data.data)
      notify('Message updated.')
    } catch (error) {
      notify(errorMessage(error, 'Update failed.'), 'error')
    }
  }

  async function remove(message: ContactMessage) {
    if (!window.confirm('Delete this message permanently?')) return

    try {
      await api.delete(`/admin/messages/${message.id}`)
      setMessages((prev) => prev.filter((m) => m.id !== message.id))
      if (selected?.id === message.id) setSelected(null)
      notify('Message deleted.')
    } catch (error) {
      notify(errorMessage(error, 'Delete failed.'), 'error')
    }
  }

  const statusTone = (status: MessageStatus) =>
    status === 'new' ? 'warning' : status === 'replied' ? 'success' : 'neutral'

  return (
    <>
      <PageHeader
        title="Inbox"
        description="Enquiries from the contact form, arriving live over websockets."
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFilter(option.value)}
              className={cn(
                'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
                filter === option.value
                  ? 'border-brand-500 bg-brand-500/15 text-brand-200'
                  : 'border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-200',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="relative ml-auto w-full sm:w-64">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-500"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, message"
            className={cn(inputClass, 'pl-9')}
          />
        </div>
      </div>

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 size={24} className="animate-spin text-brand-400" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState message="No messages match this view." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-[22rem_1fr]">
          <ul className="panel max-h-[38rem] divide-y divide-ink-800/60 overflow-y-auto rounded-xl">
            {messages.map((message) => (
              <li key={message.id}>
                <button
                  type="button"
                  onClick={() => open(message)}
                  className={cn(
                    'w-full px-4 py-3.5 text-left transition-colors hover:bg-ink-900/60',
                    selected?.id === message.id && 'bg-ink-900/80',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        'truncate text-sm',
                        message.status === 'new'
                          ? 'font-semibold text-ink-100'
                          : 'text-ink-200',
                      )}
                    >
                      {message.name}
                    </span>
                    <span className="shrink-0 font-mono text-[0.65rem] text-ink-500">
                      {timeAgo(message.created_at)}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-xs text-ink-500">
                    {message.subject || message.message}
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    <Badge tone={statusTone(message.status)}>{message.status}</Badge>
                    <Badge>{message.enquiry_type}</Badge>
                    {message.is_starred && (
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                    )}
                  </div>
                </button>
              </li>
            ))}
          </ul>

          {selected ? (
            <article className="panel rounded-xl p-6">
              <header className="flex flex-wrap items-start justify-between gap-4 border-b border-ink-800 pb-5">
                <div>
                  <h2 className="text-lg font-semibold text-ink-100">{selected.name}</h2>
                  <div className="mt-2 space-y-1.5 text-sm">
                    <a
                      href={`mailto:${selected.email}`}
                      className="flex items-center gap-2 text-brand-300 hover:underline"
                    >
                      <Mail size={14} />
                      {selected.email}
                    </a>
                    {selected.phone && (
                      <a
                        href={`tel:${selected.phone}`}
                        className="flex items-center gap-2 text-ink-300 hover:text-ink-100"
                      >
                        <Phone size={14} />
                        {selected.phone}
                      </a>
                    )}
                    {selected.company && (
                      <p className="flex items-center gap-2 text-ink-300">
                        <Building2 size={14} />
                        {selected.company}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => patch(selected, { is_starred: !selected.is_starred })}
                    aria-label="Star"
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-amber-300"
                  >
                    <Star
                      size={16}
                      className={selected.is_starred ? 'fill-amber-400 text-amber-400' : ''}
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => patch(selected, { status: 'archived' })}
                    aria-label="Archive"
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100"
                  >
                    <Archive size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(selected)}
                    aria-label="Delete"
                    className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </header>

              <dl className="grid gap-4 border-b border-ink-800 py-5 sm:grid-cols-4">
                {[
                  { label: 'Type', value: selected.enquiry_type },
                  { label: 'Budget', value: selected.budget_range },
                  { label: 'Timeline', value: selected.timeline },
                  { label: 'Received', value: formatDateTime(selected.created_at) },
                ]
                  .filter((row) => row.value)
                  .map((row) => (
                    <div key={row.label}>
                      <dt className="text-xs uppercase tracking-wide text-ink-500">
                        {row.label}
                      </dt>
                      <dd className="mt-1 text-sm text-ink-100">{row.value}</dd>
                    </div>
                  ))}
              </dl>

              {selected.subject && (
                <h3 className="mt-5 text-sm font-semibold text-ink-100">{selected.subject}</h3>
              )}

              <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink-200">
                {selected.message}
              </p>

              <div className="mt-6 flex flex-wrap gap-3 border-t border-ink-800 pt-5">
                <a
                  href={`mailto:${selected.email}?subject=${encodeURIComponent(
                    `Re: ${selected.subject || 'Your enquiry'}`,
                  )}`}
                  onClick={() => patch(selected, { status: 'replied' })}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
                >
                  <CornerUpLeft size={15} />
                  Reply by email
                </a>

                <select
                  value={selected.status}
                  onChange={(e) => patch(selected, { status: e.target.value as MessageStatus })}
                  className={cn(inputClass, 'w-auto')}
                >
                  {FILTERS.filter((f) => f.value !== 'all').map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </article>
          ) : (
            <EmptyState message="Select a message to read it." />
          )}
        </div>
      )}

      {toast && <Toast message={toast.message} tone={toast.tone} />}
    </>
  )
}
