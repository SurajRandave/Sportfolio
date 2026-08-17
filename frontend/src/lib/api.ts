import axios, { AxiosError } from 'axios'

const TOKEN_KEY = 'portfolio_admin_token'

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  throw new Error("VITE_API_URL is not configured");
}

export const api = axios.create({
  baseURL: API_URL,
});

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
      // BASE_URL keeps this correct when served from a subpath (GitHub Pages).
      const base = import.meta.env.BASE_URL
      if (window.location.pathname.startsWith(`${base}admin`.replace('//', '/'))) {
        window.location.assign(`${base}admin/login`.replace('//', '/'))
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
