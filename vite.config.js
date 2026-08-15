import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    /**
     * Alias como lista de reglas ancladas, no como mapa de prefijos.
     *
     * Con claves de texto Vite sustituye por PREFIJO, así que
     * `@sisad-pdfme/converter` capturaba también
     * `@sisad-pdfme/converter/createEnvironmentConverters` y lo convertía en
     * `…/index.browser.ts/createEnvironmentConverters`, una ruta imposible.
     * Anclar el final con `$` deja que sólo el especificador exacto apunte al
     * entrypoint de navegador y que el resto caiga en la regla general.
     *
     * La regla general reproduce `"@sisad-pdfme/*"` del tsconfig: sin ella,
     * imports internos que TypeScript resuelve sin problema fallaban sólo en
     * `npm run build`.
     */
    alias: [
      {
        find: /^@sisad-pdfme\/converter$/,
        replacement: path.resolve(__dirname, 'src/sisad-pdfme/converter/index.browser.ts'),
      },
      { find: /^@sisad-pdfme\//, replacement: `${path.resolve(__dirname, 'src/sisad-pdfme')}/` },
      { find: /^@\//, replacement: `${path.resolve(__dirname, 'src')}/` },
    ],
  },
  server: {
    port: 5174,
    host: '0.0.0.0',
    strictPort: true
  }
})
