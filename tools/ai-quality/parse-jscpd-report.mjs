#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] ?? 'reports/jscpd/jscpd-report.json';
if (!fs.existsSync(input)) {
  console.error(`No existe: ${input}`);
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(input, 'utf8'));

const seen = new Set();
const candidates = [];
function walk(value) {
  if (!value || typeof value !== 'object') return;
  if (Array.isArray(value)) return value.forEach(walk);
  const first = value.firstFile ?? value.first ?? value.left;
  const second = value.secondFile ?? value.second ?? value.right;
  if (first && second) {
    const key = JSON.stringify([first, second, value.lines ?? value.duplicatedLines ?? value.fragment]);
    if (!seen.has(key)) { seen.add(key); candidates.push(value); }
  }
  Object.values(value).forEach(walk);
}
walk(data);

function fileOf(side) {
  if (typeof side === 'string') return side;
  return side?.name ?? side?.path ?? side?.file ?? '';
}
function category(files) {
  if (files.some(f => f.includes('/pdf-lib/') || f.startsWith('src/sisad-pdfme/pdf-lib/'))) return 'vendor';
  if (files.some(f => /documentacion-common-sisad-pdfme\.md|generated|consolid/i.test(f))) return 'generated-doc';
  return 'owned';
}
const out = { owned: [], vendor: [], 'generated-doc': [] };
for (const clone of candidates) {
  const files = [fileOf(clone.firstFile ?? clone.first ?? clone.left), fileOf(clone.secondFile ?? clone.second ?? clone.right)];
  out[category(files)].push({ files, lines: clone.lines ?? clone.duplicatedLines ?? null });
}
const summary = Object.fromEntries(Object.entries(out).map(([k,v]) => [k, v.length]));
console.log(JSON.stringify({ source: path.resolve(input), summary, clones: out }, null, 2));
