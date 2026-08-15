import { Suspense, lazy, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ExternalLink, Loader2 } from 'lucide-react'
import { GithubIcon } from '@/components/ui/BrandIcons'
import { TechPill } from '@/components/ui/TechPill'
import { api } from '@/lib/api'
import { formatDate } from '@/lib/format'
import type { Project } from '@/lib/types'

/* Same fixed dot field as the home page — the site's only 3D effect. */
const FXCanvas = lazy(() => import('@/components/three/ParticleField'))

export function ProjectDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    if (!slug) return
    let cancelled = false
    setLoading(true)
    window.scrollTo(0, 0)

    api
      .get<{ data: Project }>(`/projects/${slug}`)
      .then(({ data }) => {
        if (!cancelled) setProject(data.data)
      })
      .catch(() => {
        if (!cancelled) setNotFound(true)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (project) document.title = `${project.title} — Suraj Randave`
  }, [project])

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 size={28} className="animate-spin text-brand-400" />
      </div>
    )
  }

  if (notFound || !project) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="text-2xl font-semibold text-ink-100">Project not found</h1>
          <Link to="/" className="mt-4 inline-block text-sm text-brand-400 hover:text-brand-300">
            Back to the portfolio
          </Link>
        </div>
      </div>
    )
  }

  const sections = [
    { title: 'The problem', body: project.problem },
    { title: 'What I built', body: project.solution },
    { title: 'The outcome', body: project.outcome },
  ].filter((section) => section.body)

  const hasLinks = Boolean(project.live_url || project.repo_url)

  const meta = [
    { label: 'My role', value: project.role },
    { label: 'Client', value: project.client_name },
    { label: 'Completed', value: project.completed_at && formatDate(project.completed_at) },
    { label: 'Views', value: String(project.view_count) },
  ].filter((row) => row.value)

  return (
    <div className="relative min-h-screen pb-20 pt-20">
      <Suspense fallback={null}>
        <FXCanvas />
      </Suspense>
      {/* Full bleed, no ceiling — the page uses the whole viewport. */}
      <div className="container-page">
        <Link
          to="/#projects"
          className="inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-ink-100"
        >
          <ArrowLeft size={15} />
          All projects
        </Link>

        {/*
          Two columns on desktop: the narrative reads down the left while the
          facts, stack and CTA sit in a sticky rail. Sparse projects — no case
          study, no links — then still fill a screen instead of trailing off
          down a single narrow column.
        */}
        <div className="mt-8 grid gap-x-16 gap-y-12 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start">
          <div>
            <header>
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-brand-400">
                <span>{project.category}</span>
              </div>

              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-ink-100 sm:text-4xl">
                {project.title}
              </h1>

              <p className="prose-measure mt-4 text-lg leading-relaxed text-ink-300">
                {project.summary}
              </p>

              {/* Only rendered when a link exists — an empty row still ate its margin. */}
              {hasLinks && (
                <div className="mt-6 flex flex-wrap gap-3">
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
                    >
                      <ExternalLink size={15} />
                      Visit live site
                    </a>
                  )}
                  {project.repo_url && (
                    <a
                      href={project.repo_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 rounded-lg border border-ink-700 px-4 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:bg-ink-800/60"
                    >
                      <GithubIcon size={15} />
                      Source code
                    </a>
                  )}
                </div>
              )}
            </header>

            {project.cover_image_url && (
              <img
                src={project.cover_image_url}
                alt={project.title}
                loading="lazy"
                className="mt-8 w-full rounded-xl border border-ink-800 object-cover"
              />
            )}

            {project.description && (
              <p className="prose-measure mt-8 text-base leading-relaxed text-ink-300">
                {project.description}
              </p>
            )}

            {sections.map((section) => (
              <section key={section.title} className="mt-8">
                <h2 className="text-lg font-semibold text-ink-100">{section.title}</h2>
                <p className="prose-measure mt-3 text-base leading-relaxed text-ink-300">
                  {section.body}
                </p>
              </section>
            ))}

            {project.features && project.features.length > 0 && (
              <section className="mt-8">
                <h2 className="text-lg font-semibold text-ink-100">Key features</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                  {project.features.map((feature) => (
                    <li
                      key={feature}
                      className="panel rounded-lg px-4 py-3 text-sm leading-relaxed text-ink-200"
                    >
                      {feature}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-20">
            {meta.length > 0 && (
              <dl className="panel grid gap-4 rounded-xl p-5 sm:grid-cols-2 lg:grid-cols-1">
                {meta.map((row) => (
                  <div key={row.label}>
                    <dt className="text-xs uppercase tracking-wide text-ink-500">{row.label}</dt>
                    <dd className="mt-1 text-sm text-ink-100">{row.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            {project.tech_stack && project.tech_stack.length > 0 && (
              <div className="panel rounded-xl p-5">
                <h2 className="text-xs uppercase tracking-wide text-ink-500">Built with</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {project.tech_stack.map((tech) => (
                    <TechPill key={tech} label={tech} />
                  ))}
                </div>
              </div>
            )}

            <div className="rounded-xl border border-brand-500/25 bg-brand-500/8 p-5 text-center">
              <p className="text-sm text-ink-200">Want something like this built?</p>
              <Link
                to="/#contact"
                className="mt-3 inline-block rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
              >
                Start a conversation
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
