import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // Local sisad-pdfme packages (integrated under src/sisad-pdfme)
      '@sisad-pdfme/common': path.resolve(__dirname, 'src/sisad-pdfme/common'),
      '@sisad-pdfme/ui': path.resolve(__dirname, 'src/sisad-pdfme/ui'),
      '@sisad-pdfme/generator': path.resolve(__dirname, 'src/sisad-pdfme/generator'),
      '@sisad-pdfme/schemas': path.resolve(__dirname, 'src/sisad-pdfme/schemas'),
      // Point to the browser entry so Vite resolves a file, not a directory
      '@sisad-pdfme/converter': path.resolve(__dirname, 'src/sisad-pdfme/converter/index.browser.ts'),
      '@sisad-pdfme/pdf-lib': path.resolve(__dirname, 'src/sisad-pdfme/pdf-lib'),
    }
  },
  server: {
    port: 5174,
    host: true
  }
})
