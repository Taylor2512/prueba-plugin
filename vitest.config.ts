import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@pdfme/common': resolve(__dirname, 'src/pdfme/common/src'),
      '@pdfme/converter': resolve(__dirname, 'src/pdfme/converter/src/index.browser.ts'),
      '@pdfme/generator': resolve(__dirname, 'src/pdfme/generator/src'),
      '@pdfme/schemas': resolve(__dirname, 'src/pdfme/schemas/src'),
      '@pdfme/pdf-lib': resolve(__dirname, 'src/pdfme/pdf-lib/src'),
      '@pdfme/ui': resolve(__dirname, 'src/pdfme/ui/src'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/unit/setupTests.ts',
    include: ['tests/unit/**/*.test.{ts,tsx,js,jsx}'],
  },
});
