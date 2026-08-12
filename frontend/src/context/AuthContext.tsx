import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, getToken, setToken } from '@/lib/api'
import { disconnectEcho } from '@/lib/echo'
import type { AdminUser } from '@/lib/types'

interface AuthContextValue {
  user: AdminUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [loading, setLoading] = useState(true)

  // Revalidate a stored token on boot so a revoked one doesn't look signed in.
  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }

    api
      .get<{ user: AdminUser }>('/admin/me')
      .then(({ data }) => setUser(data.user))
      .catch(() => {
        setToken(null)
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const { data } = await api.post<{ token: string; user: AdminUser }>('/admin/login', {
      email,
      password,
    })
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/admin/logout')
    } finally {
      // Clear locally even if the network call fails - the token is useless to us now.
      setToken(null)
      setUser(null)
      disconnectEcho()
    }
  }, [])

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading, login, logout],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside <AuthProvider>')
  return context
}
