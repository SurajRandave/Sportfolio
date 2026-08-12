import { Suspense, lazy } from 'react'
import { ArrowRight, Download, Mail, MapPin } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { useRichVisuals } from '@/hooks/useRichVisuals'
import type { SitePayload } from '@/lib/types'

const ParticleField = lazy(() => import('@/components/three/ParticleField'))

export function Hero({ site }: { site: SitePayload }) {
  const { profile, stats } = site
  const richVisuals = useRichVisuals()

  const initials = (profile?.full_name ?? 'Suraj Randave')
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')

  return (
    <section
      id="home"
      className="relative min-h-[92vh] overflow-hidden pt-32 pb-20 sm:pt-36 sm:pb-28"
    >
      {richVisuals && (
        <Suspense fallback={null}>
          <ParticleField />
        </Suspense>
      )}

      {/* Warm ambient wash behind the copy. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20">
        <div className="absolute left-[12%] top-10 h-[34rem] w-[34rem] rounded-full bg-brand-500/10 blur-[130px]" />
        <div className="absolute right-[8%] top-52 h-96 w-96 rounded-full bg-accent-500/10 blur-[110px]" />
      </div>

      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)]">
          <div className="animate-fade-up">
            {profile?.is_available_for_freelance && (
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-3.5 py-1.5 text-xs font-medium text-brand-300">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand-400" />
                </span>
                Available for freelance work
              </div>
            )}

            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-ink-100 sm:text-7xl xl:text-8xl">
              {profile?.full_name ?? 'Suraj Randave'}
            </h1>

            <p className="mt-5 bg-gradient-to-r from-brand-300 via-brand-400 to-accent-500 bg-clip-text text-xl font-medium text-transparent sm:text-3xl">
              {profile?.headline ?? 'Full-Stack Developer'}
            </p>

            {profile?.tagline && (
              <p className="prose-measure mt-7 text-lg leading-relaxed text-ink-300">
                {profile.tagline}
              </p>
            )}

            {profile?.location && (
              <p className="mt-6 flex items-center gap-2 text-sm text-ink-400">
                <MapPin size={15} />
                {profile.location}
              </p>
            )}

            <div className="mt-9 flex flex-wrap items-center gap-3">
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

            <div className="mt-9 flex items-center gap-5">
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

          {/* Portrait */}
          <div className="relative mx-auto w-full max-w-sm lg:max-w-none">
            <div
              aria-hidden
              className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-brand-500/25 via-accent-500/10 to-transparent blur-2xl"
            />
            <div className="relative overflow-hidden rounded-[1.75rem] border border-ink-700/80 bg-ink-900">
              {profile?.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name}
                  loading="eager"
                  className="aspect-[3/4] w-full object-cover object-top"
                />
              ) : (
                <div className="grid aspect-[3/4] w-full place-items-center bg-gradient-to-br from-ink-800 to-ink-900">
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
              {/* Bottom fade so the portrait sits into the page. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ink-950/85 to-transparent"
              />
            </div>
          </div>
        </div>

        <dl className="mt-20 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Years experience', value: `${stats.years_experience}+` },
            { label: 'Projects shipped', value: `${stats.projects}` },
            { label: 'Technologies', value: `${stats.technologies}` },
            { label: 'Production uptime', value: '99%' },
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
