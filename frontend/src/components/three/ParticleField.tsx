import { useMemo, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useRichVisuals } from '@/hooks/useRichVisuals'
import { useTheme } from '@/hooks/useTheme'

const COUNT = 1400
const RADIUS = 9

/**
 * Drifting point cloud that leans toward the cursor. Purely decorative —
 * it sits behind the whole page and is hidden from assistive tech.
 */
function Points({
  hotColor,
  coolColor,
  isLight,
}: {
  hotColor: string
  coolColor: string
  isLight: boolean
}) {
  const ref = useRef<THREE.Points>(null)
  const { viewport } = useThree()
  const pointer = useRef({ x: 0, y: 0 })

  // Positions and per-particle drift speeds, generated once.
  const { positions, speeds } = useMemo(() => {
    const positions = new Float32Array(COUNT * 3)
    const speeds = new Float32Array(COUNT)

    for (let i = 0; i < COUNT; i++) {
      // Spherical distribution, biased outward so the centre stays readable.
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = RADIUS * (0.45 + Math.random() * 0.55)

      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.55
      positions[i * 3 + 2] = r * Math.cos(phi)
      speeds[i] = 0.25 + Math.random() * 0.75
    }

    return { positions, speeds }
  }, [])

  // Warm gradient across the cloud, brighter toward the centre.
  const colors = useMemo(() => {
    const colors = new Float32Array(COUNT * 3)
    const hot = new THREE.Color(hotColor)
    const cool = new THREE.Color(coolColor)
    const tmp = new THREE.Color()

    for (let i = 0; i < COUNT; i++) {
      const x = positions[i * 3]
      const y = positions[i * 3 + 1]
      const z = positions[i * 3 + 2]
      const distance = Math.sqrt(x * x + y * y + z * z) / RADIUS

      tmp.copy(hot).lerp(cool, Math.min(1, distance))
      colors[i * 3] = tmp.r
      colors[i * 3 + 1] = tmp.g
      colors[i * 3 + 2] = tmp.b
    }

    return colors
  }, [positions, hotColor, coolColor])

  useFrame((state, delta) => {
    const points = ref.current
    if (!points) return

    // Slow constant rotation, plus a gentle lean toward the pointer.
    points.rotation.y += delta * 0.045
    points.rotation.x += delta * 0.012

    pointer.current.x = state.pointer.x
    pointer.current.y = state.pointer.y

    points.position.x += (pointer.current.x * viewport.width * 0.045 - points.position.x) * 0.04
    points.position.y += (pointer.current.y * viewport.height * 0.045 - points.position.y) * 0.04

    // Breathe each particle along its own axis.
    const attribute = points.geometry.getAttribute('position') as THREE.BufferAttribute
    const array = attribute.array as Float32Array
    const t = state.clock.elapsedTime

    for (let i = 0; i < COUNT; i++) {
      array[i * 3 + 1] += Math.sin(t * speeds[i] * 0.4 + i) * delta * 0.045
    }
    attribute.needsUpdate = true
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      {/*
        Additive blending builds glow by adding light, which only works over a
        dark page - on white there is no headroom left to add to, so the dots
        turn into hard speckle. Light mode composites normally instead, at a
        smaller size and lower opacity so the field reads as a soft texture.
      */}
      <pointsMaterial
        size={isLight ? 0.026 : 0.032}
        vertexColors
        transparent
        opacity={isLight ? 0.42 : 0.85}
        sizeAttenuation
        depthWrite={false}
        blending={isLight ? THREE.NormalBlending : THREE.AdditiveBlending}
      />
    </points>
  )
}

/**
 * The page's single 3D effect: one fixed, full-viewport dot field sitting
 * behind everything. Fixed rather than per-section so the same cloud carries
 * across the whole page on one WebGL context, and so it drifts with the
 * viewport rather than scrolling away with the hero.
 *
 * Renders nothing on small screens or under prefers-reduced-motion.
 */
export default function ParticleField() {
  const richVisuals = useRichVisuals()
  const { theme } = useTheme()

  if (!richVisuals) return null

  // Amber reads on near-black but vanishes on white, so light mode drops to
  // the deeper ember tones the rest of the light palette uses.
  const isLight = theme === 'light'
  const hotColor = isLight ? '#b45309' : '#fbbf24'
  const coolColor = isLight ? '#c2410c' : '#ea580c'

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 11], fov: 55 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Points hotColor={hotColor} coolColor={coolColor} isLight={isLight} />
      </Canvas>
    </div>
  )
}
