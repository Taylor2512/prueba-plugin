# package.json por paquete

## 1. Objetivo

Definir `package.json` reales por módulo para una plataforma publicable.

## 2. Paquete `contracts`

```json
{
  "name": "@platform/pdf/contracts",
  "version": "0.1.0",
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
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "test": "vitest run",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  }
}
```

## 3. Paquete `core`

```json
{
  "name": "@platform/pdf/core",
  "version": "0.1.0",
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
  },
  "dependencies": {
    "@platform/pdf/contracts": "workspace:*"
  }
}
```

## 4. Paquete `editor`

```json
{
  "name": "@platform/pdf/editor",
  "version": "0.1.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    },
    "./styles.css": "./dist/styles.css",
    "./experimental": {
      "types": "./dist/experimental.d.ts",
      "import": "./dist/experimental.js",
      "require": "./dist/experimental.cjs"
    }
  },
  "files": ["dist"],
  "peerDependencies": {
    "react": "^18 || ^19",
    "react-dom": "^18 || ^19"
  },
  "dependencies": {
    "@platform/pdf/contracts": "workspace:*",
    "@platform/pdf/core": "workspace:*",
    "@platform/pdf/schemas": "workspace:*"
  }
}
```

## 5. Paquete `generator`

Debe depender solo de contratos y `pdf-lib` encapsulado.

## 6. Paquete `converter`

Conviene exponer browser y node por subpaths o conditions.

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

## 7. Paquete `schemas`

Debe exportar:
- built-ins
- registradores
- helpers de plugin
- contratos de family plugin

## 8. Paquete `collaboration`

Conviene aislarlo para venderlo como add-on enterprise.

## 9. Campo `publishConfig`

Para registry privado:

```json
{
  "publishConfig": {
    "access": "restricted",
    "registry": "https://npm.my-company.example/"
  }
}
```

## 10. Recomendaciones

- todos los paquetes deben declarar `files: ["dist"]`
- no publicar `src/` salvo necesidad extrema
- peer deps claras para `editor`
- `sideEffects` documentado si el paquete usa CSS global

## 11. Ejemplo `sideEffects`

```json
{
  "sideEffects": [
    "./dist/styles.css"
  ]
}
```

## 12. Riesgo a evitar

No meter en `editor` dependencias internas de laboratorio como rutas `features/`.
