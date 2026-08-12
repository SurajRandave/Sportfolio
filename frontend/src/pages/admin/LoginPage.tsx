import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { errorMessage } from '@/lib/api'

export function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to={location.state?.from ?? '/admin'} replace />
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)

    try {
      await login(email, password)
      navigate(location.state?.from ?? '/admin', { replace: true })
    } catch (err) {
      setError(errorMessage(err, 'Sign-in failed. Check your credentials.'))
    } finally {
      setSubmitting(false)
    }
  }

  const inputClass =
    'w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500'

  return (
    <div className="grid min-h-screen place-items-center px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500">
            <Lock size={20} className="text-ink-100" />
          </span>
          <h1 className="text-xl font-semibold text-ink-100">Portfolio control panel</h1>
          <p className="mt-1 text-sm text-ink-400">Sign in to manage your content</p>
        </div>

        <form onSubmit={handleSubmit} className="panel space-y-4 rounded-xl p-6">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-400">
              Email
            </span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              className={inputClass}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-400">
              Password
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              className={inputClass}
            />
          </label>

          {error && (
            <p className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400 disabled:opacity-60"
          >
            {submitting && <Loader2 size={15} className="animate-spin" />}
            Sign in
          </button>
        </form>
      </div>
    </div>
  )
}
