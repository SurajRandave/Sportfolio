import { Briefcase, ExternalLink } from 'lucide-react'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { TechPill } from '@/components/ui/TechPill'
import type { Experience as ExperienceType } from '@/lib/types'

export function Experience({ experiences }: { experiences: ExperienceType[] }) {
  if (experiences.length === 0) return null

  return (
    <Section
      id="experience"
      eyebrow="Career"
      title="Where I've worked"
      description="Two years building and maintaining production web applications, most recently on SaaS ERP modules in healthcare."
    >
      <ol className="relative space-y-8 border-l border-ink-800 pl-6 sm:pl-8">
        {experiences.map((experience, i) => (
          <li key={experience.id} className="relative">
            <span
              aria-hidden
              className={`absolute -left-[1.9rem] top-1.5 grid h-6 w-6 place-items-center rounded-full border sm:-left-[2.4rem] ${
                experience.is_current
                  ? 'border-brand-500/50 bg-brand-500/20 text-brand-300'
                  : 'border-ink-700 bg-ink-900 text-ink-400'
              }`}
            >
              <Briefcase size={12} />
            </span>

            <Reveal delay={i * 100}>
              <article className="panel rounded-xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h3 className="text-lg font-semibold text-ink-100">{experience.role}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-brand-300">
                      {experience.company_url ? (
                        <a
                          href={experience.company_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 hover:underline"
                        >
                          {experience.company}
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        experience.company
                      )}
                      {experience.location && (
                        <span className="text-ink-500">· {experience.location}</span>
                      )}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-mono text-xs text-ink-300">{experience.period}</p>
                    <p className="mt-0.5 text-xs text-ink-500">{experience.duration}</p>
                  </div>
                </div>

                {experience.description && (
                  <p className="mt-4 text-sm leading-relaxed text-ink-300">
                    {experience.description}
                  </p>
                )}

                {experience.highlights && experience.highlights.length > 0 && (
                  <ul className="mt-4 space-y-2">
                    {experience.highlights.map((highlight, index) => (
                      <li
                        key={index}
                        className="flex gap-3 text-sm leading-relaxed text-ink-300"
                      >
                        <span aria-hidden className="mt-2 h-1 w-1 shrink-0 rounded-full bg-brand-400" />
                        {highlight}
                      </li>
                    ))}
                  </ul>
                )}

                {experience.tech_stack && experience.tech_stack.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {experience.tech_stack.map((tech) => (
                      <TechPill key={tech} label={tech} />
                    ))}
                  </div>
                )}
              </article>
            </Reveal>
          </li>
        ))}
      </ol>
    </Section>
  )
}
