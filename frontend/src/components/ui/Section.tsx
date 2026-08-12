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
    <section id={id} className={cn('py-20 sm:py-28', className)}>
      <div className="container-page">
        <header className="mb-12">
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
