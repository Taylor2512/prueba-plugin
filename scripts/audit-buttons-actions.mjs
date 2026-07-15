#!/usr/bin/env node
/**
 * Audita botones/acciones de forma heurística.
 * No modifica archivos.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = [
  'src/sisad-pdfme/ui/components',
  'src/features/pdfcomponent',
];

const exts = new Set(['.tsx', '.jsx', '.ts', '.js']);
const rows = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (['node_modules', 'dist', 'reports', 'test-results'].includes(entry.name)) continue;
      walk(full);
      continue;
    }
    if (!exts.has(path.extname(entry.name))) continue;
    scan(full);
  }
}

function scan(file) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const hasButton = /<Button\b|<button\b|role=["']button["']|onClick=|onPointerDown/.test(line);
    if (!hasButton) return;
    rows.push({
      file: path.relative(root, file),
      line: idx + 1,
      snippet: line.trim().slice(0, 180),
      hasOnClick: /onClick=|onPointerDown=|onMouseDown=/.test(line),
      hasTestId: /data-testid=/.test(line),
      hasAria: /aria-label=|aria-labelledby=/.test(line),
      hasTooltipNearby: /Tooltip/.test(lines.slice(Math.max(0, idx - 3), Math.min(lines.length, idx + 4)).join('\n')),
    });
  });
}

for (const target of targets) walk(path.join(root, target));

const outDir = path.join(root, 'reports', 'action-audit');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'button-action-inventory.md');

const md = [
  '# Button Action Inventory',
  '',
  `Total candidates: ${rows.length}`,
  '',
  '| File | Line | onClick | testId | aria | tooltip | Snippet |',
  '|---|---:|---:|---:|---:|---:|---|',
  ...rows.map(r => `| \`${r.file}\` | ${r.line} | ${r.hasOnClick ? 'yes' : 'no'} | ${r.hasTestId ? 'yes' : 'no'} | ${r.hasAria ? 'yes' : 'no'} | ${r.hasTooltipNearby ? 'yes' : 'no'} | \`${r.snippet.replace(/\|/g, '\\|')}\` |`)
].join('\n');

fs.writeFileSync(out, md);
console.log(`Wrote ${out}`);
