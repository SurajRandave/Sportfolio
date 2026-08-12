import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { cn } from '@/lib/format'

/**
 * Shows a short share link with a one-click copy button.
 * Falls back to a hidden textarea where the clipboard API is unavailable
 * (Chrome blocks it on insecure origins other than localhost).
 */
export function CopyLink({ url, code }: { url: string; code: string }) {
  const [copied, setCopied] = useState(false)

  async function copy() {
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const field = document.createElement('textarea')
      field.value = url
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      document.execCommand('copy')
      document.body.removeChild(field)
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy ${url}`}
      className={cn(
        'inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 font-mono text-xs transition-colors',
        copied
          ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
          : 'border-ink-700 text-ink-300 hover:border-brand-500/50 hover:text-brand-300',
      )}
    >
      /p/{code}
      {copied ? <Check size={13} /> : <Copy size={13} />}
    </button>
  )
}
