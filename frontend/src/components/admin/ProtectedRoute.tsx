import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import type { ReactNode } from 'react'

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  // Wait for the stored token to be revalidated before deciding.
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center">
        <Loader2 size={26} className="animate-spin text-brand-400" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />
  }

  return <>{children}</>
}
