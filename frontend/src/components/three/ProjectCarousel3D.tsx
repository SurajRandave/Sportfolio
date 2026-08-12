import { useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { ArrowUpRight } from 'lucide-react'
import * as THREE from 'three'
import type { Project } from '@/lib/types'

const RADIUS = 4.2
const AUTO_SPIN = 0.13
/** Pointer travel (px) past which a release counts as a drag, not a click. */
const DRAG_THRESHOLD = 6

interface SpinState {
  angle: number
  velocity: number
  dragging: boolean
}

/** One project rendered as real DOM, transformed into 3D space by drei. */
function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project
  index: number
  onOpen: () => void
}) {
  return (
    <Html transform distanceFactor={5} style={{ width: '320px' }}>
      <button
        type="button"
        onClick={onOpen}
        className="w-full cursor-pointer rounded-xl border border-ink-700/80 bg-ink-900/95 p-5 text-left shadow-2xl transition-colors hover:border-brand-500/60"
      >
        <div className="mb-2 flex items-center justify-between">
          <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-400">
            {project.category}
          </span>
          <span className="font-mono text-[0.6rem] text-ink-500">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-snug text-ink-100">{project.title}</h3>

        {project.role && <p className="mt-1 text-[0.7rem] text-ink-400">{project.role}</p>}

        <p className="mt-3 line-clamp-4 text-xs leading-relaxed text-ink-300">
          {project.summary}
        </p>

        {project.tech_stack && project.tech_stack.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-ink-700 px-2 py-0.5 font-mono text-[0.6rem] text-ink-400"
              >
                {tech}
              </span>
            ))}
          </div>
        )}

        <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-brand-400">
          Case study
          <ArrowUpRight size={12} />
        </span>
      </button>
    </Html>
  )
}

/**
 * The rotating ring. Spin state lives in a ref owned by the parent so the DOM
 * pointer handlers outside the Canvas can drive it directly.
 */
function Ring({
  projects,
  spin,
  onOpen,
}: {
  projects: Project[]
  spin: React.RefObject<SpinState>
  onOpen: (slug: string) => void
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    const ring = group.current
    if (!ring) return

    if (spin.current.dragging) {
      // The pointer handler is writing `angle` directly this frame.
      spin.current.velocity *= 0.9
    } else if (Math.abs(spin.current.velocity) > 0.0006) {
      spin.current.angle += spin.current.velocity // momentum after release
      spin.current.velocity *= 0.93
    } else {
      spin.current.angle += delta * AUTO_SPIN // idle drift
    }

    ring.rotation.y = spin.current.angle
  })

  return (
    <group ref={group}>
      {projects.map((project, i) => {
        const angle = (i / projects.length) * Math.PI * 2

        return (
          <group
            key={project.id}
            position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]}
            rotation={[0, angle, 0]}
          >
            <ProjectCard project={project} index={i} onOpen={() => onOpen(project.slug)} />
          </group>
        )
      })}
    </group>
  )
}

export default function ProjectCarousel3D({ projects }: { projects: Project[] }) {
  const navigate = useNavigate()
  const [showHint, setShowHint] = useState(true)

  const spin = useRef<SpinState>({ angle: 0, velocity: 0, dragging: false })
  const drag = useRef({ active: false, lastX: 0, travelled: 0 })

  if (projects.length === 0) return null

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    drag.current = { active: true, lastX: event.clientX, travelled: 0 }
    spin.current.dragging = true
    setShowHint(false)
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (!drag.current.active) return

    const dx = event.clientX - drag.current.lastX
    drag.current.lastX = event.clientX
    drag.current.travelled += Math.abs(dx)

    const step = dx * 0.006
    spin.current.angle += step
    spin.current.velocity = step
  }

  function endDrag() {
    drag.current.active = false
    spin.current.dragging = false
  }

  /** Swallows the click that ends a drag, so spinning never navigates away. */
  function handleOpen(slug: string) {
    if (drag.current.travelled > DRAG_THRESHOLD) return
    navigate(`/projects/${slug}`)
  }

  return (
    <div
      className="relative h-[30rem] w-full cursor-grab touch-pan-y select-none active:cursor-grabbing sm:h-[34rem]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerLeave={endDrag}
    >
      <Canvas
        camera={{ position: [0, 0.4, 7.6], fov: 46 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1.2} />
        <Ring projects={projects} spin={spin} onOpen={handleOpen} />
      </Canvas>

      {showHint && (
        <p className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full border border-ink-700 bg-ink-900/80 px-4 py-1.5 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-ink-400 backdrop-blur">
          Drag to rotate · click to open
        </p>
      )}
    </div>
  )
}
