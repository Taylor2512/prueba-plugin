# Contexto para IA — Backend .NET / C#

> Generado con `ai-context-pack.mjs v1.2.0`.

## Cómo usar este archivo con un proveedor de IA

- Usa las rutas relativas como referencia; no asumas archivos que no estén listados.
- Prioriza la tabla de archivos y los símbolos antes de proponer cambios.
- Cuando sugieras modificaciones, menciona la ruta exacta del archivo afectado.
- Los secretos, tokens y cadenas largas se redactan automáticamente salvo que se use `--no-redact`.

## Metadatos

- **Carpeta base:** `prueba-plugin`
- **Perfil:** `csharp`
- **Modo:** `compact`
- **Fecha generación:** `2026-07-12T05:01:41.314Z`
- **Extensiones incluidas:** `.cs, .csproj, .sln, .json, .config, .xml, .cshtml, .razor`
- **Archivos candidatos incluidos:** `6`
- **Límite por archivo:** `160 KB`
- **Límite total de contenido:** `3500 KB`

## Estructura incluida

```text
prueba-plugin
├── eslint_output.json
├── package.json
├── reports
│   └── tailwind-migration
│       ├── density-spacing-dom-metrics.json
│       └── schema-chrome-metrics.json
├── test-results
│   └── .last-run.json
└── tsconfig.json
```

## Archivos incluidos

| # | Ruta | Lenguaje | Líneas | KB original | Estado |
|---:|---|---|---:|---:|---|
| 1 | `eslint_output.json` | json | 2 | 110.8 | omitido minificado |
| 2 | `package.json` | json | 98 | 3.1 | completo |
| 3 | `tsconfig.json` | json | 65 | 1.3 | completo |
| 4 | `test-results/.last-run.json` | json | 4 | 0.0 | completo |
| 5 | `reports/tailwind-migration/density-spacing-dom-metrics.json` | json | 284 | 6.1 | completo |
| 6 | `reports/tailwind-migration/schema-chrome-metrics.json` | json | 41 | 0.7 | completo |

## Resumen de exclusiones

- **extensión no incluida:** 1784
- **directorio ignorado: dependencia/build/salida generada:** 7
- **archivo binario/minificado/lock ignorado:** 1
- **minificado detectado por contenido:** 1

## Totales

- **KB originales candidatos:** `122.1`
- **KB incluidos en contenido:** `11.3`
- **Comentarios reducidos:** `desactivada`
- **JSON de datos en React:** `omitido por defecto`
- **Redacción de secretos:** `activa`

---

# Contenido consolidado

<a id="file-0002"></a>

### 0002 — `package.json`

- **Lenguaje:** `json`
- **Líneas:** `98`
- **Tamaño original:** `3.1 KB`
- **SHA1 corto:** `952eb57fdf`
- **Estado:** `completo`

```json
{
  "name": "sisadbeta",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "dev:4173": "VITE_LOCAL_PROXY_ENABLED=true VITE_ENABLE_PROXY=true VITE_PORT=4173 vite --host --port 4173",
    "build": "NODE_OPTIONS=--max-old-space-size=81922 vite build",
    "build:mem": "NODE_OPTIONS=--max-old-space-size=81922 vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint --fix .",
    "test": "vitest",
    "test:e2e": "npx playwright test",
    "ai:sync": "node scripts/ai/sync-ai-adapters.js",
    "ai:check": "node scripts/ai/check-ai-workspace.js",
    "ai:manifest": "node scripts/ai/generate-ai-manifest.js",
    "tw:migrate:audit": "node scripts/migrate-design-to-tailwind.mjs --audit-only",
    "tw:migrate": "node scripts/migrate-design-to-tailwind.mjs --apply",
    "tw:migrate:install": "node scripts/migrate-design-to-tailwind.mjs --apply --install"
  },
  "dependencies": {
    "@dnd-kit/core": "^6.0.8",
    "@dnd-kit/sortable": "^10.0.0",
    "@pdf-lib/standard-fonts": "^1.0.0",
    "@pdf-lib/upng": "^1.0.1",
    "@scena/react-guides": "^0.28.2",
    "acorn": "^8.15.0",
    "air-datepicker": "^3.6.0",
    "antd": "^5.27.4",
    "autoskill": "^0.1.0",
    "buffer": "^6.0.3",
    "bwip-js": "^4.8.0",
    "color": "^4.2.3",
    "date-fns": "^2.30.0",
    "dompurify": "^3.3.1",
    "fontkit": "^2.0.2",
    "form-render": "^2.5.5",
    "globrex": "^0.1.2",
    "hotkeys-js": "^3.13.15",
    "lucide": "0.475.0",
    "lucide-react": "^0.563.0",
    "node-html-better-parser": "^1.5.8",
    "pako": "^2.1.0",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "2.16.105",
    "prop-types": "^15.8.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-moveable": "^0.56.0",
    "react-router-dom": "^6.4.3",
    "react-selecto": "^1.12.0",
    "uuid": "^9.0.0",
    "xlsx": "^0.18.5",
    "y-protocols": "^1.0.7",
    "yjs": "^13.6.30",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.2",
    "@playwright/test": "^1.58.2",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.5.0",
    "@types/node": "^25.3.0",
    "@types/react": "^18.0.22",
    "@types/react-dom": "^18.0.7",
    "@typescript-eslint/eslint-plugin": "^8.56.0",
    "@typescript-eslint/parser": "^8.56.0",
    "@vitejs/plugin-react": "^2.2.0",
    "autoprefixer": "^10.5.2",
    "esbuild": "^0.18.17",
    "eslint": "^9.39.2",
    "eslint-import-resolver-typescript": "^3.5.3",
    "eslint-plugin-import": "^2.27.5",
    "eslint-plugin-jsx-a11y": "^6.7.1",
    "eslint-plugin-react": "^7.37.5",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^17.3.0",
    "jsdom": "^22.1.0",
    "playwright": "^1.58.2",
    "postcss": "^8.5.16",
    "rollup-plugin-visualizer": "^6.0.5",
    "tailwindcss": "^3.4.19",
    "tsup": "^8.3.5",
    "typescript": "^6.0.3",
    "typescript-eslint": "^8.56.0",
    "vite": "^3.2.5",
    "vitest": "^0.34.0"
  },
  "overrides": {
    "@sisad-pdfme/converter": {
      "pdfjs-dist": "2.16.105"
    }
  }
}
```

<a id="file-0003"></a>

### 0003 — `tsconfig.json`

- **Lenguaje:** `json`
- **Líneas:** `65`
- **Tamaño original:** `1.3 KB`
- **SHA1 corto:** `65d204cc99`
- **Estado:** `completo`

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": [
      "ES2022",
      "DOM",
      "DOM.Iterable"
    ],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "jsx": "react-jsx",
    "strict": false,
    "noImplicitAny": false,
    "allowJs": true,
    "checkJs": false,
    "noEmit": true,
    "skipLibCheck": true,
    "isolatedModules": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "ignoreDeprecations": "6.0",
    "paths": {
      "@/*": [
        "./src/*"
      ],
      "@sisad-pdfme/*": [
        "./src/sisad-pdfme/*"
      ],
      "@sisad-pdfme/common": [
        "./src/sisad-pdfme/common/index.ts"
      ],
      "@sisad-pdfme/converter": [
        "./src/sisad-pdfme/converter/index.browser.ts"
      ],
      "@sisad-pdfme/generator": [
        "./src/sisad-pdfme/generator/index.ts"
      ],
      "@sisad-pdfme/schemas": [
        "./src/sisad-pdfme/schemas/index.ts"
      ],
      "@sisad-pdfme/pdf-lib": [
        "./src/sisad-pdfme/pdf-lib/index.ts"
      ],
      "@sisad-pdfme/ui": [
        "./src/sisad-pdfme/ui/index.ts"
      ]
    },
    "types": [
      "vite/client",
      "node",
      "vitest/globals"
    ]
  },
  "include": [
    "src",
    "tests",
    "vite.config.*",
    "playwright.config.ts"
  ],
  "exclude": [
    "dist",
    "node_modules"
  ]
}
```

<a id="file-0004"></a>

### 0004 — `test-results/.last-run.json`

- **Lenguaje:** `json`
- **Líneas:** `4`
- **Tamaño original:** `0.0 KB`
- **SHA1 corto:** `bc5897d23b`
- **Estado:** `completo`

```json
{
  "status": "passed",
  "failedTests": []
}
```

<a id="file-0005"></a>

### 0005 — `reports/tailwind-migration/density-spacing-dom-metrics.json`

- **Lenguaje:** `json`
- **Líneas:** `284`
- **Tamaño original:** `6.1 KB`
- **SHA1 corto:** `5353586f2a`
- **Estado:** `completo`

```json
{
  "basic-designer": {
    "metrics": [
      {
        "selector": ".sisad-pdfme-lab-page-hero",
        "exists": true,
        "width": 1584,
        "height": 51,
        "padding": "2.56px 5.44px",
        "margin": "0px",
        "gap": "0.96px",
        "borderRadius": "0px",
        "boxShadow": "none"
      },
      {
        "selector": ".sisad-pdfme-designer-left-sidebar",
        "exists": true,
        "width": 192,
        "height": 1152,
        "padding": "0px",
        "margin": "0px",
        "gap": "normal",
        "borderRadius": "0px",
        "boxShadow": "none"
      },
      {
        "selector": ".sisad-pdfme-designer-right-sidebar",
        "exists": true,
        "width": 276,
        "height": 1152,
        "padding": "0px",
        "margin": "0px",
        "gap": "normal",
        "borderRadius": "16px 0px 0px 16px",
        "boxShadow": "rgba(15, 23, 42, 0.06) -12px 0px 32px 0px"
      },
      {
        "selector": ".sisad-pdfme-designer-detail-section-card",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-designer-detail-header-card",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-selection-context-toolbar",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-canvas-context-menu",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-inline-edit-overlay",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-lab-results",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-lab-results-drawer-panel",
        "exists": false
      }
    ],
    "overflow": {
      "scrollWidth": 276,
      "clientWidth": 276,
      "hasHorizontalOverflow": false
    },
    "compressedControls": [
      {
        "text": null,
        "width": 12,
        "height": 12
      },
      {
        "text": null,
        "width": 80,
        "height": 22
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      }
    ]
  },
  "multi-document-routing": {
    "metrics": [
      {
        "selector": ".sisad-pdfme-lab-page-hero",
        "exists": true,
        "width": 1584,
        "height": 51,
        "padding": "2.56px 5.44px",
        "margin": "0px",
        "gap": "0.96px",
        "borderRadius": "0px",
        "boxShadow": "none"
      },
      {
        "selector": ".sisad-pdfme-designer-left-sidebar",
        "exists": true,
        "width": 192,
        "height": 1152,
        "padding": "0px",
        "margin": "0px",
        "gap": "normal",
        "borderRadius": "0px",
        "boxShadow": "none"
      },
      {
        "selector": ".sisad-pdfme-designer-right-sidebar",
        "exists": true,
        "width": 276,
        "height": 1152,
        "padding": "0px",
        "margin": "0px",
        "gap": "normal",
        "borderRadius": "16px 0px 0px 16px",
        "boxShadow": "rgba(15, 23, 42, 0.06) -12px 0px 32px 0px"
      },
      {
        "selector": ".sisad-pdfme-designer-detail-section-card",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-designer-detail-header-card",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-selection-context-toolbar",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-canvas-context-menu",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-inline-edit-overlay",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-lab-results",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-lab-results-drawer-panel",
        "exists": false
      }
    ],
    "overflow": {
      "scrollWidth": 276,
      "clientWidth": 276,
      "hasHorizontalOverflow": false
    },
    "compressedControls": [
      {
        "text": null,
        "width": 12,
        "height": 12
      },
      {
        "text": null,
        "width": 80,
        "height": 22
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      },
      {
        "text": null,
        "width": 16,
        "height": 16
      }
    ]
  },
  "generator-runtime": {
    "metrics": [
      {
        "selector": ".sisad-pdfme-lab-page-hero",
        "exists": true,
        "width": 1584,
        "height": 51,
        "padding": "2.56px 5.44px",
        "margin": "0px",
        "gap": "0.96px",
        "borderRadius": "0px",
        "boxShadow": "none"
      },
      {
        "selector": ".sisad-pdfme-designer-left-sidebar",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-designer-right-sidebar",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-designer-detail-section-card",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-designer-detail-header-card",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-selection-context-toolbar",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-canvas-context-menu",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-ui-inline-edit-overlay",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-lab-results",
        "exists": false
      },
      {
        "selector": ".sisad-pdfme-lab-results-drawer-panel",
        "exists": false
      }
    ],
    "overflow": null,
    "compressedControls": []
  }
}
```

<a id="file-0006"></a>

### 0006 — `reports/tailwind-migration/schema-chrome-metrics.json`

- **Lenguaje:** `json`
- **Líneas:** `41`
- **Tamaño original:** `0.7 KB`
- **SHA1 corto:** `664a8d5df6`
- **Estado:** `completo`

```json
{
  "count": 4,
  "fields": [
    {
      "family": "action-based",
      "state": "idle",
      "compact": "true",
      "width": 225,
      "height": 20,
      "radius": "0px",
      "boxShadow": "none"
    },
    {
      "family": "action-based",
      "state": "idle",
      "compact": "true",
      "width": 149,
      "height": 16,
      "radius": "0px",
      "boxShadow": "none"
    },
    {
      "family": "action-based",
      "state": "readonly",
      "compact": "true",
      "width": 300,
      "height": 19,
      "radius": "0px",
      "boxShadow": "none"
    },
    {
      "family": "action-based",
      "state": "idle",
      "compact": "true",
      "width": 149,
      "height": 16,
      "radius": "0px",
      "boxShadow": "none"
    }
  ]
}
```

---

## Prompt sugerido para IA

```text
Analiza este contexto de proyecto. Primero identifica arquitectura, rutas críticas, dependencias y posibles riesgos. Luego responde únicamente con cambios accionables, citando rutas relativas exactas. No inventes archivos no presentes en la tabla. Si falta contexto, indícalo explícitamente.
```
