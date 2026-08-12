import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'
import fs from 'node:fs'

/**
 * GitHub Pages serves this project from a subpath
 * (surajrandave.github.io/Sportfolio/), so assets must be built against that
 * base. Local dev stays at "/" — set VITE_BASE only in the Pages build.
 */
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const base = env.VITE_BASE || '/'

  return {
    base,
    plugins: [react(), tailwindcss(), spaFallbackFor404()],
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 5173,
    },
  }
})

/**
 * GitHub Pages has no server-side rewrites, so a deep link like
 * /Sportfolio/projects/idims-healthcare-erp 404s on refresh. Pages serves
 * 404.html for unknown paths without changing the URL, so shipping a copy of
 * index.html as 404.html lets React Router pick the route up as normal.
 */
function spaFallbackFor404() {
  return {
    name: 'spa-fallback-404',
    closeBundle() {
      const dist = path.resolve(import.meta.dirname, 'dist')
      const index = path.join(dist, 'index.html')
      if (fs.existsSync(index)) {
        fs.copyFileSync(index, path.join(dist, '404.html'))
      }
    },
  }
}
