import { Eye, EyeOff, Star } from 'lucide-react'
import { ResourcePage } from '@/components/admin/ResourcePage'
import { Badge } from '@/components/admin/ui'
import { api } from '@/lib/api'
import type { FieldConfig } from '@/components/admin/AutoForm'
import type { Testimonial } from '@/lib/types'

const FIELDS: FieldConfig[] = [
  { name: 'client_name', label: 'Client name', type: 'text', half: true },
  { name: 'client_role', label: 'Their role', type: 'text', half: true },
  { name: 'company', label: 'Company', type: 'text', half: true },
  { name: 'rating', label: 'Rating (1-5)', type: 'number', half: true, min: 1, max: 5 },
  { name: 'message', label: 'Testimonial', type: 'textarea', rows: 4 },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, min: 0 },
  {
    name: 'is_approved',
    label: 'Approved (visible on the site)',
    type: 'toggle',
    half: true,
  },
  { name: 'is_featured', label: 'Featured', type: 'toggle', half: true },
]

const EMPTY = {
  client_name: '',
  client_role: '',
  company: '',
  rating: 5,
  message: '',
  sort_order: 0,
  is_approved: false,
  is_featured: false,
}

export function TestimonialsPage() {
  return (
    <ResourcePage<Testimonial>
      title="Testimonials"
      description="Feedback submitted from the site stays hidden until you approve it here."
      endpoint="/admin/testimonials"
      singular="Testimonial"
      fields={FIELDS}
      emptyValues={EMPTY}
      toForm={(testimonial) => ({
        ...EMPTY,
        ...testimonial,
        client_role: testimonial.client_role ?? '',
        company: testimonial.company ?? '',
      })}
      extraActions={(testimonial, reload) => (
        <button
          type="button"
          onClick={async () => {
            await api.patch(`/admin/testimonials/${testimonial.id}/approval`)
            reload()
          }}
          aria-label={testimonial.is_approved ? 'Hide from site' : 'Publish to site'}
          title={testimonial.is_approved ? 'Hide from site' : 'Publish to site'}
          className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-emerald-300"
        >
          {testimonial.is_approved ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      )}
      columns={[
        {
          header: 'Client',
          render: (testimonial) => (
            <div>
              <p className="font-medium text-ink-100">{testimonial.client_name}</p>
              <p className="mt-0.5 text-xs text-ink-500">
                {[testimonial.client_role, testimonial.company].filter(Boolean).join(' · ') || '—'}
              </p>
            </div>
          ),
        },
        {
          header: 'Message',
          render: (testimonial) => (
            <p className="line-clamp-2 max-w-sm text-xs text-ink-400">{testimonial.message}</p>
          ),
        },
        {
          header: 'Rating',
          render: (testimonial) => (
            <span className="inline-flex items-center gap-1 text-ink-300">
              <Star size={13} className="fill-amber-400 text-amber-400" />
              {testimonial.rating}
            </span>
          ),
        },
        {
          header: 'Status',
          render: (testimonial) => (
            <Badge tone={testimonial.is_approved ? 'success' : 'warning'}>
              {testimonial.is_approved ? 'Published' : 'Pending'}
            </Badge>
          ),
        },
      ]}
    />
  )
}
