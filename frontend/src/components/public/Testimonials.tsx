import { Quote, Star } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import type { Testimonial } from '@/lib/types'

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  if (testimonials.length === 0) return null

  return (
    <Section
      id="testimonials"
      eyebrow="Feedback"
      title="What people say"
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((testimonial, i) => (
          <Reveal key={testimonial.id} delay={i * 80}>
            <figure className="panel flex h-full flex-col rounded-xl p-6">
              <Quote size={22} className="mb-4 text-brand-500/50" />

              <blockquote className="flex-1 text-sm leading-relaxed text-ink-200">
                {testimonial.message}
              </blockquote>

              <div className="mt-5 flex gap-0.5" aria-label={`${testimonial.rating} out of 5`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    size={13}
                    className={
                      index < testimonial.rating
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-ink-700'
                    }
                  />
                ))}
              </div>

              <figcaption className="mt-4 border-t border-ink-800 pt-4">
                <p className="text-sm font-medium text-ink-100">{testimonial.client_name}</p>
                <p className="mt-0.5 text-xs text-ink-400">
                  {[testimonial.client_role, testimonial.company].filter(Boolean).join(' · ')}
                </p>
                {testimonial.project && (
                  <p className="mt-1 font-mono text-[0.7rem] text-brand-400">
                    {testimonial.project.title}
                  </p>
                )}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
