# Build ESM/CJS y generación de tipos

## 1. Objetivo

Entregar paquetes consumibles por:
- Vite
- Webpack
- Node
- SSR
- tooling TypeScript

## 2. Estrategia recomendada

Publicar:
- ESM como formato principal
- CJS como compatibilidad
- `.d.ts` siempre
- sourcemaps
- CSS separado para `editor`

## 3. Herramientas recomendadas

### Opción A: tsup
Ideal para paquetes TS relativamente directos.

### Opción B: Rollup
Mejor si necesitas control fino sobre CSS, assets y múltiples outputs.

### Opción C: Vite library mode
Útil para `editor`, pero menos cómodo para monorepo entero si no lo orquestas bien.

## 4. Recomendación práctica

- `contracts`, `core`, `generator`, `converter`, `schemas`, `collaboration` -> `tsup`
- `editor` -> `vite build --lib` o `rollup`

## 5. Ejemplo `tsup.config.ts`

```ts
import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
  sourcemap: true,
  clean: true,
  external: ["react", "react-dom"],
});
```

## 6. Ejemplo `package.json`

```json
{
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  }
}
```

## 7. CSS del editor

El paquete `editor` probablemente necesita:
- CSS global del shell
- CSS de canvas
- tokens

Opciones:
1. exportar un CSS único
2. inyectar CSS desde JS
3. exportar estilos por separado

La opción más sana para vender/reusar:
- `@platform/pdf/editor/styles.css`

## 8. Tipos

Asegúrate de generar:
- tipos root
- tipos de subpaths
- declarations maps si vas a debuggear paquetes

## 9. Compatibilidad browser/node

`converter` ya tiene dos entrypoints (`index.browser.ts`, `index.node.ts`) en la base actual. Eso es excelente para definir exports condicionados.

```json
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "browser": "./dist/index.browser.js",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./node": {
      "types": "./dist/index.node.d.ts",
      "import": "./dist/index.node.js",
      "require": "./dist/index.node.cjs"
    }
  }
}
```

## 10. Peer dependencies recomendadas

Para `editor`:
- react
- react-dom

Para paquetes visuales quizás:
- antd o librería que realmente uses externamente

No empaquetes como dependencia fija lo que deba ser peer.

## 11. Testing del build

Validar:
- import ESM
- require CJS
- resolución de `types`
- CSS exportado
- tree shaking básico
