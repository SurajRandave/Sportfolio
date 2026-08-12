import { useEffect, useState, type ChangeEvent } from 'react'
import { Check, FileText, Image as ImageIcon, Loader2, Upload } from 'lucide-react'
import { AutoForm, type FieldConfig, type FormValues } from '@/components/admin/AutoForm'
import { PageHeader, Toast } from '@/components/admin/ui'
import { api, errorMessage, validationErrors } from '@/lib/api'
import type { Profile } from '@/lib/types'

const FIELDS: FieldConfig[] = [
  { name: 'full_name', label: 'Full name', type: 'text', half: true },
  { name: 'headline', label: 'Headline', type: 'text', half: true },
  {
    name: 'tagline',
    label: 'Tagline',
    type: 'text',
    help: 'The one-liner under your name in the hero.',
  },
  {
    name: 'summary',
    label: 'About me',
    type: 'textarea',
    rows: 8,
    help: 'Separate paragraphs with a blank line.',
  },
  { name: 'email', label: 'Email', type: 'text', half: true },
  { name: 'phone', label: 'Phone', type: 'text', half: true },
  { name: 'location', label: 'Location', type: 'text', half: true },
  { name: 'years_experience', label: 'Years of experience', type: 'number', half: true, min: 0 },
  { name: 'github_url', label: 'GitHub URL', type: 'text', half: true },
  { name: 'linkedin_url', label: 'LinkedIn URL', type: 'text', half: true },
  { name: 'is_available_for_freelance', label: 'Available for freelance', type: 'toggle', half: true },
  { name: 'availability_note', label: 'Availability note', type: 'text' },
  { name: 'meta_title', label: 'SEO title', type: 'text' },
  { name: 'meta_description', label: 'SEO description', type: 'textarea', rows: 2 },
]

export function ProfilePage() {
  const [values, setValues] = useState<FormValues>({})
  const [profile, setProfile] = useState<Profile | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<'avatar' | 'resume' | null>(null)
  const [toast, setToast] = useState<{ message: string; tone: 'success' | 'error' } | null>(null)

  function notify(message: string, tone: 'success' | 'error' = 'success') {
    setToast({ message, tone })
    setTimeout(() => setToast(null), 3000)
  }

  function hydrate(data: Profile | null) {
    setProfile(data)
    if (!data) return
    setValues({
      ...data,
      tagline: data.tagline ?? '',
      phone: data.phone ?? '',
      location: data.location ?? '',
      github_url: data.github_url ?? '',
      linkedin_url: data.linkedin_url ?? '',
      availability_note: data.availability_note ?? '',
      meta_title: data.meta_title ?? '',
      meta_description: data.meta_description ?? '',
    })
  }

  useEffect(() => {
    api
      .get<{ data: Profile | null }>('/admin/profile')
      .then(({ data }) => hydrate(data.data))
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    setErrors({})

    try {
      const { data } = await api.put<{ data: Profile }>('/admin/profile', values)
      hydrate(data.data)
      notify('Profile saved. Reload the public site to see it.')
    } catch (error) {
      const fieldErrors = validationErrors(error)
      setErrors(fieldErrors)
      notify(
        Object.keys(fieldErrors).length > 0
          ? 'Check the highlighted fields.'
          : errorMessage(error, 'Save failed.'),
        'error',
      )
    } finally {
      setSaving(false)
    }
  }

  async function upload(type: 'avatar' | 'resume', event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(type)
    const body = new FormData()
    body.append('type', type)
    body.append('file', file)

    try {
      const { data } = await api.post<{ data: Profile }>('/admin/profile/asset', body)
      hydrate(data.data)
      notify(`${type === 'avatar' ? 'Photo' : 'Resume'} uploaded.`)
    } catch (error) {
      notify(errorMessage(error, 'Upload failed.'), 'error')
    } finally {
      setUploading(null)
      event.target.value = ''
    }
  }

  if (loading) {
    return (
      <div className="grid place-items-center py-24">
        <Loader2 size={26} className="animate-spin text-brand-400" />
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Profile"
        description="Everything in the hero, about and contact sections of the public site."
      />

      <div className="panel mb-6 rounded-xl p-6">
        <h2 className="mb-5 text-sm font-semibold text-ink-100">Files</h2>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {/* Live preview of the photo the public hero is using. */}
          <div className="shrink-0">
            <div className="relative h-40 w-32 overflow-hidden rounded-xl border border-ink-700 bg-ink-900">
              {profile?.avatar_url ? (
                <a href={profile.avatar_url} target="_blank" rel="noreferrer" title="Open full size">
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name ?? 'Profile photo'}
                    className="h-full w-full object-cover object-top"
                  />
                </a>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-600">
                  <ImageIcon size={26} />
                  <span className="px-3 text-center text-[0.65rem] leading-tight">
                    No photo yet
                  </span>
                </div>
              )}

              {uploading === 'avatar' && (
                <div className="absolute inset-0 grid place-items-center bg-ink-950/70">
                  <Loader2 size={22} className="animate-spin text-brand-400" />
                </div>
              )}
            </div>

            <p className="mt-2 text-center text-[0.65rem] text-ink-500">
              {profile?.avatar_url ? 'Shown in the hero' : 'Portrait, 3:4 works best'}
            </p>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap gap-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-700 px-4 py-2.5 text-sm text-ink-200 transition-colors hover:border-brand-500/50 hover:bg-ink-800">
                {uploading === 'avatar' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <Upload size={15} />
                )}
                {profile?.avatar_url ? 'Replace photo' : 'Upload photo'}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => upload('avatar', e)}
                />
              </label>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-ink-700 px-4 py-2.5 text-sm text-ink-200 transition-colors hover:border-brand-500/50 hover:bg-ink-800">
                {uploading === 'resume' ? (
                  <Loader2 size={15} className="animate-spin" />
                ) : (
                  <FileText size={15} />
                )}
                {profile?.resume_url ? 'Replace resume' : 'Upload resume PDF'}
                <input
                  type="file"
                  accept="application/pdf"
                  hidden
                  onChange={(e) => upload('resume', e)}
                />
              </label>
            </div>

            <dl className="mt-5 space-y-2.5 text-sm">
              <div className="flex items-center gap-2">
                <dt className="w-20 text-xs uppercase tracking-wide text-ink-500">Photo</dt>
                <dd>
                  {profile?.avatar_url ? (
                    <span className="inline-flex items-center gap-1.5 text-emerald-400">
                      <Check size={14} /> Uploaded
                    </span>
                  ) : (
                    <span className="text-ink-500">Not uploaded — the hero shows a monogram</span>
                  )}
                </dd>
              </div>

              <div className="flex items-center gap-2">
                <dt className="w-20 text-xs uppercase tracking-wide text-ink-500">Resume</dt>
                <dd>
                  {profile?.resume_url ? (
                    <a
                      href={profile.resume_url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-brand-400 hover:text-brand-300"
                    >
                      <Check size={14} /> View current PDF
                    </a>
                  ) : (
                    <span className="text-ink-500">
                      Not uploaded — the Resume button stays hidden
                    </span>
                  )}
                </dd>
              </div>
            </dl>

            <p className="mt-4 text-xs text-ink-500">
              Images and PDFs up to 8&nbsp;MB. Uploading replaces the previous file.
            </p>
          </div>
        </div>
      </div>

      <div className="panel rounded-xl p-6">
        <AutoForm
          fields={FIELDS}
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

        <div className="mt-6 flex justify-end border-t border-ink-800 pt-5">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400 disabled:opacity-60"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            Save profile
          </button>
        </div>
      </div>

      {toast && <Toast message={toast.message} tone={toast.tone} />}
    </>
  )
}
