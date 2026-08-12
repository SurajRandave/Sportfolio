import { ResourcePage } from '@/components/admin/ResourcePage'
import { Badge } from '@/components/admin/ui'
import type { FieldConfig } from '@/components/admin/AutoForm'
import type { Experience } from '@/lib/types'

const FIELDS: FieldConfig[] = [
  { name: 'role', label: 'Role', type: 'text', half: true },
  { name: 'company', label: 'Company', type: 'text', half: true },
  { name: 'location', label: 'Location', type: 'text', half: true },
  { name: 'employment_type', label: 'Employment type', type: 'text', half: true },
  { name: 'company_url', label: 'Company URL', type: 'text' },
  { name: 'start_date', label: 'Start date', type: 'date', half: true },
  {
    name: 'end_date',
    label: 'End date',
    type: 'date',
    half: true,
    help: 'Leave blank if this is your current role.',
  },
  { name: 'is_current', label: 'This is my current role', type: 'toggle', half: true },
  { name: 'is_published', label: 'Published', type: 'toggle', half: true },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  {
    name: 'highlights',
    label: 'Highlights',
    type: 'tags',
    placeholder: 'One achievement per entry, press Enter',
  },
  { name: 'tech_stack', label: 'Tech stack', type: 'tags' },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, min: 0 },
]

const EMPTY = {
  role: '',
  company: '',
  location: '',
  employment_type: 'Full-time',
  company_url: '',
  start_date: '',
  end_date: '',
  is_current: false,
  is_published: true,
  description: '',
  highlights: [],
  tech_stack: [],
  sort_order: 0,
}

export function ExperiencesPage() {
  return (
    <ResourcePage<Experience>
      title="Experience"
      description="Your career timeline as shown on the public site."
      endpoint="/admin/experiences"
      singular="Experience"
      fields={FIELDS}
      wideForm
      emptyValues={EMPTY}
      toForm={(experience) => ({
        ...EMPTY,
        ...experience,
        location: experience.location ?? '',
        company_url: experience.company_url ?? '',
        end_date: experience.end_date ?? '',
        description: experience.description ?? '',
        highlights: experience.highlights ?? [],
        tech_stack: experience.tech_stack ?? [],
      })}
      columns={[
        {
          header: 'Role',
          render: (experience) => (
            <div>
              <p className="font-medium text-ink-100">{experience.role}</p>
              <p className="mt-0.5 text-xs text-ink-500">{experience.company}</p>
            </div>
          ),
        },
        {
          header: 'Period',
          render: (experience) => (
            <span className="font-mono text-xs text-ink-400">{experience.period}</span>
          ),
        },
        {
          header: 'Status',
          render: (experience) => (
            <div className="flex flex-wrap gap-1.5">
              {experience.is_current && <Badge tone="success">Current</Badge>}
              <Badge tone={experience.is_published ? 'neutral' : 'warning'}>
                {experience.is_published ? 'Published' : 'Hidden'}
              </Badge>
            </div>
          ),
        },
      ]}
    />
  )
}
