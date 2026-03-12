import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig(({ mode }) => {
  return {
      resolve: {
        alias: {
          // lucide package published without expected entrypoint; point to built ESM source
          'lucide': resolve(__dirname, '../../node_modules/lucide/dist/esm/lucide/src/lucide.js'),
        },
      },
    define: { 'process.env.NODE_ENV': JSON.stringify(mode) },
    plugins: [react(), tsconfigPaths({ root: '.' }), cssInjectedByJsPlugin()],
    build: {
      lib: {
        entry: 'src/index.ts',
        name: '@pdfme/ui',
        fileName: (format) => `index.${format}.js`,
      },
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'pdfjs-dist', 'antd', 'lucide'],
      exclude: ['@pdfme/common', '@pdfme/schemas', '@pdfme/converter'],
    },
  };
});
