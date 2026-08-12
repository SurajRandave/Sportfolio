import { useEffect, useState } from 'react'

/**
 * Whether it is appropriate to mount the Three.js scenes.
 *
 * Skipped on small screens (the carousel needs room and the GPU cost is real
 * on phones) and whenever the visitor has asked for reduced motion.
 */
export function useRichVisuals(minWidth = 768): boolean {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const wideEnough = window.matchMedia(`(min-width: ${minWidth}px)`)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => setEnabled(wideEnough.matches && !reducedMotion.matches)
    update()

    wideEnough.addEventListener('change', update)
    reducedMotion.addEventListener('change', update)

    return () => {
      wideEnough.removeEventListener('change', update)
      reducedMotion.removeEventListener('change', update)
    }
  }, [minWidth])

  return enabled
}
