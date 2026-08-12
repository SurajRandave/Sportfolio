export function formatCurrency(
  amount: string | number | null,
  currency = 'INR',
): string | null {
  if (amount === null || amount === '') return null
  const value = typeof amount === 'string' ? Number.parseFloat(amount) : amount
  if (Number.isNaN(value)) return null

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatDate(value: string | null, withDay = false): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'short',
    ...(withDay ? { day: 'numeric' } : {}),
  }).format(date)
}

export function formatDateTime(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

/** "3 minutes ago" style stamps for the live enquiry feed. */
export function timeAgo(value: string | null): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''

  const seconds = Math.round((Date.now() - date.getTime()) / 1000)
  if (seconds < 60) return 'just now'

  const formatter = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const divisions: [Intl.RelativeTimeFormatUnit, number][] = [
    ['minute', 60],
    ['hour', 3600],
    ['day', 86400],
    ['week', 604800],
    ['month', 2592000],
    ['year', 31536000],
  ]

  // Largest unit whose threshold the elapsed time has passed.
  let unit = divisions[0]
  for (const division of divisions) {
    if (seconds >= division[1]) unit = division
  }

  return formatter.format(-Math.floor(seconds / unit[1]), unit[0])
}

/** Stable per-browser id so "active visitors" counts people, not page views. */
export function sessionId(): string {
  const key = 'portfolio_session_id'
  let id = sessionStorage.getItem(key)
  if (!id) {
    id = crypto.randomUUID()
    sessionStorage.setItem(key, id)
  }
  return id
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}
