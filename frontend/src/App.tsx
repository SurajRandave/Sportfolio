import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { ProtectedRoute } from '@/components/admin/ProtectedRoute'
import { useTrackVisit } from '@/hooks/useTrackVisit'
import { HomePage } from '@/pages/HomePage'
import { ProjectDetailPage } from '@/pages/ProjectDetailPage'

/*
 * The admin bundle pulls in Recharts, Echo and Pusher. Lazy-loading it keeps
 * all of that out of the public site's first load - visitors only download the
 * portfolio itself.
 */
const AdminLayout = lazy(() =>
  import('@/components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })),
)
const LoginPage = lazy(() =>
  import('@/pages/admin/LoginPage').then((m) => ({ default: m.LoginPage })),
)
const DashboardPage = lazy(() =>
  import('@/pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const MessagesPage = lazy(() =>
  import('@/pages/admin/MessagesPage').then((m) => ({ default: m.MessagesPage })),
)
const ProjectsPage = lazy(() =>
  import('@/pages/admin/ProjectsPage').then((m) => ({ default: m.ProjectsPage })),
)
const ExperiencesPage = lazy(() =>
  import('@/pages/admin/ExperiencesPage').then((m) => ({ default: m.ExperiencesPage })),
)
const SkillsPage = lazy(() =>
  import('@/pages/admin/SkillsPage').then((m) => ({ default: m.SkillsPage })),
)
const ServicesPage = lazy(() =>
  import('@/pages/admin/ServicesPage').then((m) => ({ default: m.ServicesPage })),
)
const TestimonialsPage = lazy(() =>
  import('@/pages/admin/TestimonialsPage').then((m) => ({ default: m.TestimonialsPage })),
)
const ProfilePage = lazy(() =>
  import('@/pages/admin/ProfilePage').then((m) => ({ default: m.ProfilePage })),
)

function RouteFallback() {
  return (
    <div className="grid min-h-screen place-items-center">
      <Loader2 size={26} className="animate-spin text-brand-400" />
    </div>
  )
}

export default function App() {
  useTrackVisit()

  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects/:slug" element={<ProjectDetailPage />} />

        <Route path="/admin/login" element={<LoginPage />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="experiences" element={<ExperiencesPage />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="testimonials" element={<TestimonialsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  )
}
