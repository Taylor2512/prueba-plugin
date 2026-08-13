# Contexto para IA — Estilos CSS/Tailwind

> Generado con `ai-context-pack.mjs v1.2.0`.

## Cómo usar este archivo con un proveedor de IA

- Usa las rutas relativas como referencia; no asumas archivos que no estén listados.
- Prioriza la tabla de archivos y los símbolos antes de proponer cambios.
- Cuando sugieras modificaciones, menciona la ruta exacta del archivo afectado.
- Los secretos, tokens y cadenas largas se redactan automáticamente salvo que se use `--no-redact`.

## Metadatos

- **Carpeta base:** `prueba-plugin`
- **Perfil:** `css`
- **Modo:** `compact`
- **Fecha generación:** `2026-08-13T16:28:37.990Z`
- **Extensiones incluidas:** `.css, .scss, .sass, .less`
- **Archivos candidatos incluidos:** `5`
- **Límite por archivo:** `80 KB`
- **Límite total de contenido:** `1200 KB`

## Estructura incluida

```text
prueba-plugin
└── src
    ├── sisad-pdfme
    │   └── ui
    │       └── styles
    │           ├── sisad-pdfme.css
    │           └── tokens.css
    ├── style.css
    └── styles
        ├── sisad-tailwind-bridge.css
        └── tailwind.css
```

## Archivos incluidos

| # | Ruta | Lenguaje | Líneas | KB original | Estado |
|---:|---|---|---:|---:|---|
| 1 | `src/styles/tailwind.css` | css | 3 | 0.1 | completo |
| 2 | `src/style.css` | css | 30 | 0.9 | completo |
| 3 | `src/styles/sisad-tailwind-bridge.css` | css | 0 | 0.0 | completo |
| 4 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | css | 0 | 0.0 | completo |
| 5 | `src/sisad-pdfme/ui/styles/tokens.css` | css | 85 | 3.5 | completo |

## Resumen de exclusiones

- **extensión no incluida:** 1430
- **directorio ignorado: dependencia/build/salida generada:** 6

## Totales

- **KB originales candidatos:** `4.4`
- **KB incluidos en contenido:** `4.4`
- **Comentarios reducidos:** `desactivada`
- **JSON de datos en React:** `omitido por defecto`
- **Redacción de secretos:** `activa`

---

# Contenido consolidado

<a id="file-0001"></a>

### 0001 — `src/styles/tailwind.css`

- **Lenguaje:** `css`
- **Líneas:** `3`
- **Tamaño original:** `0.1 KB`
- **SHA1 corto:** `43ada92024`
- **Estado:** `completo`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

<a id="file-0002"></a>

### 0002 — `src/style.css`

- **Lenguaje:** `css`
- **Líneas:** `30`
- **Tamaño original:** `0.9 KB`
- **SHA1 corto:** `c0ed7510ea`
- **Estado:** `completo`
- **Símbolos detectados:** `selector: #root`

```css
/**
 * style.css — baseline mínimo del documento.
 *
 * Las directivas @tailwind viven en src/styles/tailwind.css (importada por
 * src/main.jsx). Mantenerlas aquí generaba DOBLE emisión de Tailwind.
 * Fuente única de Tailwind: src/styles/tailwind.css → src/main.jsx.
 *
 * Este archivo solo define la cadena de tamaño html/body/#root. Tailwind
 * preflight sigue desactivado a propósito (canvas, PDF, inputs, Ant Design,
 * Moveable y Selecto dependen de los defaults del navegador), así que el
 * único reset permitido aquí es el margen del body y el alto del documento.
 *
 * Prohibido: resets universales de input/button/select/headings y cualquier
 * selector que alcance internals de src/sisad-pdfme.
 */

html,
body,
#root {
  width: 100%;
  min-width: 320px;
  min-height: 100%;
  margin: 0;
}

body {
  min-height: 100dvh;
  overflow-x: hidden;
  background: #020617;
}
```

<a id="file-0003"></a>

### 0003 — `src/styles/sisad-tailwind-bridge.css`

- **Lenguaje:** `css`
- **Líneas:** `0`
- **Tamaño original:** `0.0 KB`
- **SHA1 corto:** `da39a3ee5e`
- **Estado:** `completo`

```css

```

<a id="file-0004"></a>

### 0004 — `src/sisad-pdfme/ui/styles/sisad-pdfme.css`

- **Lenguaje:** `css`
- **Líneas:** `0`
- **Tamaño original:** `0.0 KB`
- **SHA1 corto:** `da39a3ee5e`
- **Estado:** `completo`

```css

```

<a id="file-0005"></a>

### 0005 — `src/sisad-pdfme/ui/styles/tokens.css`

- **Lenguaje:** `css`
- **Líneas:** `85`
- **Tamaño original:** `3.5 KB`
- **SHA1 corto:** `389473eff3`
- **Estado:** `completo`
- **Símbolos detectados:** `selector: :root`

```css
/* ============================================================
   tokens.css — tokens únicos del diseñador SISAD PDFME

   Archivo conservado como CSS plano porque define variables.
   No convertir a @apply. Debe importarse antes del entrypoint.
   Duplicados internos eliminados conservando la última definición.
   ============================================================ */

:root {
  --color-white: #ffffff;
  --color-bg-base: #f8fafc;
  --color-bg-elevated: #ffffff;
  --color-bg-surface: #f1f5f9;
  --color-bg-hover: #e8eef5;
  --color-bg-active: #dde6f0;
  --color-gray-50: #f8fafc;
  --color-gray-100: #f1f5f9;
  --color-gray-300: #cbd5e1;
  --color-gray-400: #94a3b8;
  --color-gray-600: #475569;
  --color-gray-700: #334155;
  --color-gray-900: #0f172a;
  --color-text-primary: #0f172a;
  --color-text-secondary: #334155;
  --color-text-muted: #64748b;
  --color-primary: #4338ca;
  --color-primary-light: #6366f1;
  --color-danger: #ef4444;
  --color-warning: #f59e0b;
  --color-success: #10b981;
  --color-info: #4338ca;
  --color-border-subtle: rgba(148, 163, 184, 0.16);
  --color-border-soft: rgba(148, 163, 184, 0.22);
  --color-border-18: rgba(148, 163, 184, 0.18);
  --color-border-20: rgba(148, 163, 184, 0.20);
  --color-gray-900-04: rgba(15, 23, 42, 0.04);
  --color-gray-900-06: rgba(15, 23, 42, 0.06);
  --color-gray-900-08: rgba(15, 23, 42, 0.08);
  --color-gray-900-10: rgba(15, 23, 42, 0.10);
  --color-gray-50-90: rgba(248, 250, 252, 0.90);
  --color-primary-100-90: rgba(238, 236, 255, 0.90);
  --color-primary-200-20: rgba(199, 210, 254, 0.20);
  --color-white-70: rgba(255, 255, 255, 0.70);
  --color-white-80: rgba(255, 255, 255, 0.80);
  --color-white-92: rgba(255, 255, 255, 0.92);
  --color-white-98: rgba(255, 255, 255, 0.98);
  --color-primary-08: rgba(67, 56, 202, 0.08);
  --color-primary-10: rgba(67, 56, 202, 0.10);
  --color-primary-12: rgba(67, 56, 202, 0.12);
  --color-primary-20: rgba(67, 56, 202, 0.20);
  --color-primary-25: rgba(67, 56, 202, 0.25);
  --color-primary-30: rgba(67, 56, 202, 0.30);
  --color-primary-40: rgba(67, 56, 202, 0.40);
  --color-danger-32: rgba(239, 68, 68, 0.32);
  --color-info-55: rgba(99, 102, 241, 0.55);
  --font-family-ui: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-family-mono: "JetBrains Mono", "Fira Code", Consolas, monospace;
  --inspector-field-min-height: 22px;
  --shadow-gray-10: 0 0.5rem 1.375rem rgba(15, 23, 42, 0.10);
  --z-overlay: 300;
  --transition-fast: 120ms ease;
  --sisad-pdfme-root-bg: #f8fafc;
  --sisad-pdfme-mask-bg: rgba(15, 23, 42, 0.08);
  --sisad-pdfme-mask-blur: 0.0625rem;
  --sisad-pdfme-rs-gap: 0.875rem;
  --sisad-pdfme-rs-width: clamp(14.25rem, 17vw, 18rem);
  --sisad-pdfme-ls-width: clamp(10.5rem, 13vw, 14rem);
  --sisad-pdfme-ls-rail-width: 2.75rem;
  /* Runtime tokens consumidos por sisad-pdfme.css con fallback inline;
     se conservan porque el fallback no siempre iguala el valor real. */
  --sisad-pdfme-root-width: auto;
  --sisad-pdfme-root-height: auto;
  --sisad-pdfme-chrome-bg: linear-gradient(180deg, var(--color-white-98), var(--color-gray-50-90));
  --sisad-pdfme-chrome-border: var(--color-border-20);
  --sisad-pdfme-chrome-shadow: var(--shadow-gray-10);
  --sisad-pdfme-chrome-radius: 0.625rem;
  --sisad-pdfme-chrome-z: 45;
  --sisad-pdfme-left-sidebar-draggable-opacity: 1;
  --sisad-pdfme-left-sidebar-draggable-scale: 1;
  --moveable-color: #4338ca;
  --schema-tone: #4338ca;
  --schema-outline: 0.0625rem solid transparent;
  --wix-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --wix-reveal-dur: 220ms;
}
```

---

## Prompt sugerido para IA

```text
Analiza este contexto de proyecto. Primero identifica arquitectura, rutas críticas, dependencias y posibles riesgos. Luego responde únicamente con cambios accionables, citando rutas relativas exactas. No inventes archivos no presentes en la tabla. Si falta contexto, indícalo explícitamente.
```
