import { ResourcePage } from '@/components/admin/ResourcePage'
import { Badge } from '@/components/admin/ui'
import type { FieldConfig } from '@/components/admin/AutoForm'
import type { Skill } from '@/lib/types'

const CATEGORIES = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'database', label: 'Database' },
  { value: 'cloud', label: 'Cloud & DevOps' },
  { value: 'tools', label: 'Tools' },
  { value: 'concepts', label: 'Concepts' },
]

const FIELDS: FieldConfig[] = [
  { name: 'name', label: 'Skill', type: 'text', half: true },
  { name: 'category', label: 'Category', type: 'select', half: true, options: CATEGORIES },
  {
    name: 'proficiency',
    label: 'Proficiency (%)',
    type: 'number',
    half: true,
    min: 0,
    max: 100,
  },
  { name: 'years', label: 'Years of use', type: 'number', half: true, min: 0 },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, min: 0 },
  { name: 'is_featured', label: 'Featured skill', type: 'toggle', half: true },
]

const EMPTY = {
  name: '',
  category: 'frontend',
  proficiency: 75,
  years: 1,
  sort_order: 0,
  is_featured: false,
}

export function SkillsPage() {
  return (
    <ResourcePage<Skill>
      title="Skills"
      description="Grouped by category on the public site. Proficiency drives the bar width."
      endpoint="/admin/skills"
      singular="Skill"
      fields={FIELDS}
      emptyValues={EMPTY}
      toForm={(skill) => ({ ...EMPTY, ...skill })}
      columns={[
        {
          header: 'Skill',
          render: (skill) => <span className="font-medium text-ink-100">{skill.name}</span>,
        },
        {
          header: 'Category',
          render: (skill) => <Badge tone="brand">{skill.category}</Badge>,
        },
        {
          header: 'Proficiency',
          render: (skill) => (
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-ink-800">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
                  style={{ width: `${skill.proficiency}%` }}
                />
              </div>
              <span className="font-mono text-xs text-ink-400">{skill.proficiency}%</span>
            </div>
          ),
        },
        {
          header: 'Years',
          render: (skill) => <span className="text-ink-400">{skill.years}</span>,
        },
      ]}
    />
  )
}
