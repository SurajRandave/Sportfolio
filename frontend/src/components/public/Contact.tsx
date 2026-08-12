import { useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Mail, MapPin, Phone, Send } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/ui/BrandIcons'
import { Section } from '@/components/ui/Section'
import { Reveal } from '@/components/ui/Reveal'
import { api, errorMessage, validationErrors } from '@/lib/api'
import { cn } from '@/lib/format'
import type { EnquiryType, Profile } from '@/lib/types'

const ENQUIRY_TYPES: { value: EnquiryType; label: string }[] = [
  { value: 'freelance', label: 'Freelance project' },
  { value: 'hire', label: 'Full-time role' },
  { value: 'collaboration', label: 'Collaboration' },
  { value: 'other', label: 'Something else' },
]

const BUDGETS = ['Under â‚¹25k', 'â‚¹25k - â‚¹75k', 'â‚¹75k - â‚¹2L', 'â‚¹2L+', 'Not sure yet']

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  company: '',
  subject: '',
  message: '',
  enquiry_type: 'freelance' as EnquiryType,
  budget_range: '',
  timeline: '',
  website: '', // honeypot
}

export function Contact({ profile }: { profile: Profile | null }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle')
  const [feedback, setFeedback] = useState<string | null>(null)

  function update<K extends keyof typeof EMPTY_FORM>(field: K, value: (typeof EMPTY_FORM)[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => {
      if (!(field in prev)) return prev
      const next = { ...prev }
      delete next[field as string]
      return next
    })
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setStatus('sending')
    setErrors({})
    setFeedback(null)

    try {
      // Strip empty optional fields so they arrive as absent, not "".
      const payload = Object.fromEntries(
        Object.entries(form).filter(([key, value]) => key === 'website' || value !== ''),
      )
      const { data } = await api.post<{ message: string }>('/contact', payload)

      setStatus('sent')
      setFeedback(data.message)
      setForm(EMPTY_FORM)
    } catch (error) {
      setStatus('idle')
      const fieldErrors = validationErrors(error)
      setErrors(fieldErrors)
      if (Object.keys(fieldErrors).length === 0) {
        setFeedback(errorMessage(error, 'Could not send your message. Please try again.'))
      }
    }
  }

  const inputClass =
    'w-full rounded-lg border border-ink-700 bg-ink-900/60 px-3.5 py-2.5 text-sm text-ink-100 placeholder-ink-500 outline-none transition-colors focus:border-brand-500 focus:ring-1 focus:ring-brand-500'

  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title="Let's build something"
      description="Freelance project, full-time role, or just a question about a stack decision - send it over. I reply within 24 hours."
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_1.4fr]">
        <Reveal>
          <div className="space-y-6">
            <div className="panel space-y-4 rounded-xl p-6">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-3 text-sm text-ink-200 transition-colors hover:text-brand-300"
                >
                  <Mail size={17} className="shrink-0 text-brand-400" />
                  {profile.email}
                </a>
              )}
              {profile?.phone && (
                <a
                  href={`tel:${profile.phone.replace(/\s/g, '')}`}
                  className="flex items-center gap-3 text-sm text-ink-200 transition-colors hover:text-brand-300"
                >
                  <Phone size={17} className="shrink-0 text-brand-400" />
                  {profile.phone}
                </a>
              )}
              {profile?.location && (
                <p className="flex items-center gap-3 text-sm text-ink-200">
                  <MapPin size={17} className="shrink-0 text-brand-400" />
                  {profile.location}
                </p>
              )}

              <div className="flex gap-3 border-t border-ink-800 pt-4">
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    className="rounded-lg border border-ink-700 p-2.5 text-ink-300 transition-colors hover:border-ink-600 hover:text-ink-100"
                  >
                    <GithubIcon size={17} />
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a
                    href={profile.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="rounded-lg border border-ink-700 p-2.5 text-ink-300 transition-colors hover:border-ink-600 hover:text-ink-100"
                  >
                    <LinkedinIcon size={17} />
                  </a>
                )}
              </div>
            </div>

            {profile?.is_available_for_freelance && profile.availability_note && (
              <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/8 p-5">
                <p className="text-sm leading-relaxed text-emerald-200">
                  {profile.availability_note}
                </p>
              </div>
            )}
          </div>
        </Reveal>

        <Reveal delay={120}>
          {status === 'sent' ? (
            <div className="panel flex h-full flex-col items-center justify-center rounded-xl p-10 text-center">
              <CheckCircle2 size={44} className="mb-4 text-emerald-400" />
              <h3 className="text-lg font-semibold text-ink-100">Message sent</h3>
              <p className="mt-2 max-w-sm text-sm text-ink-300">{feedback}</p>
              <button
                type="button"
                onClick={() => {
                  setStatus('idle')
                  setFeedback(null)
                }}
                className="mt-6 text-sm font-medium text-brand-400 hover:text-brand-300"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="panel rounded-xl p-6">
              {/* Honeypot - hidden from people, irresistible to bots. */}
              <input
                type="text"
                name="website"
                value={form.website}
                onChange={(e) => update('website', e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden
                className="absolute h-0 w-0 opacity-0"
              />

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name" error={errors.name} required>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update('name', e.target.value)}
                    placeholder="Your name"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Email" error={errors.email} required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update('email', e.target.value)}
                    placeholder="you@company.com"
                    className={inputClass}
                    required
                  />
                </Field>

                <Field label="Phone" error={errors.phone}>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => update('phone', e.target.value)}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </Field>

                <Field label="Company" error={errors.company}>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => update('company', e.target.value)}
                    placeholder="Optional"
                    className={inputClass}
                  />
                </Field>
              </div>

              <div className="mt-4">
                <span className="mb-2 block text-xs font-medium uppercase tracking-wide text-ink-400">
                  What is this about?
                </span>
                <div className="flex flex-wrap gap-2">
                  {ENQUIRY_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => update('enquiry_type', type.value)}
                      className={cn(
                        'rounded-full border px-3.5 py-1.5 text-xs transition-colors',
                        form.enquiry_type === type.value
                          ? 'border-brand-500 bg-brand-500/15 text-brand-200'
                          : 'border-ink-700 text-ink-400 hover:border-ink-600 hover:text-ink-200',
                      )}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              {form.enquiry_type === 'freelance' && (
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <Field label="Budget" error={errors.budget_range}>
                    <select
                      value={form.budget_range}
                      onChange={(e) => update('budget_range', e.target.value)}
                      className={inputClass}
                    >
                      <option value="">Select a range</option>
                      {BUDGETS.map((budget) => (
                        <option key={budget} value={budget}>
                          {budget}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Timeline" error={errors.timeline}>
                    <input
                      type="text"
                      value={form.timeline}
                      onChange={(e) => update('timeline', e.target.value)}
                      placeholder="e.g. 4-6 weeks"
                      className={inputClass}
                    />
                  </Field>
                </div>
              )}

              <div className="mt-4">
                <Field label="Message" error={errors.message} required>
                  <textarea
                    value={form.message}
                    onChange={(e) => update('message', e.target.value)}
                    rows={5}
                    placeholder="Tell me what you're building, and what you need from me."
                    className={cn(inputClass, 'resize-y')}
                    required
                  />
                </Field>
              </div>

              {feedback && status === 'idle' && (
                <p className="mt-4 rounded-lg border border-rose-500/30 bg-rose-500/10 px-3.5 py-2.5 text-sm text-rose-200">
                  {feedback}
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-500 px-5 py-3 text-sm font-medium text-ink-950 transition-colors hover:bg-brand-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Send message
                  </>
                )}
              </button>
            </form>
          )}
        </Reveal>
      </div>
    </Section>
  )
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-ink-400">
        {label}
        {required && <span className="ml-0.5 text-rose-400">*</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-xs text-rose-300">{error}</span>}
    </label>
  )
}
