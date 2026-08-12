import { useState, type KeyboardEvent } from 'react'
import { X } from 'lucide-react'
import { inputClass } from './ui'
import { cn } from '@/lib/format'

export type FieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'date'
  | 'select'
  | 'toggle'
  | 'tags'

export interface FieldConfig {
  name: string
  label: string
  type: FieldType
  placeholder?: string
  help?: string
  rows?: number
  /** Renders the field at half width on wide screens. */
  half?: boolean
  options?: { value: string | number; label: string }[]
  min?: number
  max?: number
}

export type FormValues = Record<string, unknown>

interface AutoFormProps {
  fields: FieldConfig[]
  values: FormValues
  errors: Record<string, string>
  onChange: (name: string, value: unknown) => void
}

/**
 * Renders an admin form from a field schema. Every CRUD screen describes its
 * shape as a FieldConfig[] instead of hand-writing near-identical markup.
 */
export function AutoForm({ fields, values, errors, onChange }: AutoFormProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {fields.map((field) => (
        <div key={field.name} className={cn(field.half ? 'sm:col-span-1' : 'sm:col-span-2')}>
          <FieldRenderer
            field={field}
            value={values[field.name]}
            error={errors[field.name]}
            onChange={(value) => onChange(field.name, value)}
          />
        </div>
      ))}
    </div>
  )
}

function FieldRenderer({
  field,
  value,
  error,
  onChange,
}: {
  field: FieldConfig
  value: unknown
  error?: string
  onChange: (value: unknown) => void
}) {
  const label = (
    <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-400">
      {field.label}
    </span>
  )

  const help = field.help && <span className="mt-1 block text-xs text-ink-500">{field.help}</span>
  const errorNode = error && <span className="mt-1 block text-xs text-rose-300">{error}</span>

  if (field.type === 'toggle') {
    return (
      <div>
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => onChange(e.target.checked)}
            className="h-4 w-4 rounded border-ink-600 bg-ink-900 accent-brand-500"
          />
          <span className="text-sm text-ink-100">{field.label}</span>
        </label>
        {help}
        {errorNode}
      </div>
    )
  }

  if (field.type === 'tags') {
    return (
      <div>
        {label}
        <TagsInput
          value={Array.isArray(value) ? (value as string[]) : []}
          placeholder={field.placeholder}
          onChange={onChange}
        />
        {help}
        {errorNode}
      </div>
    )
  }

  return (
    <label className="block">
      {label}

      {field.type === 'textarea' && (
        <textarea
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows ?? 4}
          placeholder={field.placeholder}
          className={cn(inputClass, 'resize-y')}
        />
      )}

      {field.type === 'select' && (
        <select
          value={(value as string) ?? ''}
          onChange={(e) => onChange(e.target.value)}
          className={inputClass}
        >
          <option value="">Select...</option>
          {field.options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {(field.type === 'text' || field.type === 'date' || field.type === 'number') && (
        <input
          type={field.type}
          value={(value as string | number) ?? ''}
          onChange={(e) =>
            onChange(
              field.type === 'number'
                ? e.target.value === ''
                  ? null
                  : Number(e.target.value)
                : e.target.value,
            )
          }
          placeholder={field.placeholder}
          min={field.min}
          max={field.max}
          className={inputClass}
        />
      )}

      {help}
      {errorNode}
    </label>
  )
}

/** Chip-style editor for the JSON string arrays (tech_stack, highlights, features). */
function TagsInput({
  value,
  placeholder,
  onChange,
}: {
  value: string[]
  placeholder?: string
  onChange: (value: string[]) => void
}) {
  const [draft, setDraft] = useState('')

  function commit() {
    const entry = draft.trim()
    if (!entry) return
    if (!value.includes(entry)) onChange([...value, entry])
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault()
      commit()
    }
    if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      onChange(value.slice(0, -1))
    }
  }

  return (
    <div className="rounded-lg border border-ink-700 bg-ink-900/60 p-2 focus-within:border-brand-500">
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-ink-800 py-1 pl-3 pr-1.5 text-xs text-ink-200"
            >
              {tag}
              <button
                type="button"
                onClick={() => onChange(value.filter((t) => t !== tag))}
                aria-label={`Remove ${tag}`}
                className="rounded-full p-0.5 text-ink-400 transition-colors hover:bg-ink-700 hover:text-ink-100"
              >
                <X size={11} />
              </button>
            </span>
          ))}
        </div>
      )}

      <input
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={commit}
        placeholder={placeholder ?? 'Type and press Enter'}
        className="w-full bg-transparent px-1.5 py-1 text-sm text-ink-100 placeholder-ink-500 outline-none"
      />
    </div>
  )
}
