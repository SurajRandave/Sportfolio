import { Link } from 'react-router-dom'
import type { Profile } from '@/lib/types'

export function Footer({ profile }: { profile: Profile | null }) {
  return (
    <footer className="border-t border-ink-800/80 py-10">
      <div className="container-page flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-ink-400">
          © {new Date().getFullYear()} {profile?.full_name ?? 'Suraj Randave'}
        </p>

        <p className="font-mono text-xs text-ink-500">
          Laravel · React · TypeScript · PostgreSQL · Reverb
        </p>

        <Link
          to="/admin"
          className="text-xs text-ink-600 transition-colors hover:text-ink-300"
        >
          Admin
        </Link>
      </div>
    </footer>
  )
}
