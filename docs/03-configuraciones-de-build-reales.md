# Configuraciones de build reales

## 1. Estrategia recomendada por paquete

### `contracts`, `core`, `generator`, `converter`, `schemas`, `collaboration`
Usar `tsup`.

### `editor`
Usar `vite build --lib` o `rollup` si necesitas mejor control de CSS/assets.

## 2. `tsup.config.ts` base

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  target: "es2020"
});
```

## 3. `vite.config.ts` para editor

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "PlatformPdfEditor",
      formats: ["es", "cjs"],
      fileName: (format) => format === "es" ? "index.js" : "index.cjs"
    },
    rollupOptions: {
      external: ["react", "react-dom"],
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM"
        }
      }
    }
  }
});
```

## 4. Build de CSS

### Opción recomendada
Importar los estilos desde `src/index.ts` del paquete editor y dejar que Vite emita `style.css`, luego renombrarlo a `styles.css` en postbuild.

## 5. Script de postbuild

```js
import fs from "node:fs";
import path from "node:path";

const from = path.resolve("dist/style.css");
const to = path.resolve("dist/styles.css");

if (fs.existsSync(from)) {
  fs.renameSync(from, to);
}
```

## 6. Build de tipos para editor

Si Vite no genera `.d.ts`, combinar con `tsc --emitDeclarationOnly` o `vite-plugin-dts`.

## 7. Build separado browser/node para converter

Puedes usar dos configs de `tsup` o dos entrypoints.

```ts
export default defineConfig([
  {
    entry: { index: "src/index.ts", "index.browser": "src/index.browser.ts" },
    format: ["esm", "cjs"],
    dts: true,
  },
  {
    entry: { "index.node": "src/index.node.ts" },
    platform: "node",
    format: ["esm", "cjs"],
    dts: true,
  }
]);
```

## 8. Tests de smoke build

Cada paquete debe tener una prueba mínima:
- importa el paquete
- instancia su API principal
- verifica resolución de `types`

## 9. Validaciones CI

- `pnpm build`
- `pnpm typecheck`
- `pnpm test`
- smoke example apps

## 10. Recomendación final

No mezclar el build del producto de laboratorio con el build de paquetes.
