import { useMemo } from 'react'
import { ArrowRight, Download, Mail, MapPin } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { TechPill } from '@/components/ui/TechPill'
import type { Skill, SitePayload } from '@/lib/types'

/** How many strengths the hero shows before it starts to read as a list. */
const STRENGTH_LIMIT = 6

export function Hero({ site }: { site: SitePayload }) {
  const { profile, stats } = site

  /*
   * Drawn from the skills flagged "featured" in the admin, ranked by the
   * proficiency rating set there (years is a poor proxy for "strongest" — the
   * longest-held skills here are the foundational ones). Backed by the same
   * data the Skills section uses, so it stays editable in Admin → Skills
   * rather than being hardcoded copy that drifts out of date.
   */
  const strengths = useMemo(() => {
    const all = Object.values(site.skills ?? {}).flat() as Skill[]
    return all
      .filter((skill) => skill.is_featured)
      .sort((a, b) => b.proficiency - a.proficiency || b.years - a.years)
      .slice(0, STRENGTH_LIMIT)
  }, [site.skills])

  const initials = (profile?.full_name ?? 'Suraj Randave')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return (
    <section
      id="home"
      // Top padding only has to clear the fixed 56px navbar; anything more is
      // dead space above the hero. min-h is a floor for very short viewports,
      // not a target — at 92vh it re-inflated the section past its content and
      // trimming the padding changed nothing.
      className="relative min-h-[70vh] overflow-hidden pt-16 pb-8 sm:pt-20 sm:pb-10"
    >
      {/* Warm ambient wash behind the copy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute left-[12%] top-10 h-[34rem] w-[34rem] rounded-full bg-brand-500/10 blur-[130px]" />
        <div className="absolute right-[8%] top-52 h-96 w-96 rounded-full bg-accent-500/10 blur-[110px]" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          {/* space-y-6 gives every block in this stack the same gap, instead
              of the per-element mt-5/7/9 the column used to carry. */}
          <div className="animate-fade-up space-y-6">
            {profile?.is_available_for_freelance && (
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-medium text-brand-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                </span>
                Open to work · Freelance &amp; full-time
              </div>
            )}

            {/*
              Sized off the viewport rather than a fixed per-breakpoint scale so
              the full name always lands on one line. `nowrap` is what forbids
              the wrap; the clamp is what keeps that from overflowing the gutter.
            */}
            <h1 className="whitespace-nowrap text-[clamp(1.5rem,4.7vw,6.5rem)] font-semibold leading-[1.05] tracking-tight text-ink-100">
              {profile?.full_name ?? 'Suraj Randave'}
            </h1>

            <p className="bg-gradient-to-r from-brand-300 via-brand-400 to-accent-500 bg-clip-text text-xl font-medium text-transparent sm:text-3xl">
              {profile?.headline ?? 'Full-Stack Developer'}
            </p>

            {profile?.tagline && (
              <p className="prose-measure text-lg leading-relaxed text-ink-300">
                {profile.tagline}
              </p>
            )}

            {profile?.location && (
              <p className="flex items-center gap-2 text-sm text-ink-400">
                <MapPin size={15} />
                {profile.location}
              </p>
            )}

            {strengths.length > 0 && (
              <div>
                <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-500">
                  Strongest in
                </p>
                <div className="flex flex-wrap gap-2">
                  {strengths.map((skill) => (
                    <TechPill key={skill.id} label={skill.name} />
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-6 py-3.5 text-sm font-semibold text-ink-950 transition-colors hover:bg-brand-400"
              >
                Start a project
                <ArrowRight size={16} />
              </a>

              <a
                href="#projects"
                className="inline-flex items-center gap-2 rounded-lg border border-ink-700 px-6 py-3.5 text-sm font-medium text-ink-100 transition-colors hover:border-brand-500/50 hover:bg-ink-800/60"
              >
                View my work
              </a>

              {profile?.resume_url && (
                <a
                  href={profile.resume_url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-3.5 text-sm font-medium text-ink-400 transition-colors hover:text-brand-300"
                >
                  <Download size={16} />
                  Resume
                </a>
              )}
            </div>

            <div className="flex items-center gap-5">
              {profile?.github_url && (
                <a
                  href={profile.github_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  className="text-ink-500 transition-colors hover:text-brand-400"
                >
                  <GithubIcon size={20} />
                </a>
              )}
              {profile?.linkedin_url && (
                <a
                  href={profile.linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  className="text-ink-500 transition-colors hover:text-brand-400"
                >
                  <LinkedinIcon size={20} />
                </a>
              )}
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  aria-label="Email"
                  className="text-ink-500 transition-colors hover:text-brand-400"
                >
                  <Mail size={20} />
                </a>
              )}
            </div>
          </div>

          {/* Portrait — circular, so the frame is square and the ring is round. */}
          <div className="relative mx-auto w-full max-w-sm">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-full bg-gradient-to-br from-brand-500/25 via-accent-500/10 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-full border border-ink-700/80 bg-ink-900">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  loading="eager"
                  /* Set in Admin → Profile → Photo focus, so the circular crop
                     can be aimed at the right part of whatever is uploaded. */
                  style={{ objectPosition: profile.avatar_position ?? 'top' }}
                  className="aspect-square w-full object-cover"
                />
              ) : (
                <div className="grid aspect-square w-full place-items-center bg-gradient-to-br from-ink-800 to-ink-900">
                  <div className="text-center">
                    <span className="grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-accent-500 font-mono text-3xl font-bold text-ink-950">
                      {initials}
                    </span>
                    <p className="mt-4 px-6 text-xs leading-relaxed text-ink-500">
                      Upload your photo in
                      <br />
                      <span className="text-ink-400">Admin → Profile → Files</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
          {[
            { label: 'Years experience', value: `${stats.years_experience}+` },
            { label: 'Projects shipped', value: `${stats.projects}` },
            { label: 'Technologies', value: `${stats.technologies}` },
          ].map((stat) => (
            <div key={stat.label} className="panel rounded-xl p-5">
              <dt className="text-xs uppercase tracking-wide text-ink-500">{stat.label}</dt>
              <dd className="mt-1.5 text-3xl font-semibold text-brand-400">{stat.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
