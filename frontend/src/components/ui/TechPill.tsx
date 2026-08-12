import { cn } from '@/lib/format'

export function TechPill({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-ink-700/70 bg-ink-800/60 px-3 py-1 font-mono text-xs text-ink-200',
        className,
      )}
    >
      {label}
    </span>
  )
}
