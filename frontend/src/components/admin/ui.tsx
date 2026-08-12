import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/format'

export const inputClass =
  'w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500'

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-xl font-semibold text-ink-100">{title}</h1>
        {description && <p className="mt-1 text-sm text-ink-400">{description}</p>}
      </div>
      {action}
    </div>
  )
}

export function Modal({
  open,
  title,
  onClose,
  children,
  wide,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
}) {
  // Close on Escape and lock background scroll while open.
  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'mx-auto my-8 rounded-xl border border-ink-700 bg-ink-950 shadow-2xl',
          wide ? 'max-w-3xl' : 'max-w-xl',
        )}
      >
        <div className="flex items-center justify-between border-b border-ink-800 px-6 py-4">
          <h2 className="text-base font-semibold text-ink-100">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-lg p-1.5 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}

export function Toast({ message, tone }: { message: string; tone: 'success' | 'error' }) {
  return (
    <div
      role="status"
      className={cn(
        'fixed bottom-5 right-5 z-[60] rounded-lg border px-4 py-3 text-sm shadow-xl',
        tone === 'success'
          ? 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200'
          : 'border-rose-500/30 bg-rose-500/15 text-rose-200',
      )}
    >
      {message}
    </div>
  )
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="panel rounded-xl px-6 py-14 text-center text-sm text-ink-400">
      {message}
    </div>
  )
}

export function Badge({
  children,
  tone = 'neutral',
}: {
  children: ReactNode
  tone?: 'neutral' | 'success' | 'warning' | 'brand'
}) {
  const tones = {
    neutral: 'border-ink-700 bg-ink-800/60 text-ink-300',
    success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300',
    warning: 'border-amber-500/30 bg-amber-500/10 text-amber-300',
    brand: 'border-brand-500/30 bg-brand-500/10 text-brand-300',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs',
        tones[tone],
      )}
    >
      {children}
    </span>
  )
}
