#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const roots = process.argv.slice(2).length ? process.argv.slice(2) : ['.ai', '.agents', '.github', 'AGENTS.md', 'CLAUDE.md'];
const files = [];
function collect(p) {
  if (!fs.existsSync(p)) return;
  const stat = fs.statSync(p);
  if (stat.isDirectory()) {
    for (const name of fs.readdirSync(p)) collect(path.join(p, name));
  } else if (/\.md$/i.test(p)) files.push(p);
}
roots.forEach(collect);
const index = new Map();
for (const file of files) {
  let fenced = false;
  const paras = [];
  let acc = [];
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    if (line.trim().startsWith('```')) { fenced = !fenced; continue; }
    if (fenced || line.trim().startsWith('#') || line.trim().startsWith('---')) continue;
    if (!line.trim()) { if (acc.length) paras.push(acc.join(' ')); acc = []; }
    else acc.push(line.trim());
  }
  if (acc.length) paras.push(acc.join(' '));
  for (const paragraph of paras) {
    const norm = paragraph.toLowerCase().replace(/`[^`]+`/g, '<code>').replace(/\s+/g, ' ').trim();
    if (norm.length < 140) continue;
    const list = index.get(norm) ?? [];
    list.push(file); index.set(norm, list);
  }
}
const duplicates = [...index.entries()].filter(([, refs]) => new Set(refs).size > 1)
  .map(([paragraph, refs]) => ({ paragraph: paragraph.slice(0, 180), files: [...new Set(refs)] }));
console.log(JSON.stringify({ files: files.length, duplicateParagraphs: duplicates.length, duplicates }, null, 2));
process.exitCode = duplicates.length ? 1 : 0;
