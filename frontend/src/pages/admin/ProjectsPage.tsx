import { ResourcePage } from '@/components/admin/ResourcePage'
import { CopyLink } from '@/components/admin/CopyLink'
import { Badge } from '@/components/admin/ui'
import type { FieldConfig } from '@/components/admin/AutoForm'
import type { Project } from '@/lib/types'

const FIELDS: FieldConfig[] = [
  { name: 'title', label: 'Title', type: 'text', half: true },
  {
    name: 'slug',
    label: 'Slug',
    type: 'text',
    half: true,
    help: 'Leave blank to generate from the title.',
  },
  {
    name: 'category',
    label: 'Category',
    type: 'select',
    half: true,
    options: [
      { value: 'enterprise', label: 'Enterprise' },
      { value: 'client', label: 'Client' },
      { value: 'freelance', label: 'Freelance' },
      { value: 'personal', label: 'Personal' },
    ],
  },
  { name: 'role', label: 'My role', type: 'text', half: true },
  { name: 'client_name', label: 'Client', type: 'text', half: true },
  { name: 'completed_at', label: 'Completed', type: 'date', half: true },
  { name: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
  { name: 'description', label: 'Description', type: 'textarea', rows: 4 },
  { name: 'problem', label: 'The problem', type: 'textarea', rows: 3 },
  { name: 'solution', label: 'What I built', type: 'textarea', rows: 3 },
  { name: 'outcome', label: 'The outcome', type: 'textarea', rows: 3 },
  { name: 'tech_stack', label: 'Tech stack', type: 'tags' },
  { name: 'features', label: 'Key features', type: 'tags' },
  { name: 'live_url', label: 'Live URL', type: 'text', half: true },
  { name: 'repo_url', label: 'Repo URL', type: 'text', half: true },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, min: 0 },
  { name: 'is_featured', label: 'Featured on the homepage', type: 'toggle', half: true },
  { name: 'is_published', label: 'Published', type: 'toggle', half: true },
]

const EMPTY = {
  title: '',
  slug: '',
  category: 'client',
  role: '',
  client_name: '',
  completed_at: '',
  summary: '',
  description: '',
  problem: '',
  solution: '',
  outcome: '',
  tech_stack: [],
  features: [],
  live_url: '',
  repo_url: '',
  sort_order: 0,
  is_featured: false,
  is_published: true,
}

export function ProjectsPage() {
  return (
    <ResourcePage<Project>
      title="Projects"
      description="Case studies shown on the public site. Featured projects sort to the top."
      endpoint="/admin/projects"
      singular="Project"
      fields={FIELDS}
      wideForm
      emptyValues={EMPTY}
      toForm={(project) => ({
        ...EMPTY,
        ...project,
        // Nullable columns come back as null; the inputs want strings.
        slug: project.slug ?? '',
        role: project.role ?? '',
        client_name: project.client_name ?? '',
        completed_at: project.completed_at ?? '',
        description: project.description ?? '',
        problem: project.problem ?? '',
        solution: project.solution ?? '',
        outcome: project.outcome ?? '',
        live_url: project.live_url ?? '',
        repo_url: project.repo_url ?? '',
        tech_stack: project.tech_stack ?? [],
        features: project.features ?? [],
      })}
      columns={[
        {
          header: 'Project',
          render: (project) => (
            <div>
              <p className="font-medium text-ink-100">{project.title}</p>
              <p className="mt-0.5 font-mono text-xs text-ink-500">{project.slug}</p>
            </div>
          ),
        },
        {
          header: 'Category',
          render: (project) => <Badge tone="brand">{project.category}</Badge>,
        },
        {
          header: 'Status',
          render: (project) => (
            <div className="flex flex-wrap gap-1.5">
              <Badge tone={project.is_published ? 'success' : 'warning'}>
                {project.is_published ? 'Published' : 'Draft'}
              </Badge>
              {project.is_featured && <Badge tone="brand">Featured</Badge>}
            </div>
          ),
        },
        {
          header: 'Share link',
          render: (project) =>
            project.short_url && project.short_code ? (
              <CopyLink url={project.short_url} code={project.short_code} />
            ) : (
              <span className="text-ink-600">—</span>
            ),
        },
        {
          header: 'Views / clicks',
          render: (project) => (
            <span className="font-mono text-xs text-ink-400">
              {project.view_count}
              <span className="text-ink-600"> / </span>
              <span className="text-brand-400">{project.short_link_clicks_count ?? 0}</span>
            </span>
          ),
        },
      ]}
    />
  )
}
