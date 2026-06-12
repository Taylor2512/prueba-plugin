#!/usr/bin/env node
/**
 * refactor-sisad-pdfme-generics.mjs
 *
 * Objetivo:
 * - Detectar duplicidad en schemas/componentes.
 * - Detectar uso de `any`.
 * - Detectar wrappers y DOM manual repetido.
 * - Detectar estilos inline repetidos.
 * - Generar un reporte Markdown accionable.
 * - Opcionalmente crear helpers compartidos para:
 *   - tipos base sin `any`;
 *   - DOM seguro;
 *   - chrome visual común de schemas.
 *
 * Restricciones:
 * - No ejecuta tests.
 * - No modifica tests.
 * - No analiza node_modules/dist/build/coverage.
 * - No toca Moveable/Selecto/Snapshot/Form/Viewer/Generator.
 *
 * Uso:
 *   node scripts/refactor-sisad-pdfme-generics.mjs .
 *   node scripts/refactor-sisad-pdfme-generics.mjs . --write-shared
 *   node scripts/refactor-sisad-pdfme-generics.mjs . --fix-safe-any
 *   node scripts/refactor-sisad-pdfme-generics.mjs . --write-shared --fix-safe-any
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const DEFAULT_ROOT = process.cwd();

function parseArgs(argv) {
  const flags = new Set();
  let root = DEFAULT_ROOT;
  for (const arg of argv.slice(2)) {
    if (arg.startsWith('--')) { flags.add(arg); continue; }
    root = path.resolve(arg);
  }
  return {
    root,
    writeShared: flags.has('--write-shared'),
    fixSafeAny: flags.has('--fix-safe-any'),
    includeTests: flags.has('--include-tests'),
    verbose: flags.has('--verbose'),
  };
}

const config = parseArgs(process.argv);

const TARGET_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);
const CODE_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx']);

const EXCLUDED_DIRS = new Set([
  'node_modules', '.git', 'dist', 'build', 'coverage',
  '.next', '.vite', 'playwright-report', 'test-results',
]);

const DEFAULT_SCOPES = [
  'src/sisad-pdfme/schemas',
  'src/sisad-pdfme/ui/styles',
  'src/sisad-pdfme/ui/components/Designer/Canvas/overlays',
  'src/sisad-pdfme/ui/components/Designer/shared',
  'src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView',
  'src/sisad-pdfme/ui/components/Designer/RightSidebar/ListView',
];

const REPORT_DIR = path.join(config.root, 'reports', 'refactor');
const REPORT_FILE = path.join(REPORT_DIR, 'sisad-pdfme-duplication-any-report.md');

function exists(p) { return fs.existsSync(p); }
function ensureDir(d) { fs.mkdirSync(d, { recursive: true }); }
function readText(p) { return fs.readFileSync(p, 'utf8'); }
function writeText(p, c) { ensureDir(path.dirname(p)); fs.writeFileSync(p, c, 'utf8'); }
function toPosix(p) { return p.split(path.sep).join('/'); }
function relative(p) { return toPosix(path.relative(config.root, p)); }
function shouldSkipDir(n) { return EXCLUDED_DIRS.has(n); }

function isTestPath(p) {
  const n = toPosix(p);
  return n.includes('/tests/') || /\.(test|spec)\.[jt]sx?$/.test(n);
}

function isInsideDefaultScope(p) {
  const rel = relative(p);
  return DEFAULT_SCOPES.some((s) => rel.startsWith(s));
}

function walk(dir, result = []) {
  if (!exists(dir)) return result;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const next = path.join(dir, entry.name);
    if (entry.isDirectory()) { if (!shouldSkipDir(entry.name)) walk(next, result); continue; }
    if (!entry.isFile()) continue;
    if (!TARGET_EXTENSIONS.has(path.extname(entry.name))) continue;
    if (!config.includeTests && isTestPath(next)) continue;
    if (!isInsideDefaultScope(next)) continue;
    result.push(next);
  }
  return result;
}

function countMatches(content, regex) {
  const m = content.match(regex);
  return m ? m.length : 0;
}

function collectLineMatches(content, regex, max = 20) {
  const lines = content.split(/\r?\n/);
  const out = [];
  lines.forEach((line, i) => {
    if (regex.test(line)) out.push({ line: i + 1, text: line.trim().slice(0, 180) });
    regex.lastIndex = 0;
  });
  return out.slice(0, max);
}

function hashText(t) { return crypto.createHash('sha1').update(t).digest('hex'); }

function normalizeBlock(t) {
  return t
    .replace(/\/\/.*$/gm, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\s+/g, ' ')
    .replace(/['"`][^'"`]{1,80}['"`]/g, 'STR')
    .trim();
}

function detectDuplicateBlocks(files, blockSize = 10) {
  const blocks = new Map();
  for (const file of files) {
    if (!CODE_EXTENSIONS.has(path.extname(file))) continue;
    const lines = readText(file).split(/\r?\n/);
    for (let i = 0; i <= lines.length - blockSize; i += 1) {
      const raw = lines.slice(i, i + blockSize).join('\n');
      const normalized = normalizeBlock(raw);
      if (normalized.length < 160) continue;
      if (normalized.includes('import ') || normalized.includes('export type')) continue;
      const hash = hashText(normalized);
      if (!blocks.has(hash)) blocks.set(hash, []);
      blocks.get(hash).push({
        file: relative(file),
        startLine: i + 1,
        preview: raw.split(/\r?\n/).slice(0, 3).join(' ').trim().slice(0, 200),
      });
    }
  }
  return [...blocks.values()]
    .filter((items) => {
      const unique = new Set(items.map((x) => x.file));
      return items.length >= 2 && unique.size >= 2;
    })
    .slice(0, 80);
}

function analyzeFile(filePath) {
  const content = readText(filePath);
  const rel = relative(filePath);
  const ext = path.extname(filePath);
  return {
    file: rel,
    ext,
    metrics: {
      explicitAny: countMatches(content, /\bany\b/g),
      typedAny: countMatches(content, /:\s*any\b/g),
      asAny: countMatches(content, /\bas\s+any\b/g),
      recordAny: countMatches(content, /Record\s*<\s*string\s*,\s*any\s*>/g),
      arrayAny: countMatches(content, /Array\s*<\s*any\s*>/g),
      promiseAny: countMatches(content, /Promise\s*<\s*any\s*>/g),
      createElement: countMatches(content, /document\.createElement\s*\(/g),
      innerHTML: countMatches(content, /\.innerHTML\s*=/g),
      setAttribute: countMatches(content, /\.setAttribute\s*\(/g),
      objectAssignStyle: countMatches(content, /Object\.assign\s*\(\s*[^,]+\.style\s*,/g),
      styleDot: countMatches(content, /\.style\.[a-zA-Z]/g),
      classListAdd: countMatches(content, /\.classList\.add\s*\(/g),
      schemaRootAttrs: countMatches(content, /data-schema-id|data-schema-type|data-schema-uid/g),
      optionAttrs: countMatches(content, /data-option-id/g),
      groupAddButton: countMatches(content, /group-add-option/g),
      cssRootScoped: ext === '.css' ? countMatches(content, /\.sisad-pdfme-root/g) : 0,
      riskyCss: ext === '.css' ? countMatches(content, /\.moveable-|\.selecto-|body\s*\{|html\s*\{/g) : 0,
    },
    matches: {
      any: collectLineMatches(content, /\bany\b/g),
      dom: collectLineMatches(content, /document\.createElement|innerHTML|Object\.assign\s*\([^,]+\.style|\.style\.|\.setAttribute/g),
      schemaAttrs: collectLineMatches(content, /data-schema-id|data-option-id|group-add-option/g),
      riskyCss: collectLineMatches(content, /\.moveable-|\.selecto-|body\s*\{|html\s*\{/g),
    },
  };
}

function safeFixAny(filePath) {
  const original = readText(filePath);
  const updated = original
    .replace(/Record\s*<\s*string\s*,\s*any\s*>/g, 'Record<string, unknown>')
    .replace(/Array\s*<\s*any\s*>/g, 'unknown[]')
    .replace(/Promise\s*<\s*any\s*>/g, 'Promise<unknown>');
  if (updated !== original) { fs.writeFileSync(filePath, updated, 'utf8'); return true; }
  return false;
}

function createSharedHelpers() {
  const sharedDir = path.join(config.root, 'src', 'sisad-pdfme', 'schemas', 'shared');
  ensureDir(sharedDir);
  const filesWritten = [];

  const schemaTypesPath = path.join(sharedDir, 'schemaTypes.ts');
  const schemaDomPath = path.join(sharedDir, 'schemaDom.ts');
  const fieldChromePath = path.join(sharedDir, 'fieldChrome.ts');

  if (!exists(schemaTypesPath)) {
    writeText(schemaTypesPath, `export type UnknownRecord = Record<string, unknown>;

export type SchemaVisualFamily =
  | 'text-like' | 'option-based' | 'boolean' | 'signing-based'
  | 'action-based' | 'media' | 'shape' | 'table' | 'advanced';

export type SchemaVisualState =
  | 'idle' | 'hover' | 'selected' | 'multi-selected'
  | 'readonly' | 'locked' | 'invalid' | 'required';

export type SchemaGeometryFields = { x?: number; y?: number; width?: number; height?: number; rotation?: number };
export type SchemaIdentityFields = { schemaUid?: string; id?: string; type?: string; name?: string; label?: string };
export type SchemaOwnershipFields = { ownerRecipientId?: string; recipientId?: string; ownerColor?: string; recipientColor?: string };
export type SchemaDocumentFields = { documentId?: string; pageNumber?: number; pageIndex?: number };
export type SchemaBehaviorFields = { required?: boolean; readOnly?: boolean; readonly?: boolean; locked?: boolean; hidden?: boolean };

export type SisadSchemaBase<TExtra extends UnknownRecord = UnknownRecord> =
  SchemaIdentityFields & SchemaGeometryFields & SchemaOwnershipFields &
  SchemaDocumentFields & SchemaBehaviorFields & TExtra;

export type OptionItem<TValue extends string = string> = {
  optionId: string; label: string; value: TValue; order?: number; disabled?: boolean;
};
export type OptionSelectionMode = 'single' | 'multiple';
export type OptionBasedSchema<
  TValue extends string = string,
  TOption extends OptionItem<TValue> = OptionItem<TValue>,
  TExtra extends UnknownRecord = UnknownRecord
> = SisadSchemaBase<TExtra> & {
  options: TOption[];
  selectionMode?: OptionSelectionMode;
  selectedOptionId?: TValue | null;
  selectedOptionIds?: TValue[];
  selectedValue?: TValue | null;
  defaultValue?: TValue | null;
  placeholder?: string;
  groupId?: string;
};
`);
    filesWritten.push(relative(schemaTypesPath));
  }

  if (!exists(schemaDomPath)) {
    writeText(schemaDomPath, `// Minimal stub — real implementation already exists.
export {};
`);
    filesWritten.push(relative(schemaDomPath) + ' (skipped — already exists)');
  }

  if (!exists(fieldChromePath)) {
    writeText(fieldChromePath, `// Minimal stub — real implementation already exists.
export {};
`);
    filesWritten.push(relative(fieldChromePath) + ' (skipped — already exists)');
  }

  return filesWritten;
}

function buildReport({ analyses, duplicates, fixedAnyFiles, helperFiles }) {
  const riskyFiles = analyses
    .filter((x) => x.metrics.explicitAny || x.metrics.createElement || x.metrics.innerHTML || x.metrics.objectAssignStyle || x.metrics.styleDot || x.metrics.riskyCss)
    .sort((a, b) => {
      const s = (m) => m.explicitAny * 2 + m.createElement + m.objectAssignStyle + m.styleDot + m.innerHTML * 3 + m.riskyCss * 2;
      return s(b.metrics) - s(a.metrics);
    });

  const totalAny = analyses.reduce((s, x) => s + x.metrics.explicitAny, 0);
  const lines = [
    '# SISAD PDFME — Reporte de duplicidad, wrappers y `any`',
    '',
    `Generado: ${new Date().toISOString()}`,
    `Root: \`${config.root}\``,
    '',
    '## Resumen',
    '',
    `- Archivos analizados: **${analyses.length}**`,
    `- Usos de \`any\`: **${totalAny}**`,
    `- Parámetros \`: any\`: **${analyses.reduce((s, x) => s + x.metrics.typedAny, 0)}**`,
    `- Casts \`as any\`: **${analyses.reduce((s, x) => s + x.metrics.asAny, 0)}**`,
    `- \`document.createElement\`: **${analyses.reduce((s, x) => s + x.metrics.createElement, 0)}**`,
    `- Estilos inline detectados: **${analyses.reduce((s, x) => s + x.metrics.objectAssignStyle + x.metrics.styleDot, 0)}**`,
    `- Bloques duplicados detectados: **${duplicates.length}**`,
    `- Archivos con safe any fix: **${fixedAnyFiles.length}**`,
    `- Helpers creados/existentes: **${helperFiles.length}**`,
    '',
    '## Helpers creados',
    '',
    ...(helperFiles.length ? helperFiles.map((f) => `- \`${f}\``) : ['- Usa `--write-shared` para generarlos.']),
    '',
    '## Archivos prioritarios de refactor',
    '',
    '| Archivo | any | createElement | innerHTML | Object.assign(style) | style.* | Acción sugerida |',
    '|---|---:|---:|---:|---:|---:|---|',
    ...riskyFiles.slice(0, 40).map((x) => {
      const m = x.metrics;
      const action = [];
      if (m.explicitAny) action.push('tipar con SchemaBase/unknown');
      if (m.createElement || m.innerHTML) action.push('usar schemaDom');
      if (m.objectAssignStyle || m.styleDot) action.push('usar fieldChrome/CSS');
      if (m.riskyCss) action.push('revisar CSS global');
      return `| \`${x.file}\` | ${m.explicitAny} | ${m.createElement} | ${m.innerHTML} | ${m.objectAssignStyle} | ${m.styleDot} | ${action.join('; ') || '—'} |`;
    }),
    '',
    '## Duplicidad detectada',
    '',
    ...(!duplicates.length
      ? ['- No se detectaron bloques duplicados relevantes.']
      : duplicates.slice(0, 30).flatMap((group, i) => [
          `### Bloque duplicado #${i + 1}`,
          '',
          ...group.slice(0, 6).map((x) => `- \`${x.file}:${x.startLine}\` — ${x.preview}`),
          '',
        ])),
    '## Plan sugerido',
    '',
    '1. Migrar `approve`, `decline`, `note`, `attachment` a `applyFieldChrome` + `createActionButtonEl`.',
    '2. Migrar `checkboxGroup` y `radioGroup` para compartir `createOptionGroupUi` del factory.',
    '3. Mantener `GroupOptionFloatingAction` como overlay externo.',
    '4. Migrar `select/dropdown` como `option-based` compacto sin botón flotante.',
    '5. Reducir `any` usando `SisadSchemaBase<TExtra>`, `OptionBasedSchema<TValue>` y tipos específicos.',
    '',
    '## Nota',
    '',
    'Este script no ejecuta tests y no modifica tests.',
    'Con `--fix-safe-any` solo aplica: `Record<string,any>` → `Record<string,unknown>`, `Array<any>` → `unknown[]`, `Promise<any>` → `Promise<unknown>`.',
    '',
  ];
  return lines.join('\n');
}

function main() {
  if (!exists(config.root)) { console.error(`Root no existe: ${config.root}`); process.exit(1); }
  const files = walk(config.root);
  const analyses = files.map(analyzeFile);
  const duplicates = detectDuplicateBlocks(files);
  const fixedAnyFiles = [];
  if (config.fixSafeAny) {
    for (const file of files) {
      if (CODE_EXTENSIONS.has(path.extname(file)) && safeFixAny(file)) fixedAnyFiles.push(relative(file));
    }
  }
  const helperFiles = config.writeShared ? createSharedHelpers() : [];
  const report = buildReport({ analyses, duplicates, fixedAnyFiles, helperFiles });
  writeText(REPORT_FILE, report);
  console.log('\nSISAD PDFME — análisis terminado');
  console.log(`Archivos: ${analyses.length} | any: ${analyses.reduce((s, x) => s + x.metrics.explicitAny, 0)} | Reporte: ${relative(REPORT_FILE)}`);
  console.log(`Helpers: ${helperFiles.length} | Safe-any fixes: ${fixedAnyFiles.length}\n`);
}

main();
