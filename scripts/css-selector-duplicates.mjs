#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = [
  'src/features/pdfcomponent/labRoutes.css',
  'src/sisad-pdfme/ui/styles/sisad-pdfme.css',
  'src/styles/sisad-tailwind-bridge.css',
];

const outDir = path.join(root, 'reports/tailwind-migration');
fs.mkdirSync(outDir, { recursive: true });

const normalizeSelector = (value) =>
  String(value || '')
    .replace(/\s+/g, ' ')
    .trim();

const classifySelector = (selector, occurrences) => {
  const s = selector.toLowerCase();
  const looksGeometry =
    /canvas|paper|zoom|transform|scale|moveable|selecto|scroll|page|overlay|position|translate|rotate|resize|drag/.test(s);
  const looksAntd = /(^|[\s>+~])\.ant-/.test(s) || s.includes(':where(.ant-');
  const looksMigratable =
    /right-sidebar-panel-switcher|list-view-item|list-view-toolbar|left-sidebar|plugin-icon|sidebar-surface-header/.test(s);

  if (occurrences > 1) return 'MERGE_SAME_SELECTOR';
  if (looksGeometry) return 'KEEP_GEOMETRY';
  if (looksAntd) return 'REVIEW_ANTD_OVERRIDE';
  if (looksMigratable) return 'MIGRATE_TO_TSX';
  return 'DELETE_AFTER_TSX_MIGRATION';
};

const isKeyframeSelector = (selector) => {
  const value = String(selector || '').trim().toLowerCase();
  return value === 'from' || value === 'to' || /^\d+%$/.test(value);
};

const stripComments = (text) =>
  text.replace(/\/\*[\s\S]*?\*\//g, (comment) => comment.replace(/[^\n]/g, ' '));

const extractRules = (text) => {
  const clean = stripComments(text);
  const rules = [];
  let depth = 0;
  let selectorStart = null;
  let inString = null;

  for (let i = 0; i < clean.length; i += 1) {
    const char = clean[i];
    const prev = clean[i - 1];

    if (inString) {
      if (char === inString && prev !== '\\') inString = null;
      continue;
    }

    if (char === '"' || char === "'") {
      inString = char;
      continue;
    }

    if (char === '{') {
      const header = clean.slice(selectorStart ?? i, i).trim();
      if (header && !header.startsWith('@')) {
        const line = clean.slice(0, selectorStart ?? i).split(/\r?\n/).length;
        rules.push({ selectorText: header, line });
      }
      depth += 1;
      selectorStart = null;
      continue;
    }

    if (char === '}') {
      depth = Math.max(0, depth - 1);
      selectorStart = null;
      continue;
    }

    if (depth >= 0 && selectorStart === null && !/\s/.test(char)) {
      selectorStart = i;
    }
  }

  return rules;
};

const files = targets.map((rel) => {
  const full = path.join(root, rel);
  const text = fs.existsSync(full) ? fs.readFileSync(full, 'utf8') : '';
  return { rel, full, text, rules: extractRules(text) };
});

const occurrences = [];

for (const file of files) {
  for (const rule of file.rules) {
    const selectors = rule.selectorText
      .split(',')
      .map((part) => normalizeSelector(part))
      .filter(Boolean);

    for (const selector of selectors) {
      if (isKeyframeSelector(selector)) continue;
      occurrences.push({
        selector,
        file: file.rel,
        line: rule.line,
      });
    }
  }
}

const grouped = new Map();
for (const occurrence of occurrences) {
  const bucket = grouped.get(occurrence.selector) || [];
  bucket.push(occurrence);
  grouped.set(occurrence.selector, bucket);
}

const sorted = Array.from(grouped.entries())
  .map(([selector, entries]) => ({
    selector,
    count: entries.length,
    classification: classifySelector(selector, entries.length),
    files: Array.from(new Set(entries.map((entry) => entry.file))).sort(),
    lines: entries.map((entry) => `${entry.file}:${entry.line}`).join(', '),
  }))
  .filter((entry) => entry.count > 1 || entry.classification !== 'DELETE_AFTER_TSX_MIGRATION')
  .sort((a, b) => b.count - a.count || a.selector.localeCompare(b.selector));

const rows = [
  '| Selector | Apariciones | Archivos | Líneas aprox. | Clasificación |',
  '|---|---:|---|---|---|',
];

for (const entry of sorted) {
  rows.push(
    `| \`${entry.selector}\` | ${entry.count} | ${entry.files.map((file) => `\`${file}\``).join('<br>')} | ${entry.lines} | ${entry.classification} |`,
  );
}

const report = [
  '# Selector duplicates current',
  '',
  'Auditoría generada sobre CSS activo del proyecto.',
  '',
  ...rows,
  '',
  'Ignora `reports/**`, `.tailwind-migration-backups/**` y reglas de keyframes.',
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'selector-duplicates-current.md'), report, 'utf8');
console.log('[css-selector-duplicates] escrito reports/tailwind-migration/selector-duplicates-current.md');
