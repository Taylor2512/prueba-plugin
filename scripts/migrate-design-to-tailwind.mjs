#!/usr/bin/env node
/**
 * migrate-design-to-tailwind.mjs
 *
 * Migración segura e incremental de diseños SISAD PDFME hacia Tailwind.
 *
 * Objetivos:
 * - Configurar Tailwind sin romper canvas/pdfme.
 * - Mantener comportamiento actual.
 * - Mantener CSS scoped bajo .sisad-pdfme-root y clases del lab.
 * - No tocar Moveable/Selecto.
 * - No borrar CSS legacy.
 * - Generar bridge Tailwind con @layer components.
 * - Generar candidatos .tailwind.candidate.css desde CSS existente.
 * - Generar reporte para migrar por task-card.
 *
 * Uso:
 *   node scripts/migrate-design-to-tailwind.mjs --root /ruta/proyecto
 *   node scripts/migrate-design-to-tailwind.mjs --root /ruta/proyecto --apply
 *   node scripts/migrate-design-to-tailwind.mjs --root /ruta/proyecto --apply --install
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { execFileSync } from "node:child_process";

const args = new Set(process.argv.slice(2));

function getArgValue(name, fallback = null) {
  const index = process.argv.indexOf(name);
  if (index >= 0 && process.argv[index + 1]) return process.argv[index + 1];
  return fallback;
}

const ROOT = path.resolve(getArgValue("--root", process.cwd()));
const APPLY = args.has("--apply");
const INSTALL = args.has("--install");
const AUDIT_ONLY = args.has("--audit-only");

const now = new Date();
const stamp = [
  now.getFullYear(),
  String(now.getMonth() + 1).padStart(2, "0"),
  String(now.getDate()).padStart(2, "0"),
  "-",
  String(now.getHours()).padStart(2, "0"),
  String(now.getMinutes()).padStart(2, "0"),
  String(now.getSeconds()).padStart(2, "0"),
].join("");

const BACKUP_DIR = path.join(ROOT, ".tailwind-migration-backups", stamp);
const REPORT_DIR = path.join(ROOT, "reports", "tailwind-migration");
const CANDIDATE_DIR = path.join(ROOT, "reports", "tailwind-migration", "candidates");

const cssFiles = [
  "src/sisad-pdfme/ui/styles/tokens.css",
  "src/sisad-pdfme/ui/styles/sisad-pdfme-global.css",
  "src/sisad-pdfme/ui/styles/canvas-interactions.css",
  "src/sisad-pdfme/ui/styles/sisad-pdfme-runtime.css",
  "src/features/pdfcomponent/labRoutes.css",
];

const mainCandidates = [
  "src/main.tsx",
  "src/main.ts",
  "src/main.jsx",
  "src/main.js",
  "src/App.tsx",
  "src/App.jsx",
];

const tailwindCssPath = "src/styles/tailwind.css";
const bridgeCssPath = "src/styles/sisad-tailwind-bridge.css";
const tailwindConfigPath = "tailwind.config.js";
const postcssConfigPath = "postcss.config.js";

const touched = [];
const warnings = [];
const generatedCandidates = [];

function log(message) {
  console.log(message);
}

function rel(absPath) {
  return path.relative(ROOT, absPath).split(path.sep).join("/");
}

function abs(relativePath) {
  return path.join(ROOT, relativePath);
}

function exists(relativePath) {
  return fs.existsSync(abs(relativePath));
}

function read(relativePath) {
  return fs.readFileSync(abs(relativePath), "utf8");
}

function ensureDirAbs(dir) {
  if (!fs.existsSync(dir)) {
    if (APPLY) fs.mkdirSync(dir, { recursive: true });
    touched.push(`mkdir ${rel(dir)}`);
  }
}

function ensureDirFor(relativePath) {
  ensureDirAbs(path.dirname(abs(relativePath)));
}

function backup(relativePath) {
  const source = abs(relativePath);
  if (!fs.existsSync(source)) return;

  const target = path.join(BACKUP_DIR, relativePath);
  const targetDir = path.dirname(target);

  if (APPLY) {
    fs.mkdirSync(targetDir, { recursive: true });
    fs.copyFileSync(source, target);
  }

  touched.push(`backup ${relativePath} -> ${rel(target)}`);
}

function write(relativePath, content, { overwrite = true } = {}) {
  const file = abs(relativePath);

  if (fs.existsSync(file) && !overwrite) {
    warnings.push(`No se sobrescribió ${relativePath}; ya existe.`);
    return;
  }

  if (fs.existsSync(file)) backup(relativePath);

  ensureDirFor(relativePath);

  if (APPLY) fs.writeFileSync(file, content, "utf8");

  touched.push(`${fs.existsSync(file) ? "update" : "create"} ${relativePath}`);
}

function update(relativePath, updater) {
  if (!exists(relativePath)) {
    warnings.push(`No existe ${relativePath}; se omite.`);
    return;
  }

  const current = read(relativePath);
  const next = updater(current);

  if (next === current) {
    touched.push(`unchanged ${relativePath}`);
    return;
  }

  backup(relativePath);

  if (APPLY) fs.writeFileSync(abs(relativePath), next, "utf8");

  touched.push(`update ${relativePath}`);
}

function readJson(relativePath) {
  return JSON.parse(read(relativePath));
}

function writeJson(relativePath, data) {
  write(relativePath, `${JSON.stringify(data, null, 2)}\n`);
}

function detectPackageManager() {
  if (exists("pnpm-lock.yaml")) return "pnpm";
  if (exists("yarn.lock")) return "yarn";
  if (exists("package-lock.json")) return "npm";
  return "npm";
}

function installTailwind() {
  const pm = detectPackageManager();

  if (!INSTALL) {
    warnings.push("Dependencias Tailwind no instaladas. Ejecuta con --install para instalar tailwindcss postcss autoprefixer.");
    return;
  }

  log(`Instalando Tailwind con ${pm}...`);

  if (!APPLY) {
    touched.push(`[dry-run] install tailwindcss postcss autoprefixer con ${pm}`);
    return;
  }

  const cmd =
    pm === "pnpm"
      ? ["pnpm", ["add", "-D", "tailwindcss", "postcss", "autoprefixer"]]
      : pm === "yarn"
        ? ["yarn", ["add", "-D", "tailwindcss", "postcss", "autoprefixer"]]
        : ["npm", ["install", "-D", "tailwindcss", "postcss", "autoprefixer"]];

  execFileSync(cmd[0], cmd[1], { cwd: ROOT, stdio: "inherit" });
}

function ensurePackageScripts() {
  if (!exists("package.json")) {
    warnings.push("No existe package.json; se omite actualización de scripts.");
    return;
  }

  const pkg = readJson("package.json");
  pkg.scripts = pkg.scripts || {};

  pkg.scripts["tw:migrate:audit"] = "node scripts/migrate-design-to-tailwind.mjs --audit-only";
  pkg.scripts["tw:migrate"] = "node scripts/migrate-design-to-tailwind.mjs --apply";
  pkg.scripts["tw:migrate:install"] = "node scripts/migrate-design-to-tailwind.mjs --apply --install";

  writeJson("package.json", pkg);
}

function ensureTailwindConfig() {
  const content = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
    "./tests/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        sisad: {
          bg: "var(--sisad-editor-bg)",
          surface: "var(--sisad-editor-surface)",
          "surface-soft": "var(--sisad-editor-surface-soft)",
          border: "var(--sisad-editor-border)",
          muted: "var(--sisad-editor-muted)",
          primary: "var(--sisad-editor-primary)",
          success: "var(--sisad-editor-success)",
          warning: "var(--sisad-editor-warning)",
          danger: "var(--sisad-editor-danger)"
        }
      },
      borderRadius: {
        "sisad-sm": "var(--sisad-editor-radius-sm)",
        "sisad-md": "var(--sisad-editor-radius-md)",
        "sisad-lg": "var(--sisad-editor-radius-lg)"
      },
      boxShadow: {
        "sisad-sm": "var(--sisad-editor-shadow-sm)",
        "sisad-md": "var(--sisad-editor-shadow-md)"
      }
    }
  },

  /**
   * Importante:
   * preflight queda desactivado para no alterar canvas, PDF, inputs,
   * Ant Design, Moveable, Selecto ni medidas del diseñador.
   */
  corePlugins: {
    preflight: false
  },

  plugins: []
};
`;

  if (!exists(tailwindConfigPath)) {
    write(tailwindConfigPath, content, { overwrite: false });
  } else {
    warnings.push(`${tailwindConfigPath} ya existe; revisa manualmente que tenga content y preflight:false.`);
  }
}

function ensurePostcssConfig() {
  const content = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
`;

  if (!exists(postcssConfigPath)) {
    write(postcssConfigPath, content, { overwrite: false });
  } else {
    warnings.push(`${postcssConfigPath} ya existe; revisa manualmente que tenga tailwindcss y autoprefixer.`);
  }
}

function ensureTailwindCss() {
  const content = `@tailwind base;
@tailwind components;
@tailwind utilities;

/**
 * Tailwind base stylesheet.
 *
 * Mantener preflight desactivado en tailwind.config.js.
 * El bridge sisad-tailwind-bridge.css conserva classNames existentes
 * y migra progresivamente estilos a @apply sin romper comportamiento.
 */
`;

  write(tailwindCssPath, content, { overwrite: false });
}

function ensureBridgeCss() {
  const content = `/**
 * sisad-tailwind-bridge.css
 *
 * Bridge progresivo: conserva classNames existentes y permite migrar
 * diseño hacia Tailwind con @layer components.
 *
 * No tocar:
 * - .moveable-*
 * - .selecto-*
 * - coordenadas, transform, zoom, page geometry
 * - DOM interno desde hosts externos
 */

@layer components {
  .sisad-pdfme-root {
    @apply antialiased text-slate-900 bg-slate-50;
  }

  .sisad-pdfme-page {
    @apply flex flex-col min-h-0 overflow-hidden bg-slate-50;
  }

  .sisad-pdfme-grid {
    @apply relative grid min-h-0 overflow-hidden;
  }

  .sisad-pdfme-workspace {
    @apply flex flex-1 flex-col min-h-0 overflow-hidden bg-slate-50;
  }

  .sisad-pdfme-designer-root {
    @apply relative flex flex-col w-full h-full;
  }

  .sisad-pdfme-designer-background {
    @apply relative flex flex-col w-full h-full bg-transparent;
  }

  .sisad-pdfme-designer-workspace {
    @apply relative flex flex-1 min-w-0 min-h-0 w-full;
  }

  .sisad-pdfme-designer-stage {
    @apply relative flex flex-1 min-h-0 w-full h-full;
  }

  .sisad-pdfme-designer-canvas,
  .sisad-pdfme-ui-preview-scroll {
    @apply relative flex-1 min-w-0 min-h-0 w-full h-full overflow-auto;
  }

  .sisad-pdfme-ui-control-bar {
    @apply absolute inset-0 pointer-events-none bg-transparent;
  }

  .sisad-pdfme-ui-control-bar-cluster {
    @apply absolute inline-flex items-center pointer-events-auto;
  }

  .sisad-pdfme-ui-control-bar-cluster--top-left {
    @apply top-2 left-2;
  }

  .sisad-pdfme-ui-control-bar-cluster--top-center {
    @apply top-2 left-1/2 -translate-x-1/2;
  }

  .sisad-pdfme-ui-control-bar-cluster--top-right {
    @apply top-2 right-2;
  }

  .sisad-pdfme-ui-control-bar-cluster--bottom-right {
    @apply left-1/2 right-auto bottom-3 -translate-x-1/2;
  }

  .sisad-pdfme-ui-control-bar-pill,
  .sisad-pdfme-ui-control-bar-summary {
    @apply inline-flex items-center border border-slate-200 bg-white/95 shadow-sm backdrop-blur-md;
  }

  .sisad-pdfme-ui-control-bar-summary {
    @apply text-slate-600 font-semibold whitespace-nowrap;
  }

  .sisad-pdfme-ui-pager,
  .sisad-pdfme-ui-zoom,
  .sisad-pdfme-ui-control-bar-group {
    @apply inline-flex items-center border border-slate-200 bg-slate-100;
  }

  .sisad-pdfme-designer-left-sidebar {
    @apply relative flex flex-col h-full min-h-0 shrink-0 bg-white border-r border-slate-200;
  }

  .sisad-pdfme-designer-left-sidebar-content {
    @apply flex flex-col flex-1 min-h-0 h-full;
  }

  .sisad-pdfme-designer-left-sidebar-main {
    @apply flex-1 min-h-0 overflow-y-auto overflow-x-hidden;
  }

  .sisad-pdfme-sidebar-surface-header {
    @apply flex items-start justify-between w-full min-w-0;
  }

  .sisad-pdfme-sidebar-surface-header-main {
    @apply flex items-start min-w-0 flex-1;
  }

  .sisad-pdfme-sidebar-surface-header-title {
    @apply block overflow-hidden text-ellipsis whitespace-nowrap min-w-0 font-bold text-slate-900;
  }

  .sisad-pdfme-sidebar-surface-header-subtitle {
    @apply block overflow-hidden text-ellipsis whitespace-nowrap min-w-0 text-slate-500;
  }

  .sisad-pdfme-option-group-root[data-render-mode='form'] {
    @apply block w-full h-auto;
  }

  .sisad-pdfme-option-group-root[data-render-mode='viewer'],
  .sisad-pdfme-option-group-root[data-render-mode='pdf'] {
    @apply bg-transparent;
  }

  .sisad-pdfme-option-group__option {
    @apply inline-flex items-center w-full select-none bg-transparent;
  }

  .sisad-pdfme-option-group-root[data-option-labels='hidden'] .sisad-pdfme-option-group__option {
    @apply w-auto justify-center p-0;
  }

  .sisad-pdfme-option-group-root[data-option-labels='hidden'] [data-option-label-visible='true'] {
    @apply hidden;
  }

  .sisad-pdfme-lab-results-drawer-panel {
    @apply grid w-full overflow-auto border border-slate-300/70 bg-white/95 shadow-xl;
  }

  .sisad-pdfme-lab-results-drawer-header {
    @apply flex items-start justify-between;
  }

  .sisad-pdfme-lab-results-drawer-heading {
    @apply grid min-w-0;
  }

  .sisad-pdfme-lab-results-close {
    @apply inline-flex items-center justify-center rounded-full border border-slate-300 bg-slate-50 text-slate-700 font-bold cursor-pointer;
  }

  .sisad-pdfme-lab-results-drawer-body {
    @apply min-w-0;
  }
}
`;

  write(bridgeCssPath, content, { overwrite: false });
}

function findMainFile() {
  return mainCandidates.find((candidate) => exists(candidate));
}

function ensureImports() {
  const main = findMainFile();

  if (!main) {
    warnings.push("No se encontró src/main.* ni src/App.* para importar Tailwind. Importa manualmente src/styles/tailwind.css y src/styles/sisad-tailwind-bridge.css.");
    return;
  }

  update(main, (content) => {
    const importsToAdd = [
      "import './styles/tailwind.css';",
      "import './styles/sisad-tailwind-bridge.css';",
    ];

    let next = content;

    for (const importLine of importsToAdd) {
      if (next.includes(importLine)) continue;

      const lines = next.split("\n");
      let lastImportIndex = -1;

      for (let i = 0; i < lines.length; i += 1) {
        if (/^\s*import\s/.test(lines[i])) lastImportIndex = i;
      }

      if (lastImportIndex >= 0) {
        lines.splice(lastImportIndex + 1, 0, importLine);
        next = lines.join("\n");
      } else {
        next = `${importLine}\n${next}`;
      }
    }

    return next;
  });
}

function cssValueToTailwind(prop, rawValue) {
  const value = rawValue.trim().replace(/\s+/g, " ");

  const exact = {
    "display:flex": "flex",
    "display:inline-flex": "inline-flex",
    "display:grid": "grid",
    "display:block": "block",
    "display:inline-block": "inline-block",
    "display:none": "hidden",

    "position:relative": "relative",
    "position:absolute": "absolute",
    "position:fixed": "fixed",
    "position:sticky": "sticky",

    "inset:0": "inset-0",
    "top:0": "top-0",
    "right:0": "right-0",
    "bottom:0": "bottom-0",
    "left:0": "left-0",

    "width:100%": "w-full",
    "height:100%": "h-full",
    "min-width:0": "min-w-0",
    "min-height:0": "min-h-0",

    "overflow:hidden": "overflow-hidden",
    "overflow:auto": "overflow-auto",
    "overflow-y:auto": "overflow-y-auto",
    "overflow-x:hidden": "overflow-x-hidden",
    "overflow:visible": "overflow-visible",

    "box-sizing:border-box": "box-border",

    "align-items:center": "items-center",
    "align-items:flex-start": "items-start",
    "align-items:flex-end": "items-end",
    "align-items:stretch": "items-stretch",

    "justify-content:center": "justify-center",
    "justify-content:space-between": "justify-between",
    "justify-content:flex-end": "justify-end",
    "justify-content:flex-start": "justify-start",

    "flex-direction:column": "flex-col",
    "flex-direction:row": "flex-row",
    "flex-wrap:wrap": "flex-wrap",
    "flex-wrap:nowrap": "flex-nowrap",
    "flex:1 1 auto": "flex-1",
    "flex-shrink:0": "shrink-0",

    "pointer-events:none": "pointer-events-none",
    "pointer-events:auto": "pointer-events-auto",

    "white-space:nowrap": "whitespace-nowrap",
    "text-overflow:ellipsis": "text-ellipsis",
    "text-transform:uppercase": "uppercase",
    "text-align:left": "text-left",
    "text-align:center": "text-center",

    "font-weight:400": "font-normal",
    "font-weight:500": "font-medium",
    "font-weight:600": "font-semibold",
    "font-weight:700": "font-bold",
    "font-weight:800": "font-extrabold",

    "background:transparent": "bg-transparent",
    "background-color:transparent": "bg-transparent",
    "border:0": "border-0",
    "border:none": "border-0",

    "cursor:pointer": "cursor-pointer",
    "cursor:default": "cursor-default",
    "user-select:none": "select-none",
    "outline:none": "outline-none",
  };

  const key = `${prop}:${value}`;
  if (exact[key]) return exact[key];

  if (prop === "gap") {
    if (value === "0.25rem") return "gap-1";
    if (value === "0.5rem") return "gap-2";
    if (value === "0.75rem") return "gap-3";
    if (value === "1rem") return "gap-4";
  }

  if (prop === "padding") {
    if (value === "0") return "p-0";
    if (value === "0.25rem") return "p-1";
    if (value === "0.5rem") return "p-2";
    if (value === "0.75rem") return "p-3";
    if (value === "1rem") return "p-4";
  }

  if (prop === "margin") {
    if (value === "0") return "m-0";
  }

  if (prop === "border-radius") {
    if (value === "999px" || value === "9999px") return "rounded-full";
    if (value === "0.25rem" || value === "4px") return "rounded";
    if (value === "0.5rem" || value === "8px") return "rounded-lg";
    if (value === "0.75rem" || value === "12px") return "rounded-xl";
    if (value === "1rem" || value === "16px") return "rounded-2xl";
  }

  return null;
}

function parseDeclarations(body) {
  return body
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((declaration) => {
      const index = declaration.indexOf(":");
      if (index < 0) return null;
      return {
        prop: declaration.slice(0, index).trim(),
        value: declaration.slice(index + 1).trim(),
      };
    })
    .filter(Boolean);
}

function selectorIsSafe(selector) {
  if (!selector) return false;
  if (selector.includes("@")) return false;
  if (selector.includes(".moveable-")) return false;
  if (selector.includes(".selecto-")) return false;
  if (selector.includes("html")) return false;
  if (selector.includes("body")) return false;

  return (
    selector.includes(".sisad-pdfme-root") ||
    selector.includes(".sisad-pdfme-") ||
    selector.includes(".sisad-option-")
  );
}

function convertCssFile(relativePath) {
  if (!exists(relativePath)) {
    warnings.push(`CSS no encontrado: ${relativePath}`);
    return;
  }

  const source = read(relativePath);
  const blockRegex = /([^{}]+)\{([^{}]+)\}/g;
  const output = [];
  let match;
  let convertedBlocks = 0;
  let unsupportedCount = 0;

  output.push(`/**`);
  output.push(` * Candidato generado desde ${relativePath}`);
  output.push(` * Revisar manualmente antes de reemplazar CSS legacy.`);
  output.push(` * No contiene reglas .moveable-* ni .selecto-*.`);
  output.push(` */`);
  output.push(``);
  output.push(`@layer components {`);

  while ((match = blockRegex.exec(source)) !== null) {
    const selector = match[1].trim();
    const body = match[2].trim();

    if (!selectorIsSafe(selector)) continue;

    const declarations = parseDeclarations(body);
    const tw = [];
    const unsupported = [];

    for (const declaration of declarations) {
      const utility = cssValueToTailwind(declaration.prop, declaration.value);
      if (utility) {
        tw.push(utility);
      } else {
        unsupported.push(`${declaration.prop}: ${declaration.value};`);
      }
    }

    if (tw.length === 0 && unsupported.length === 0) continue;

    convertedBlocks += 1;
    unsupportedCount += unsupported.length;

    output.push(`  ${selector} {`);

    if (tw.length > 0) {
      output.push(`    @apply ${Array.from(new Set(tw)).join(" ")};`);
    }

    if (unsupported.length > 0) {
      output.push(`    /* Unsupported/manual:`);
      for (const declaration of unsupported) {
        output.push(`       ${declaration}`);
      }
      output.push(`    */`);
    }

    output.push(`  }`);
    output.push(``);
  }

  output.push(`}`);

  const candidateName = relativePath
    .replace(/^src\//, "")
    .replace(/[\\/]/g, "__")
    .replace(/\.css$/, ".tailwind.candidate.css");

  const target = path.join("reports", "tailwind-migration", "candidates", candidateName);
  write(target, `${output.join("\n")}\n`);
  generatedCandidates.push({
    source: relativePath,
    target,
    convertedBlocks,
    unsupportedCount,
  });
}

function generateCandidates() {
  ensureDirAbs(CANDIDATE_DIR);
  for (const cssFile of cssFiles) {
    convertCssFile(cssFile);
  }
}

function generateReport() {
  const report = [];

  report.push(`# Tailwind Migration Report`);
  report.push(``);
  report.push(`Fecha: ${now.toISOString()}`);
  report.push(`Modo: ${APPLY ? "apply" : "dry-run"}`);
  report.push(`Root: ${ROOT}`);
  report.push(``);
  report.push(`## Objetivo`);
  report.push(``);
  report.push(`Migración incremental de diseños a Tailwind preservando comportamiento, canvas, geometría, Moveable, Selecto, snapshot y metadata.`);
  report.push(``);
  report.push(`## Archivos creados/actualizados`);
  report.push(``);
  for (const item of touched) {
    report.push(`- ${item}`);
  }

  report.push(``);
  report.push(`## Candidatos CSS generados`);
  report.push(``);
  if (generatedCandidates.length === 0) {
    report.push(`- No se generaron candidatos.`);
  } else {
    for (const candidate of generatedCandidates) {
      report.push(`- ${candidate.source} → ${candidate.target}`);
      report.push(`  - bloques convertidos: ${candidate.convertedBlocks}`);
      report.push(`  - declaraciones manuales/unsupported: ${candidate.unsupportedCount}`);
    }
  }

  report.push(``);
  report.push(`## Advertencias`);
  report.push(``);
  if (warnings.length === 0) {
    report.push(`- Sin advertencias.`);
  } else {
    for (const warning of warnings) {
      report.push(`- ${warning}`);
    }
  }

  report.push(``);
  report.push(`## Próximo paso recomendado`);
  report.push(``);
  report.push(`1. Ejecutar la app y validar /lab/multi-document-routing.`);
  report.push(`2. Comparar visualmente Designer, Form, Viewer y PDF.`);
  report.push(`3. Migrar por task-card, no todo de golpe.`);
  report.push(`4. Mantener classNames existentes hasta que Playwright confirme comportamiento.`);
  report.push(`5. No reemplazar reglas de canvas, Moveable, Selecto ni geometría por Tailwind sin evidencia.`);
  report.push(``);
  report.push(`## Validación manual mínima`);
  report.push(``);
  report.push(`- Designer mantiene grid, sidebars, toolbar, zoom y selección.`);
  report.push(`- Form/Viewer siguen filtrando por recipient activo.`);
  report.push(`- CheckboxGroup/RadioGroup no muestran labels técnicos no deseados.`);
  report.push(`- Attachment, image, svg, barcode y table conservan comportamiento.`);
  report.push(`- Página 2+ conserva coordenadas, overlays y toolbar.`);
  report.push(`- PDF generado no imprime chrome/fondos no deseados.`);
  report.push(``);
  report.push(`## Archivos que NO deben tocarse solo por diseño`);
  report.push(``);
  report.push(`- Moveable.tsx`);
  report.push(`- Selecto.tsx`);
  report.push(`- designerCoordinateService.ts`);
  report.push(`- schemaCollision.ts`);
  report.push(`- snapshotAdapter.ts`);
  report.push(`- generator/pdf-lib`);
  report.push(``);

  write("reports/tailwind-migration/README.md", `${report.join("\n")}\n`);
}

function run() {
  if (!fs.existsSync(ROOT)) {
    console.error(`ERROR: root no existe: ${ROOT}`);
    process.exit(1);
  }

  if (!exists("package.json")) {
    console.error(`ERROR: no se encontró package.json en ${ROOT}`);
    process.exit(1);
  }

  log(APPLY ? "Modo APPLY: se escribirán cambios." : "Modo DRY-RUN: no se escribirá nada.");
  log(`Root: ${ROOT}`);

  ensureDirAbs(REPORT_DIR);
  ensureDirAbs(CANDIDATE_DIR);

  if (!AUDIT_ONLY) {
    installTailwind();
    ensurePackageScripts();
    ensureTailwindConfig();
    ensurePostcssConfig();
    ensureTailwindCss();
    ensureBridgeCss();
    ensureImports();
  }

  generateCandidates();
  generateReport();

  log("");
  log("Resumen:");
  for (const item of touched) log(`- ${item}`);

  if (warnings.length > 0) {
    log("");
    log("Advertencias:");
    for (const warning of warnings) log(`- ${warning}`);
  }

  log("");
  log(APPLY ? "Listo. Revisa reports/tailwind-migration/README.md" : "Dry-run listo. Ejecuta con --apply para escribir cambios.");
}

run();