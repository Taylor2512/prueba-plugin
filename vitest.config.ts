import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@sisad-pdfme/common': resolve(__dirname, 'src/sisad-pdfme/common'),
      '@sisad-pdfme/converter': resolve(__dirname, 'src/sisad-pdfme/converter/index.browser.ts'),
      '@sisad-pdfme/generator': resolve(__dirname, 'src/sisad-pdfme/generator'),
      '@sisad-pdfme/schemas': resolve(__dirname, 'src/sisad-pdfme/schemas'),
      '@sisad-pdfme/pdf-lib': resolve(__dirname, 'src/sisad-pdfme/pdf-lib'),
      '@sisad-pdfme/ui': resolve(__dirname, 'src/sisad-pdfme/ui'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/unit/setupTests.ts',
    include: ['tests/unit/**/*.test.{ts,tsx,js,jsx}'],
  },
});
