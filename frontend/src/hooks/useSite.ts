import { useCallback, useEffect, useState } from 'react'
import { api } from '@/lib/api'
import type { SitePayload } from '@/lib/types'

interface UseSiteResult {
  site: SitePayload | null
  loading: boolean
  error: string | null
  reload: () => void
}

/**
 * Loads the entire public site in one request. Every public section reads from
 * this, so editing content in /admin shows up on the next page load.
 */
export function useSite(): UseSiteResult {
  const [site, setSite] = useState<SitePayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    api
      .get<SitePayload>('/site')
      .then(({ data }) => {
        if (!cancelled) {
          setSite(data)
          setError(null)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError('Could not reach the API. Is the Laravel server running on port 8000?')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [nonce])

  return { site, loading, error, reload }
}
