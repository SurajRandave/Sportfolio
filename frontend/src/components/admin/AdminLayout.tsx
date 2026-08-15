import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  Briefcase,
  Inbox,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Moon,
  Package,
  Radio,
  Sparkles,
  Sun,
  User,
  Wrench,
  X,
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { getEcho } from '@/lib/echo'
import { cn } from '@/lib/format'
import { useTheme } from '@/hooks/useTheme'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/messages', label: 'Inbox', icon: Inbox },
  { to: '/admin/projects', label: 'Projects', icon: Package },
  { to: '/admin/experiences', label: 'Experience', icon: Briefcase },
  { to: '/admin/skills', label: 'Skills', icon: Sparkles },
  { to: '/admin/services', label: 'Services', icon: Wrench },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquareQuote },
  { to: '/admin/profile', label: 'Profile', icon: User },
]

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [connected, setConnected] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Surface the websocket state so it is obvious when Reverb isn't running.
  useEffect(() => {
    const connection = getEcho().connector.pusher.connection

    const onConnected = () => setConnected(true)
    const onDisconnected = () => setConnected(false)

    connection.bind('connected', onConnected)
    connection.bind('disconnected', onDisconnected)
    connection.bind('unavailable', onDisconnected)
    connection.bind('failed', onDisconnected)
    setConnected(connection.state === 'connected')

    return () => {
      connection.unbind('connected', onConnected)
      connection.unbind('disconnected', onDisconnected)
      connection.unbind('unavailable', onDisconnected)
      connection.unbind('failed', onDisconnected)
    }
  }, [])

  async function handleLogout() {
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className="min-h-screen lg:flex">
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-ink-800 bg-ink-950 transition-transform lg:static lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-ink-800 px-5">
          <span className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 font-mono text-xs font-bold text-ink-100">
              SR
            </span>
            <span className="text-sm font-semibold text-ink-100">Control panel</span>
          </span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-ink-400 hover:bg-ink-800 lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1 p-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-500/15 text-brand-200'
                    : 'text-ink-400 hover:bg-ink-800/60 hover:text-ink-100',
                )
              }
            >
              <item.icon size={17} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute inset-x-0 bottom-0 border-t border-ink-800 p-3">
          <div className="mb-2 px-2">
            <p className="truncate text-sm text-ink-100">{user?.name}</p>
            <p className="truncate text-xs text-ink-500">{user?.email}</p>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-ink-400 transition-colors hover:bg-ink-800/60 hover:text-rose-300"
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <div className="flex-1">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-ink-800 bg-ink-950/90 px-5 backdrop-blur">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-ink-300 hover:bg-ink-800 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={19} />
          </button>

          <div className="ml-auto flex items-center gap-4">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800/60 hover:text-ink-100"
            >
              {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <span
              className={cn(
                'inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs',
                connected
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                  : 'border-amber-500/30 bg-amber-500/10 text-amber-300',
              )}
              title={
                connected
                  ? 'Connected to Reverb - updates arrive in real time'
                  : 'Reverb is not reachable. Run: php artisan reverb:start'
              }
            >
              <Radio size={13} className={connected ? 'animate-pulse' : ''} />
              {connected ? 'Live' : 'Offline'}
            </span>

            <a
              href={import.meta.env.BASE_URL}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-ink-400 transition-colors hover:text-ink-100"
            >
              View site
            </a>
          </div>
        </header>

        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
