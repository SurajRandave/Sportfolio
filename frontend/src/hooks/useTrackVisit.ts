import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { api } from '@/lib/api'
import { sessionId } from '@/lib/format'

/**
 * Pings /api/track on every public route change so the admin dashboard has a
 * live traffic feed. Admin routes are skipped - Suraj browsing his own
 * dashboard is not a portfolio visitor.
 */
export function useTrackVisit(): void {
  const { pathname } = useLocation()

  useEffect(() => {
    if (pathname.startsWith('/admin')) return

    api
      .post('/track', {
        path: pathname,
        referrer: document.referrer || null,
        session_id: sessionId(),
      })
      .catch(() => {
        // Analytics is best-effort; never surface a failure to the visitor.
      })
  }, [pathname])
}
