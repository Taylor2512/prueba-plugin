#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const base = path.join(root, 'src/features/pdfcomponent');
const patterns = [
  ['DesignerEngineBuilder', /DesignerEngineBuilder/g],
  ['usePdfmeRuntimeInstance', /usePdfmeRuntimeInstance/g],
  ['decorateTemplateWithCollaboration', /decorateTemplateWithCollaboration/g],
  ['decorateCollaborationUsers', /decorateCollaborationUsers/g],
  ['commonOptions.collaboration', /commonOptions\s*=|collaboration\s*:/g],
  ['setTimeout', /setTimeout/g],
  ['core imports', /@\/sisad-pdfme|@sisad-pdfme/g],
];

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    if (!/\.(jsx?|tsx?)$/.test(entry.name)) return [];
    return [full];
  });
}

const rows = [];
for (const file of walk(base)) {
  const text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(root, file);
  const row = { file: rel };
  let score = 0;
  for (const [name, re] of patterns) {
    const count = [...text.matchAll(re)].length;
    row[name] = count;
    score += count;
  }
  row.score = score;
  rows.push(row);
}

rows.sort((a,b) => b.score - a.score);
console.log('| file | score | DesignerEngineBuilder | runtime | decorators | setTimeout | core imports |');
console.log('|---|---:|---:|---:|---:|---:|---:|');
for (const r of rows) {
  console.log(`| ${r.file} | ${r.score} | ${r.DesignerEngineBuilder || 0} | ${r.usePdfmeRuntimeInstance || 0} | ${(r.decorateTemplateWithCollaboration || 0) + (r.decorateCollaborationUsers || 0)} | ${r.setTimeout || 0} | ${r['core imports'] || 0} |`);
}
