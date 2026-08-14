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
- **Fecha generación:** `2026-08-14T15:56:54.236Z`
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
| 4 | `src/sisad-pdfme/ui/styles/sisad-pdfme.css` | css | 237 | 8.2 | completo |
| 5 | `src/sisad-pdfme/ui/styles/tokens.css` | css | 85 | 3.5 | completo |

## Resumen de exclusiones

- **extensión no incluida:** 2186
- **directorio ignorado: dependencia/build/salida generada:** 8

## Totales

- **KB originales candidatos:** `12.6`
- **KB incluidos en contenido:** `12.6`
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
- **Líneas:** `237`
- **Tamaño original:** `8.2 KB`
- **SHA1 corto:** `3b1bb334e0`
- **Estado:** `completo`
- **Símbolos detectados:** `selector: .sisad-pdfme-root`, `selector: .sisad-pdfme-lab-runtime-host`, `selector: .sisad-pdfme-designer-snap-lines`

```css
/* ============================================================
   sisad-pdfme.css — reglas del runtime que Tailwind no alcanza.

   El layout (root, workspace, stage, canvas, paper, preview) vive en
   utilidades Tailwind dentro del JSX. Aquí solo queda lo que no se puede
   expresar como clase en un componente propio:

   - tokens de runtime consumidos por estilos inline (`var(--…)` sin fallback);
   - DOM de terceros (moveable, scena-guides) y nodos marcados por dataset;
   - variantes dirigidas por `data-*` con fondos multicapa.

   No duplicar aquí reglas que ya posee una clase Tailwind del JSX: la doble
   propiedad es lo que hace que un cambio de geometría se pierda a medias.
   ============================================================ */

/* ---------- Tokens de runtime ----------
   Alias cortos y tokens de schema consumidos desde estilos inline en
   `schemas/**` y `ui/components/**`. Varios consumidores no llevan fallback
   (`var(--sisad-schema-radius)`, `var(--sisad-schema-selected-shadow)`), así
   que sin estas definiciones la declaración se descarta por completo. */
.sisad-pdfme-root {
  font-family: var(--font-family-ui);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--color-text-primary);
  background-color: var(--color-bg-base);
  -webkit-font-smoothing: antialiased;
  --bg-hover: var(--color-bg-hover);
  --bg-active: var(--color-bg-active);
  --border-subtle: var(--color-border-subtle);
  --border-soft: var(--color-border-soft);
  --border-strong: var(--color-gray-400);
  --text-primary: var(--color-text-primary);
  --text-secondary: var(--color-text-secondary);
  --text-muted: var(--color-text-muted);
  --transition: 180ms ease;
  --sisad-schema-radius: 4px;
  --sisad-schema-border-alpha: 0.64;
  --sisad-schema-surface-alpha: 0.14;
  --sisad-schema-selected-color: var(--sisad-pdfme-selection-color, #4200ca);
  --sisad-schema-selected-shadow: 0 0 0 1px var(--sisad-schema-selected-color);
  --sisad-schema-font-size: 11px;
  --sisad-schema-line-height: 1.2;
  --sisad-schema-padding-x: 6px;
  --sisad-schema-padding-y: 3px;
}

/* Preflight cubre esto en la app, pero el runtime también se monta embebido:
   con content-box el papel y el stage miden de más y descentran el documento. */
.sisad-pdfme-root,
.sisad-pdfme-root *,
.sisad-pdfme-root *::before,
.sisad-pdfme-root *::after {
  box-sizing: border-box;
}

.sisad-pdfme-root ::-webkit-scrollbar {
  width: 5px;
  height: 5px;
}

.sisad-pdfme-root ::-webkit-scrollbar-track {
  background: transparent;
}

.sisad-pdfme-root ::-webkit-scrollbar-thumb {
  background: var(--border-soft);
  border-radius: 100px;
}

.sisad-pdfme-root ::-webkit-scrollbar-thumb:hover {
  background: var(--border-strong);
}

.sisad-pdfme-lab-runtime-host {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

/*
 * Reduced motion en el chrome del diseñador.
 *
 * Las transiciones de los botones vienen de Ant Design, no de nuestras clases,
 * así que una utilidad motion-reduce en el JSX no las alcanza. Se neutralizan
 * aquí, acotado a sus clusters. El !important es necesario por la
 * especificidad de antd; no cruza ningún límite porque apunta a superficie
 * propia.
 */
@media (prefers-reduced-motion: reduce) {
  [class*='control-bar-cluster'],
  [class*='control-bar-cluster'] * {
    transition-duration: 0s !important;
    animation-duration: 0s !important;
  }
}

/* ---------- Rejilla del canvas ----------
   Variante dirigida por data-attribute con seis capas de fondo; la clase
   Tailwind del canvas define solo el fondo base. */
.sisad-pdfme-designer-canvas[data-grid-visible='true'] {
  --sisad-grid-step: 24px;
  --sisad-grid-line: rgba(148, 163, 184, 0.16);
  --sisad-grid-line-strong: rgba(148, 163, 184, 0.24);
  background-image:
    linear-gradient(to right, var(--sisad-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--sisad-grid-line) 1px, transparent 1px),
    linear-gradient(to right, var(--sisad-grid-line-strong) 1px, transparent 1px),
    linear-gradient(to bottom, var(--sisad-grid-line-strong) 1px, transparent 1px),
    radial-gradient(circle at top left, rgba(148, 163, 184, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.98));
  background-size:
    var(--sisad-grid-step) var(--sisad-grid-step),
    var(--sisad-grid-step) var(--sisad-grid-step),
    calc(var(--sisad-grid-step) * 4) calc(var(--sisad-grid-step) * 4),
    calc(var(--sisad-grid-step) * 4) calc(var(--sisad-grid-step) * 4),
    auto,
    auto;
}

/* ---------- Página del diseñador ----------
   `data-canvas-page` lo marca Canvas por dataset sobre los refs de Paper, no
   hay JSX propio donde colgar la clase. Solo se declara lo que la presentación
   Tailwind de Paper no cubre: recorte del contenido a la página. */
.sisad-pdfme-designer-canvas [data-canvas-page='true'] {
  overflow: hidden;
  isolation: isolate;
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] > .sisad-pdfme-designer-custom-undefined {
  display: none;
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] > .sisad-pdfme-designer-padding {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  background: var(--color-border-18);
  opacity: 1;
  mix-blend-mode: multiply;
}

.sisad-pdfme-designer-canvas[data-padding-visible='false'] [data-canvas-page='true'] > .sisad-pdfme-designer-padding {
  display: none;
}

/* ---------- Guías y snap (scena-guides) ---------- */
.sisad-pdfme-designer-guides-ruler .scena-guides-text,
.sisad-pdfme-designer-guides-ruler .scena-guides-number {
  font-size: 0.625rem;
  opacity: 0.82;
}

.sisad-pdfme-designer-guides-ruler .scena-guides-guide.scena-guides-adder {
  opacity: 0.72;
}

.sisad-pdfme-designer-snap-lines {
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
}

.sisad-pdfme-designer-snap-line[data-is-center='true'] {
  filter: drop-shadow(0 0 2px var(--color-danger-32));
}

.sisad-pdfme-designer-canvas[data-guides-visible='false'] [data-canvas-page='true'] .scena-guides-manager {
  display: none;
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] .scena-guides-manager {
  backdrop-filter: blur(0.0125rem);
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] .scena-guides-guide-origin {
  background: transparent;
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] .scena-guides-guide.scena-guides-adder {
  background: var(--color-info-55);
}

/* ---------- Controles de moveable ---------- */
.sisad-pdfme-designer-canvas [data-canvas-page='true'] .moveable-control-box {
  z-index: 12;
  --moveable-color: var(--color-info);
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] .moveable-control-box .moveable-line {
  background: var(--moveable-color);
  opacity: 0.95;
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] .moveable-control-box .moveable-control {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 62.4375rem;
  border: 1px solid var(--color-white);
  background: var(--moveable-color);
  box-shadow:
    0 0 0 1px var(--color-bg-elevated),
    0 1px 0.25rem var(--color-gray-900-10);
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] .moveable-control-box .moveable-origin {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 62.4375rem;
  border: 1px solid var(--color-white);
  background: var(--color-warning);
}

.sisad-pdfme-designer-canvas [data-canvas-page='true'] .moveable-control-box .moveable-rotation-line {
  border-color: var(--moveable-color);
  opacity: 0.9;
}

/* ---------- Interacción de schemas ----------
   El estado lo escribe el runtime en el dataset del nodo seleccionable; sin
   estas reglas el contenido interno del schema roba el puntero a moveable. */
.sisad-pdfme-ui-custom-selectable[data-schema-active='true']:not([data-schema-editing='true']) > * {
  pointer-events: none;
}

.sisad-pdfme-ui-custom-selectable[data-schema-active='true']:not([data-schema-editing='true']) [data-schema-interactive-control] {
  pointer-events: auto;
}

.sisad-pdfme-ui-custom-selectable[data-schema-active='false'] [data-checkbox-group-add-option],
.sisad-pdfme-ui-custom-selectable[data-schema-active='false'] [data-radio-group-add-option],
.sisad-pdfme-ui-custom-selectable[data-schema-active='false'] [data-checkbox-convert-to-group] {
  display: none !important;
}
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
