import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const fixtureRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(fixtureRoot, '../../..');

export default defineConfig({
  root: fixtureRoot,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(repoRoot, 'src'),
      '@sisad-pdfme/common': path.resolve(repoRoot, 'src/sisad-pdfme/common'),
      '@sisad-pdfme/ui': path.resolve(repoRoot, 'src/sisad-pdfme/ui'),
      '@sisad-pdfme/generator': path.resolve(repoRoot, 'src/sisad-pdfme/generator'),
      '@sisad-pdfme/schemas': path.resolve(repoRoot, 'src/sisad-pdfme/schemas'),
      '@sisad-pdfme/converter': path.resolve(repoRoot, 'src/sisad-pdfme/converter/index.browser.ts'),
    },
  },
  build: {
    outDir: path.resolve(process.env.PUBLIC_CONSUMER_OUT_DIR ?? path.resolve(fixtureRoot, 'dist')),
    emptyOutDir: true,
  },
});
