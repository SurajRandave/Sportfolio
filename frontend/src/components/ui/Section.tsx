import type { ReactNode } from 'react'
import { cn } from '@/lib/format'

interface SectionProps {
  id: string
  eyebrow?: string
  title: string
  description?: string
  children: ReactNode
  className?: string
}

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
}: SectionProps) {
  return (
    // Both neighbours contribute their padding at a boundary, so the visible
    // gap between two sections is double this: sm:py-10 reads as 80px.
    <section id={id} className={cn('relative py-8 sm:py-10', className)}>
      <div className="container-page">
        <header className="mb-8">
          {eyebrow && (
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-brand-400">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl font-semibold tracking-tight text-ink-100 sm:text-5xl">
            {title}
          </h2>
          {description && (
            <p className="prose-measure mt-4 text-base leading-relaxed text-ink-400">
              {description}
            </p>
          )}
        </header>
        {children}
      </div>
    </section>
  )
}
