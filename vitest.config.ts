import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@sisad-pdfme/common': resolve(__dirname, 'src/sisad-pdfme/common'),
      '@': resolve(__dirname, 'src'),
      '@sisad-pdfme/converter': resolve(__dirname, 'src/sisad-pdfme/converter/index.browser.ts'),
      '@sisad-pdfme/generator': resolve(__dirname, 'src/sisad-pdfme/generator'),
      '@sisad-pdfme/schemas': resolve(__dirname, 'src/sisad-pdfme/schemas'),
       '@sisad-pdfme/ui': resolve(__dirname, 'src/sisad-pdfme/ui'),
      'antd/es/theme/internal': resolve(__dirname, 'node_modules/antd/es/theme/internal.js'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/unit/setupTests.ts',
    include: [
      'tests/unit/**/*.test.{ts,tsx,js,jsx}',
      'tests/integration/**/*.test.{ts,tsx,js,jsx}',
    ],
    server: {
      deps: {
        inline: ['antd', 'rc-util'],
      },
    },
  },
});
