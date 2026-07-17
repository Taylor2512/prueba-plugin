const SISAD_PDFME_RUNTIME_STYLE_ID = 'sisad-pdfme-runtime-styles';

const SISAD_PDFME_RUNTIME_CSS = `
.sisad-pdfme-root {
  font-family: var(--font-family-ui);
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--color-bg-base);
  -webkit-font-smoothing: antialiased;
  --bg-hover: var(--color-bg-hover);
  --bg-active: var(--color-bg-active);
  --border-subtle: var(--color-border-subtle);
  --border-soft: var(--color-border-soft);
  --border-strong: var(--color-border-strong);
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

.sisad-pdfme-designer-root {
  position: relative;
  display: flex;
  min-height: 0;
  flex-direction: column;
  width: var(--sisad-pdfme-root-width, auto);
  height: var(--sisad-pdfme-root-height, auto);
  background: var(--sisad-pdfme-root-bg);
}

.sisad-pdfme-designer-background {
  position: relative;
  display: flex;
  min-height: 0;
  height: 100%;
  width: 100%;
  flex-direction: column;
  background: transparent;
}

.sisad-pdfme-designer-workspace {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  width: 100%;
  flex: 1 1 auto;
  flex-direction: row;
  align-items: stretch;
}

.sisad-pdfme-designer-stage {
  position: relative;
  display: flex;
  min-width: 0;
  min-height: 0;
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
  flex-direction: column;
  overflow: hidden;
}

.sisad-pdfme-ui-preview-scroll {
  position: relative;
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  flex: 1 1 auto;
  overflow: auto;
  padding: 0.75rem 0.875rem 1.25rem;
  background:
    radial-gradient(circle at top left, rgba(148, 163, 184, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.98));
}

.sisad-pdfme-designer-canvas[data-grid-visible="true"] {
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

.sisad-pdfme-designer-canvas [data-paper-root="true"],
.sisad-pdfme-ui-preview-scroll [data-paper-root="true"] {
  position: relative;
  flex: none;
  min-width: 0;
  min-height: 0;
  margin-inline: auto;
}

.sisad-pdfme-paper-root {
  width: var(--paper-root-width, auto);
  height: var(--paper-root-height, auto);
}

.sisad-pdfme-paper-scale-layer {
  position: absolute;
  inset: 0;
  width: var(--paper-layer-width, auto);
  height: var(--paper-layer-height, auto);
  transform: scale(var(--paper-scale, 1));
  transform-origin: top left;
}

.sisad-pdfme-paper-page {
  position: absolute;
  left: 0;
  top: var(--paper-page-top, 0);
  width: var(--paper-page-width, auto);
  height: var(--paper-page-height, auto);
  font-family: var(--paper-page-font);
  background-image: var(--paper-page-background);
  background-size: var(--paper-page-background-size);
}

.sisad-pdfme-designer-canvas [data-paper-page="true"],
.sisad-pdfme-ui-preview-scroll [data-paper-page="true"] {
  border: 1px solid rgba(148, 163, 184, 0.28);
  border-radius: 0.35rem;
  background-color: #ffffff;
  background-repeat: no-repeat;
  background-position: top left;
  box-sizing: border-box;
  box-shadow:
    0 14px 32px rgba(15, 23, 42, 0.08),
    0 2px 8px rgba(15, 23, 42, 0.06);
}

.sisad-pdfme-lab-runtime-host {
  width: 100%;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

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

.sisad-pdfme-designer-snap-line[data-is-center="true"] {
  filter: drop-shadow(0 0 2px var(--color-danger-32));
}

.sisad-pdfme-designer-canvas {
  position: relative;
  display: flex;
  width: 100%;
  max-width: 100%;
  height: 100%;
  min-width: 0;
  flex: 1 1 auto;
  align-items: flex-start;
  justify-content: center;
  overflow: auto;
  box-sizing: border-box;
  padding: 3.5rem 1rem 1rem;
  overscroll-behavior: contain;
  background:
    radial-gradient(circle at top left, rgba(148, 163, 184, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.98));
  background-size: auto, auto;
}

.sisad-pdfme-root .sisad-pdfme-designer-canvas[data-grid-visible="false"] {
  background:
    radial-gradient(circle at top left, rgba(148, 163, 184, 0.08), transparent 22%),
    linear-gradient(180deg, rgba(248, 250, 252, 0.96), rgba(241, 245, 249, 0.98));
  background-size: auto, auto;
}

.sisad-pdfme-root .sisad-pdfme-designer-canvas[data-grid-visible="true"] {
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

.sisad-pdfme-designer-canvas [data-canvas-page="true"] {
  overflow: hidden;
  isolation: isolate;
  background: var(--color-white);
  border: 1px solid var(--border-soft);
  border-radius: 0.25rem;
  box-shadow:
    0 0 0 1px var(--border-subtle),
    0 0.5rem 1.5rem var(--color-gray-900-08),
    0 1.25rem 3rem var(--color-gray-900-06);
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] > .sisad-pdfme-designer-custom-undefined {
  display: none;
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] > .sisad-pdfme-designer-padding {
  position: absolute;
  z-index: 1;
  pointer-events: none;
  background: var(--color-border-12);
  opacity: 1;
  mix-blend-mode: multiply;
}

.sisad-pdfme-designer-canvas[data-padding-visible="false"] [data-canvas-page="true"] > .sisad-pdfme-designer-padding {
  display: none;
}

.sisad-pdfme-designer-canvas[data-guides-visible="false"] [data-canvas-page="true"] .scena-guides-manager {
  display: none;
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] .scena-guides-manager {
  backdrop-filter: blur(0.0125rem);
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] .scena-guides-guide-origin {
  background: transparent;
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] .scena-guides-guide.scena-guides-adder {
  background: var(--color-info-55);
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box {
  z-index: 12;
  --moveable-color: var(--color-info);
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box .moveable-line {
  background: var(--moveable-color);
  opacity: 0.95;
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box .moveable-control {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 62.4375rem;
  border: 1px solid var(--color-white);
  background: var(--moveable-color);
  box-shadow:
    0 0 0 1px var(--color-bg-elevated),
    0 1px 0.25rem var(--color-gray-900-22);
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box .moveable-origin {
  width: 0.4375rem;
  height: 0.4375rem;
  border-radius: 62.4375rem;
  border: 1px solid var(--color-white);
  background: var(--color-warning);
}

.sisad-pdfme-designer-canvas [data-canvas-page="true"] .moveable-control-box .moveable-rotation-line {
  border-color: var(--moveable-color);
  opacity: 0.9;
}

.sisad-pdfme-ui-custom-selectable[data-schema-active="true"]:not([data-schema-editing="true"]) > * {
  pointer-events: none;
}

.sisad-pdfme-ui-custom-selectable[data-schema-active="true"]:not([data-schema-editing="true"]) [data-schema-interactive-control] {
  pointer-events: auto;
}

.sisad-pdfme-ui-custom-selectable[data-schema-active="false"] [data-checkbox-group-add-option],
.sisad-pdfme-ui-custom-selectable[data-schema-active="false"] [data-radio-group-add-option],
.sisad-pdfme-ui-custom-selectable[data-schema-active="false"] [data-checkbox-convert-to-group] {
  display: none !important;
}
`;

const ensureLink = (href: string) => {
  if (typeof document === 'undefined') return;
  const existing = document.querySelector(`link[data-sisad-pdfme-font="${href}"]`);
  if (existing) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = href;
  link.setAttribute('data-sisad-pdfme-font', href);
  document.head.appendChild(link);
};

export const ensureSisadPdfmeRuntimeStyles = () => {
  if (typeof document === 'undefined') return;
  ensureLink('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');
  if (document.getElementById(SISAD_PDFME_RUNTIME_STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = SISAD_PDFME_RUNTIME_STYLE_ID;
  style.textContent = SISAD_PDFME_RUNTIME_CSS;
  document.head.appendChild(style);
};

ensureSisadPdfmeRuntimeStyles();
