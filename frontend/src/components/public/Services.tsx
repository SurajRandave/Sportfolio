import { Activity, ArrowRight, Check, Code, Layout, Server, type LucideIcon } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { formatCurrency } from '@/lib/format'
import type { Service } from '@/lib/types'

const ICONS: Record<string, LucideIcon> = {
  server: Server,
  code: Code,
  activity: Activity,
  layout: Layout,
}

export function Services({ services }: { services: Service[] }) {
  if (services.length === 0) return null

  return (
    <Section
      id="services"
      eyebrow="Freelance"
      title="What I can build for you"
      description="Available for freelance projects alongside my full-time role. Prices are starting points - tell me the scope and I'll quote properly."
    >
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {services.map((service, i) => {
          const Icon = ICONS[service.icon ?? ''] ?? Code
          const price = formatCurrency(service.starting_price, service.currency)

          return (
            <Reveal key={service.id} delay={i * 80}>
              <article className="panel flex h-full flex-col rounded-xl p-6">
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-brand-500/12 text-brand-400">
                  <Icon size={20} />
                </div>

                <h3 className="text-lg font-semibold text-ink-100">{service.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-300">
                  {service.description}
                </p>

                {service.features && service.features.length > 0 && (
                  <ul className="mt-5 flex-1 space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex gap-2.5 text-sm text-ink-300">
                        <Check size={15} className="mt-0.5 shrink-0 text-brand-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="mt-6 flex items-end justify-between border-t border-ink-800 pt-4">
                  <div>
                    {price && (
                      <p className="text-sm text-ink-400">
                        From <span className="text-lg font-semibold text-ink-100">{price}</span>
                        <span className="text-xs"> / {service.price_unit}</span>
                      </p>
                    )}
                    {service.delivery_days && (
                      <p className="mt-0.5 text-xs text-ink-500">
                        Typically {service.delivery_days} days
                      </p>
                    )}
                  </div>

                  <a
                    href="#contact"
                    className="inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
                  >
                    Enquire
                    <ArrowRight size={14} />
                  </a>
                </div>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
