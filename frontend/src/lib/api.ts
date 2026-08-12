import axios, { AxiosError } from 'axios'

const TOKEN_KEY = 'portfolio_admin_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api',
  headers: { Accept: 'application/json' },
})

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string | null): void {
  if (token) localStorage.setItem(TOKEN_KEY, token)
  else localStorage.removeItem(TOKEN_KEY)
}

// Attach the Sanctum bearer token to every admin request.
api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// A 401 means the token was revoked or expired - drop it and bounce to login.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401 && getToken()) {
      setToken(null)
      if (window.location.pathname.startsWith('/admin')) {
        window.location.assign('/admin/login')
      }
    }
    return Promise.reject(error)
  },
)

/** Flattens a Laravel 422 response into a field -> first message map. */
export function validationErrors(error: unknown): Record<string, string> {
  const err = error as AxiosError<{ errors?: Record<string, string[]>; message?: string }>
  const errors = err.response?.data?.errors
  if (!errors) return {}

  return Object.fromEntries(
    Object.entries(errors).map(([field, messages]) => [field, messages[0]]),
  )
}

/** Best-effort human-readable message for any API failure. */
export function errorMessage(error: unknown, fallback = 'Something went wrong.'): string {
  const err = error as AxiosError<{ message?: string }>
  return err.response?.data?.message ?? err.message ?? fallback
}
