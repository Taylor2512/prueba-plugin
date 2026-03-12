import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Local pdfme packages (integrated under src/pdfme)
      '@pdfme/common': path.resolve(__dirname, 'src/pdfme/common/src'),
      '@pdfme/ui': path.resolve(__dirname, 'src/pdfme/ui/src'),
      '@pdfme/generator': path.resolve(__dirname, 'src/pdfme/generator/src'),
      '@pdfme/schemas': path.resolve(__dirname, 'src/pdfme/schemas/src'),
      // Point to the browser entry so Vite resolves a file, not a directory
      '@pdfme/converter': path.resolve(__dirname, 'src/pdfme/converter/src/index.browser.ts'),
      '@pdfme/pdf-lib': path.resolve(__dirname, 'src/pdfme/pdf-lib/src'),
    }
  },
  server: {
    port: 5173,
    host: true
  }
})
