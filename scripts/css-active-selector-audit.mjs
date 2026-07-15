#!/usr/bin/env node
/**
 * Audita selectores CSS activos. No modifica archivos.
 */
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const files = [
  'src/features/pdfcomponent/labRoutes.css',
  'src/sisad-pdfme/ui/styles/sisad-pdfme.css',
  'src/styles/sisad-tailwind-bridge.css',
].map(p => path.join(root, p)).filter(fs.existsSync);

const selectorMap = new Map();

for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed.endsWith('{')) return;
    if (trimmed.startsWith('@')) return;
    const selector = trimmed.slice(0, -1).trim();
    if (!selector) return;
    const key = selector.replace(/\s+/g, ' ');
    const arr = selectorMap.get(key) || [];
    arr.push({ file: path.relative(root, file), line: idx + 1 });
    selectorMap.set(key, arr);
  });
}

const duplicates = [...selectorMap.entries()]
  .filter(([, hits]) => hits.length > 1)
  .sort((a, b) => b[1].length - a[1].length);

const outDir = path.join(root, 'reports', 'tailwind-migration');
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, 'active-selector-duplicates.md');

const md = [
  '# Active Selector Duplicates',
  '',
  `Files scanned: ${files.map(f => path.relative(root, f)).join(', ')}`,
  `Duplicate selectors: ${duplicates.length}`,
  '',
  '| Selector | Count | Locations | Suggested class |',
  '|---|---:|---|---|',
  ...duplicates.map(([selector, hits]) => {
    const suggestion =
      /moveable|selecto|canvas|paper|zoom|schema/.test(selector)
        ? 'KEEP_GEOMETRY_REVIEW'
        : /right-sidebar|left-sidebar|list-view|detail|toolbar|button/.test(selector)
          ? 'MIGRATE_TO_TSX'
          : 'REVIEW';
    return `| \`${selector.replace(/\|/g, '\\|')}\` | ${hits.length} | ${hits.map(h => `\`${h.file}:${h.line}\``).join('<br>')} | ${suggestion} |`;
  })
].join('\n');

fs.writeFileSync(out, md);
console.log(`Wrote ${out}`);
