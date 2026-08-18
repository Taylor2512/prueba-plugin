import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@sisad-pdfme': resolve(__dirname, 'src/sisad-pdfme'),
      '@sisad-pdfme/common': resolve(__dirname, 'src/sisad-pdfme/common'),
      '@': resolve(__dirname, 'src'),
      '@sisad-pdfme/converter': resolve(__dirname, 'src/sisad-pdfme/converter/index.browser.ts'),
      '@sisad-pdfme/generator': resolve(__dirname, 'src/sisad-pdfme/generator'),
      '@sisad-pdfme/schemas': resolve(__dirname, 'src/sisad-pdfme/schemas'),
       '@sisad-pdfme/ui': resolve(__dirname, 'src/sisad-pdfme/ui'),
      'antd/es/theme/internal': resolve(__dirname, 'node_modules/antd/es/theme/internal.js'),
    },
  },
  /**
   * El runtime automático de JSX, igual que `vite.config.js` vía
   * `@vitejs/plugin-react` y que `"jsx": "react-jsx"` del tsconfig.
   *
   * Sin esto vitest cae en la transformación clásica, que exige `React` en el
   * scope de cada módulo: importar cualquier surface real desde un test
   * revienta con `React is not defined` en componentes que —correctamente— no
   * importan React. Era la razón por la que los contratos sólo podían probar
   * módulos puros y no la superficie de integración.
   */
  esbuild: { jsx: 'automatic' },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/support/setupTests.ts',
    /**
     * Sólo capas de vitest. Los E2E viven bajo `tests/e2e/**` con extensión
     * `.spec.ts` y los ejecuta Playwright; `tests/support/**` son helpers y
     * `tests/tooling/**` son scripts de node que corren con `node` directo.
     */
    include: [
      'tests/unit/**/*.test.{ts,tsx,js,jsx}',
      'tests/integration/**/*.test.{ts,tsx,js,jsx}',
    ],
    exclude: ['**/node_modules/**', 'tests/e2e/**', 'tests/support/**', 'tests/tooling/**'],
    server: {
      deps: {
        inline: ['antd', 'rc-util'],
      },
    },
  },
});
