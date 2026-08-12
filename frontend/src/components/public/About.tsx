import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import type { Profile } from '@/lib/types'

export function About({ profile }: { profile: Profile | null }) {
  if (!profile) return null

  // The summary is authored with blank lines between paragraphs in the admin panel.
  const paragraphs = profile.summary.split(/\n\s*\n/).filter(Boolean)

  return (
    <Section id="about" eyebrow="About" title="Who I am">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Reveal>
          <div className="prose-measure space-y-5 text-base leading-relaxed text-ink-300">
            {paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph.trim()}</p>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <dl className="panel space-y-4 rounded-xl p-6">
            {[
              { label: 'Location', value: profile.location },
              { label: 'Email', value: profile.email },
              { label: 'Phone', value: profile.phone },
              {
                label: 'Availability',
                value: profile.is_available_for_freelance
                  ? (profile.availability_note ?? 'Open to new projects')
                  : 'Not currently available',
              },
            ]
              .filter((row) => row.value)
              .map((row) => (
                <div key={row.label}>
                  <dt className="text-xs uppercase tracking-wide text-ink-400">
                    {row.label}
                  </dt>
                  <dd className="mt-1 text-sm text-ink-100">{row.value}</dd>
                </div>
              ))}
          </dl>
        </Reveal>
      </div>
    </Section>
  )
}
