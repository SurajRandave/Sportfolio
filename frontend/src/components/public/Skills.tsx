import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import type { Skill, SkillCategory } from '@/lib/types'

const CATEGORY_LABELS: Record<SkillCategory, string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  cloud: 'Cloud & DevOps',
  tools: 'Tools',
  concepts: 'Concepts',
}

const ORDER: SkillCategory[] = [
  'frontend',
  'backend',
  'database',
  'cloud',
  'tools',
  'concepts',
]

export function Skills({ skills }: { skills: Partial<Record<SkillCategory, Skill[]>> }) {
  const groups = ORDER.map((category) => ({
    category,
    items: skills[category] ?? [],
  })).filter((group) => group.items.length > 0)

  if (groups.length === 0) return null

  return (
    <Section
      id="skills"
      eyebrow="Toolkit"
      title="Technologies I work with"
      description="The stack I use day to day, grouped by where it sits in the system."
    >
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        {groups.map((group, i) => (
          <Reveal key={group.category} delay={i * 70}>
            <div className="panel h-full rounded-xl p-6">
              <h3 className="mb-5 font-mono text-xs uppercase tracking-[0.15em] text-brand-400">
                {CATEGORY_LABELS[group.category]}
              </h3>

              <ul className="space-y-2.5">
                {group.items.map((skill) => (
                  <li key={skill.id} className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-ink-100">{skill.name}</span>
                    {skill.years > 0 && (
                      <span className="font-mono text-[0.7rem] text-ink-500">
                        {skill.years} yr{skill.years === 1 ? '' : 's'}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
