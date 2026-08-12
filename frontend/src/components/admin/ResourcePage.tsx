import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import { AutoForm, type FieldConfig, type FormValues } from './AutoForm'
import { EmptyState, Modal, PageHeader, Toast } from './ui'
import { api, errorMessage, validationErrors } from '@/lib/api'

interface Identified {
  id: number
}

interface Column<T> {
  header: string
  render: (item: T) => ReactNode
  className?: string
}

interface ResourcePageProps<T extends Identified> {
  title: string
  description?: string
  endpoint: string
  singular: string
  fields: FieldConfig[]
  columns: Column<T>[]
  emptyValues: FormValues
  /** Maps a record back into form values when editing. */
  toForm: (item: T) => FormValues
  wideForm?: boolean
  extraActions?: (item: T, reload: () => void) => ReactNode
}

/**
 * One screen that handles list + create + edit + delete for any admin resource.
 * Each concrete page supplies a field schema and table columns.
 */
export function ResourcePage<T extends Identified>({
  title,
  description,
  endpoint,
  singular,
  fields,
  columns,
  emptyValues,
  toForm,
  wideForm,
  extraActions,
}: ResourcePageProps<T>) {
  const [items, setItems] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<T | null>(null)
  const [values, setValues] = useState<FormValues>(emptyValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)

  const notify = useCallback((message: string, tone: 'success' | 'error' = 'success') => {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 3200)
  }, [])

  const load = useCallback(() => {
    setLoading(true)
    api
      .get<{ data: T[] }>(endpoint)
      .then(({ data }) => setItems(data.data))
      .catch((error) => notify(errorMessage(error, `Could not load ${title.toLowerCase()}.`), 'error'))
      .finally(() => setLoading(false))
  }, [endpoint, title, notify])

  useEffect(load, [load])

  function openCreate() {
    setEditing(null)
    setValues(emptyValues)
    setErrors({})
    setModalOpen(true)
  }

  function openEdit(item: T) {
    setEditing(item)
    setValues(toForm(item))
    setErrors({})
    setModalOpen(true)
  }

  async function handleSave() {
    setSaving(true)
    setErrors({})

    try {
      if (editing) {
        await api.put(`${endpoint}/${editing.id}`, values)
        notify(`${singular} updated.`)
      } else {
        await api.post(endpoint, values)
        notify(`${singular} created.`)
      }
      setModalOpen(false)
      load()
    } catch (error) {
      const fieldErrors = validationErrors(error)
      setErrors(fieldErrors)
      if (Object.keys(fieldErrors).length === 0) {
        notify(errorMessage(error, 'Save failed.'), 'error')
      }
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(item: T) {
    if (!window.confirm(`Delete this ${singular.toLowerCase()}? This cannot be undone.`)) return

    try {
      await api.delete(`${endpoint}/${item.id}`)
      notify(`${singular} deleted.`)
      load()
    } catch (error) {
      notify(errorMessage(error, 'Delete failed.'), 'error')
    }
  }

  return (
    <>
      <PageHeader
        title={title}
        description={description}
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400"
          >
            <Plus size={16} />
            New {singular.toLowerCase()}
          </button>
        }
      />

      {loading ? (
        <div className="grid place-items-center py-20">
          <Loader2 size={24} className="animate-spin text-brand-400" />
        </div>
      ) : items.length === 0 ? (
        <EmptyState message={`No ${title.toLowerCase()} yet. Create the first one.`} />
      ) : (
        <div className="panel overflow-x-auto rounded-xl">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead>
              <tr className="border-b border-ink-800 text-xs uppercase tracking-wide text-ink-500">
                {columns.map((column) => (
                  <th key={column.header} className="px-5 py-3 font-medium">
                    {column.header}
                  </th>
                ))}
                <th className="px-5 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-ink-800/60 last:border-0 hover:bg-ink-900/40"
                >
                  {columns.map((column) => (
                    <td key={column.header} className={`px-5 py-4 ${column.className ?? ''}`}>
                      {column.render(item)}
                    </td>
                  ))}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1">
                      {extraActions?.(item, load)}
                      <button
                        type="button"
                        onClick={() => openEdit(item)}
                        aria-label="Edit"
                        className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-ink-800 hover:text-ink-100"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        aria-label="Delete"
                        className="rounded-lg p-2 text-ink-400 transition-colors hover:bg-rose-500/15 hover:text-rose-300"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={modalOpen}
        wide={wideForm}
        title={editing ? `Edit ${singular.toLowerCase()}` : `New ${singular.toLowerCase()}`}
        onClose={() => setModalOpen(false)}
      >
        <AutoForm
          fields={fields}
          values={values}
          errors={errors}
          onChange={(name, value) => {
            setValues((prev) => ({ ...prev, [name]: value }))
            setErrors((prev) => {
              if (!(name in prev)) return prev
              const next = { ...prev }
              delete next[name]
              return next
            })
          }}
        />

        <div className="mt-6 flex justify-end gap-3 border-t border-ink-800 pt-5">
          <button
            type="button"
            onClick={() => setModalOpen(false)}
            className="rounded-lg border border-ink-700 px-4 py-2.5 text-sm text-ink-200 transition-colors hover:bg-ink-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400 disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            {editing ? 'Save changes' : `Create ${singular.toLowerCase()}`}
          </button>
        </div>
      </Modal>

      {toast && <Toast message={toast.message} tone={toast.tone} />}
    </>
  )
}
