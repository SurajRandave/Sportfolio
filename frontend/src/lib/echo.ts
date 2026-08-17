import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import { getToken } from './api'

// laravel-echo looks for Pusher on the window when using the reverb broadcaster.
declare global {
  interface Window {
    Pusher: typeof Pusher
  }
}
window.Pusher = Pusher

type EchoClient = Echo<'reverb'>

let echo: EchoClient | null = null

/**
 * Reverb connection for the admin dashboard. Created lazily on first use so a
 * public visitor never opens a websocket, and torn down on sign-out.
 *
 * Private channels authorise against /api/broadcasting/auth with the same
 * Sanctum bearer token the REST calls use.
 */
export function getEcho(): EchoClient {
  if (echo) return echo

  echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY,
    wsHost: import.meta.env.VITE_REVERB_HOST ?? 'localhost',
    wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
    forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'http') === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${getToken() ?? ''}`,
        Accept: 'application/json',
      },
    },
  })

  return echo
}

export function disconnectEcho(): void {
  echo?.disconnect()
  echo = null
}
