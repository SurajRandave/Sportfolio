import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowUpRight, ExternalLink, Star } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { TechPill } from '@/components/ui/TechPill'
import { cn } from '@/lib/format'
import type { Project, ProjectCategory } from '@/lib/types'

const FILTERS: { value: ProjectCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'enterprise', label: 'Enterprise' },
  { value: 'client', label: 'Client' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'personal', label: 'Personal' },
]

export function Projects({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<ProjectCategory | 'all'>('all')

  // Only offer filters that actually have projects behind them.
  const available = useMemo(() => {
    const present = new Set(projects.map((p) => p.category))
    return FILTERS.filter((f) => f.value === 'all' || present.has(f.value))
  }, [projects])

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter],
  )

  if (projects.length === 0) return null

  return (
    <Section
      id="projects"
      eyebrow="Work"
      title="Selected projects"
      description="Real systems in production - a government IoT water monitoring portal, a healthcare SaaS ERP, and client applications."
    >
      <div className="mb-8 flex flex-wrap gap-2">
        {available.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setFilter(option.value)}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm transition-colors',
              filter === option.value
                ? 'border-brand-500 bg-brand-500/15 text-brand-200'
                : 'border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-200',
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visible.map((project, i) => (
          <Reveal key={project.id} delay={i * 80}>
            <article className="panel panel-hover group flex h-full flex-col rounded-xl p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-mono text-[0.7rem] uppercase tracking-wider text-brand-400">
                      {project.category}
                    </span>
                    {project.is_featured && (
                      <Star size={12} className="fill-amber-400 text-amber-400" />
                    )}
                  </div>
                  <h3 className="text-lg font-semibold leading-snug text-ink-100">
                    <Link
                      to={`/projects/${project.slug}`}
                      className="transition-colors hover:text-brand-300"
                    >
                      {project.title}
                    </Link>
                  </h3>
                  {project.role && (
                    <p className="mt-1 text-xs text-ink-400">{project.role}</p>
                  )}
                </div>

                <div className="flex shrink-0 gap-2">
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} source code`}
                      className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100"
                    >
                      <GithubIcon size={16} />
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.title} live site`}
                      className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>

              <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-300">
                {project.summary}
              </p>

              {project.tech_stack && project.tech_stack.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {project.tech_stack.slice(0, 6).map((tech) => (
                    <TechPill key={tech} label={tech} />
                  ))}
                  {project.tech_stack.length > 6 && (
                    <TechPill label={`+${project.tech_stack.length - 6}`} />
                  )}
                </div>
              )}

              <Link
                to={`/projects/${project.slug}`}
                className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-400 transition-colors hover:text-brand-300"
              >
                Read the case study
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  )
}
