import { useEffect } from 'react'
import { AlertTriangle, Loader2 } from 'lucide-react'
import { Navbar } from '@/components/public/Navbar'
import { Hero } from '@/components/public/Hero'
import { About } from '@/components/public/About'
import { Experience } from '@/components/public/Experience'
import { Projects } from '@/components/public/Projects'
import { Skills } from '@/components/public/Skills'
import { Services } from '@/components/public/Services'
import { Testimonials } from '@/components/public/Testimonials'
import { Contact } from '@/components/public/Contact'
import { Footer } from '@/components/public/Footer'
import { useSite } from '@/hooks/useSite'

export function HomePage() {
  const { site, loading, error } = useSite()

  useEffect(() => {
    if (site?.profile) {
      document.title = site.profile.meta_title ?? site.profile.full_name
      const meta = document.querySelector('meta[name="description"]')
      if (meta && site.profile.meta_description) {
        meta.setAttribute('content', site.profile.meta_description)
      }
    }
  }, [site])

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 size={28} className="animate-spin text-brand-400" />
      </div>
    )
  }

  if (error || !site) {
    return (
      <div className="grid min-h-screen place-items-center px-6">
        <div className="panel max-w-md rounded-xl p-8 text-center">
          <AlertTriangle size={32} className="mx-auto mb-4 text-amber-400" />
          <h1 className="text-lg font-semibold text-ink-100">Can't load the portfolio</h1>
          <p className="mt-2 text-sm text-ink-300">{error}</p>
          <code className="mt-4 block rounded-lg bg-ink-900 px-3 py-2 font-mono text-xs text-ink-400">
            cd backend && php artisan serve
          </code>
        </div>
      </div>
    )
  }

  return (
    <>
      <Navbar profile={site.profile} />
      <main>
        <Hero site={site} />
        <About profile={site.profile} />
        <Experience experiences={site.experiences} />
        <Projects projects={site.projects} />
        <Skills skills={site.skills} />
        <Services services={site.services} />
        <Testimonials testimonials={site.testimonials} />
        <Contact profile={site.profile} />
      </main>
      <Footer profile={site.profile} />
    </>
  )
}
