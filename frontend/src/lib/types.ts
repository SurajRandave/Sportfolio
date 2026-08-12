export type SkillCategory =
  | 'frontend'
  | 'backend'
  | 'database'
  | 'cloud'
  | 'tools'
  | 'concepts'

export type ProjectCategory = 'enterprise' | 'client' | 'freelance' | 'personal'

export type MessageStatus = 'new' | 'read' | 'replied' | 'archived'

export type EnquiryType = 'hire' | 'freelance' | 'collaboration' | 'other'

export interface Profile {
  id: number
  full_name: string
  headline: string
  tagline: string | null
  summary: string
  location: string | null
  email: string
  phone: string | null
  linkedin_url: string | null
  github_url: string | null
  avatar_url: string | null
  resume_url: string | null
  years_experience: number
  is_available_for_freelance: boolean
  availability_note: string | null
  meta_title: string | null
  meta_description: string | null
}

export interface Experience {
  id: number
  company: string
  role: string
  location: string | null
  employment_type: string
  company_url: string | null
  start_date: string
  end_date: string | null
  is_current: boolean
  description: string | null
  highlights: string[] | null
  tech_stack: string[] | null
  sort_order: number
  is_published: boolean
  period: string
  duration: string
}

export interface Project {
  id: number
  title: string
  slug: string
  /** Short share code, e.g. "hbvhuv" — resolves at /p/{short_code}. */
  short_code: string | null
  short_url: string | null
  /** Present on admin listings (withCount). */
  short_link_clicks_count?: number
  category: ProjectCategory
  role: string | null
  client_name: string | null
  summary: string
  description: string | null
  problem: string | null
  solution: string | null
  outcome: string | null
  tech_stack: string[] | null
  features: string[] | null
  live_url: string | null
  repo_url: string | null
  cover_image: string | null
  cover_image_url: string | null
  gallery: string[] | null
  is_featured: boolean
  is_published: boolean
  sort_order: number
  view_count: number
  completed_at: string | null
  testimonials?: Testimonial[]
}

export interface Skill {
  id: number
  name: string
  category: SkillCategory
  proficiency: number
  years: number
  icon: string | null
  is_featured: boolean
  sort_order: number
}

export interface Service {
  id: number
  title: string
  slug: string
  description: string
  icon: string | null
  features: string[] | null
  starting_price: string | null
  currency: string
  price_unit: string
  delivery_days: number | null
  is_active: boolean
  sort_order: number
}

export interface Testimonial {
  id: number
  project_id: number | null
  client_name: string
  client_role: string | null
  company: string | null
  avatar: string | null
  message: string
  rating: number
  is_approved: boolean
  is_featured: boolean
  sort_order: number
  created_at: string
  project?: Pick<Project, 'id' | 'title' | 'slug'> | null
}

export interface ContactMessage {
  id: number
  name: string
  email: string
  phone: string | null
  company: string | null
  subject: string | null
  message: string
  enquiry_type: EnquiryType
  budget_range: string | null
  timeline: string | null
  status: MessageStatus
  is_starred: boolean
  admin_notes: string | null
  read_at: string | null
  replied_at: string | null
  created_at: string
}

/** Payload of the whole public site, from GET /api/site */
export interface SitePayload {
  profile: Profile | null
  experiences: Experience[]
  projects: Project[]
  skills: Partial<Record<SkillCategory, Skill[]>>
  services: Service[]
  testimonials: Testimonial[]
  stats: {
    projects: number
    years_experience: number
    technologies: number
  }
}

export interface DashboardPayload {
  cards: {
    unread_messages: number
    total_messages: number
    published_projects: number
    pending_testimonials: number
    visits_today: number
    visits_total: number
    active_now: number
  }
  visits_last_14_days: { date: string; total: number }[]
  top_pages: { path: string; total: number }[]
  devices: { device: string; total: number }[]
  recent_messages: ContactMessage[]
  most_viewed_projects: Pick<Project, 'id' | 'title' | 'slug' | 'view_count'>[]
  top_short_links: (Pick<Project, 'id' | 'title' | 'slug' | 'short_code' | 'short_url'> & {
    short_link_clicks_count: number
  })[]
}

export interface AdminUser {
  id: number
  name: string
  email: string
}

/** Laravel's paginated response envelope. */
export interface Paginated<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
}
