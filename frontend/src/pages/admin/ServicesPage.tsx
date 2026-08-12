import { ResourcePage } from '@/components/admin/ResourcePage'
import { Badge } from '@/components/admin/ui'
import { formatCurrency } from '@/lib/format'
import type { FieldConfig } from '@/components/admin/AutoForm'
import type { Service } from '@/lib/types'

const FIELDS: FieldConfig[] = [
  { name: 'title', label: 'Service', type: 'text', half: true },
  {
    name: 'icon',
    label: 'Icon',
    type: 'select',
    half: true,
    options: [
      { value: 'server', label: 'Server (backend)' },
      { value: 'code', label: 'Code (frontend)' },
      { value: 'activity', label: 'Activity (real-time)' },
      { value: 'layout', label: 'Layout (websites)' },
    ],
  },
  { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
  { name: 'features', label: "What's included", type: 'tags' },
  { name: 'starting_price', label: 'Starting price', type: 'number', half: true, min: 0 },
  { name: 'currency', label: 'Currency', type: 'text', half: true },
  { name: 'price_unit', label: 'Price unit', type: 'text', half: true },
  { name: 'delivery_days', label: 'Typical delivery (days)', type: 'number', half: true, min: 1 },
  { name: 'sort_order', label: 'Sort order', type: 'number', half: true, min: 0 },
  { name: 'is_active', label: 'Shown on the site', type: 'toggle', half: true },
]

const EMPTY = {
  title: '',
  icon: 'code',
  description: '',
  features: [],
  starting_price: null,
  currency: 'INR',
  price_unit: 'project',
  delivery_days: null,
  sort_order: 0,
  is_active: true,
}

export function ServicesPage() {
  return (
    <ResourcePage<Service>
      title="Services"
      description="Your freelance offering. These drive the Services section and its enquiry buttons."
      endpoint="/admin/services"
      singular="Service"
      fields={FIELDS}
      wideForm
      emptyValues={EMPTY}
      toForm={(service) => ({
        ...EMPTY,
        ...service,
        icon: service.icon ?? 'code',
        features: service.features ?? [],
        starting_price: service.starting_price ? Number(service.starting_price) : null,
      })}
      columns={[
        {
          header: 'Service',
          render: (service) => (
            <div>
              <p className="font-medium text-ink-100">{service.title}</p>
              <p className="mt-0.5 line-clamp-1 text-xs text-ink-500">{service.description}</p>
            </div>
          ),
        },
        {
          header: 'From',
          render: (service) => (
            <span className="text-ink-300">
              {formatCurrency(service.starting_price, service.currency) ?? '—'}
            </span>
          ),
        },
        {
          header: 'Delivery',
          render: (service) => (
            <span className="text-ink-400">
              {service.delivery_days ? `${service.delivery_days} days` : '—'}
            </span>
          ),
        },
        {
          header: 'Status',
          render: (service) => (
            <Badge tone={service.is_active ? 'success' : 'warning'}>
              {service.is_active ? 'Active' : 'Hidden'}
            </Badge>
          ),
        },
      ]}
    />
  )
}
