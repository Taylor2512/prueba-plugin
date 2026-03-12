import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Prefer integrated copies under src/_pdfme if present, otherwise fall back to vendor.
const integratedBase = path.resolve(__dirname, './src/_pdfme')
const vendorBase = path.resolve(__dirname, './vendor/pdfme')
const pkgMap = {
  common: 'common',
  converter: 'converter',
  generator: 'generator',
  'pdf-lib': 'pdf-lib',
  schemas: 'schemas',
  ui: 'ui'
}
const pdfmeAliases = {}
for (const [key, dir] of Object.entries(pkgMap)) {
  const integratedPath = path.join(integratedBase, dir, 'src', 'index.ts')
  const vendorPath = key === 'converter'
    ? path.join(vendorBase, dir, 'src', 'index.browser.ts')
    : path.join(vendorBase, dir, 'src', 'index.ts')
  if (fs.existsSync(integratedPath)) {
    pdfmeAliases[`@pdfme/${key}`] = integratedPath
  } else if (fs.existsSync(vendorPath)) {
    pdfmeAliases[`@pdfme/${key}`] = vendorPath
  }
}

export default defineConfig({
  plugins: [react({ jsxRuntime: 'automatic' })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      ...pdfmeAliases
    }
  },
  // Dev server tuned for large local vendor / integrated sources (pdfme)
  server: {
    port: Number(process.env.VITE_PORT) || 5173,
    host: process.env.VITE_HOST || true,
    fs: {
      // allow Vite to serve files from vendor and integrated src during development
      allow: [path.resolve(__dirname, 'vendor'), path.resolve(__dirname, 'src')]
    },
    // make HMR more resilient for large codebases / virtual files
    hmr: {
      overlay: true,
      protocol: process.env.VITE_HMR_PROTOCOL || undefined
    },
    watch: {
      // rely on chokidar defaults but ensure node_modules/dist are ignored while vendor/src is watched
      ignored: ['**/dist/**', '**/node_modules/**', '!vendor/**']
    }
  },

  // Dependency optimization and build tuning
  optimizeDeps: {
    // Pre-bundle common runtime libs used by integrated pdfme sources to speed up cold dev starts
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      'lucide-react',
      'pdfjs-dist',
      'date-fns',
      'uuid'
    ].concat(Object.keys(pdfmeAliases)),
    // Exclude very large libs that should be treated as explicit chunks (if needed)
    exclude: []
  },

  build: {
    target: 'es2020',
    sourcemap: false,
    // split vendor and pdfme code into separate chunks for better caching
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id) return null
          if (id.includes('node_modules')) return 'vendor'
          if (id.includes(path.join('src', '_pdfme')) || id.includes(path.join('vendor', 'pdfme'))) return 'pdfme'
          return null
        }
      }
    },
    // increase memory via external env setting handled by package.json build scripts
    chunkSizeWarningLimit: 2000
  },

  // small miscellaneous performance options
  esbuild: {
    target: 'es2020'
  },
  cacheDir: path.resolve(__dirname, 'node_modules/.vite'),
  logLevel: 'info'
})
