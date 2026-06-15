#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root = path.resolve(process.argv[2] || process.cwd());
const args = new Set(process.argv.slice(3));
const confirm = args.has('--confirm');
const backup = args.has('--backup');

const IGNORE_DIRS = new Set([
  '.git', 'node_modules', 'dist', 'build', 'coverage',
  '.next', '.nuxt', '.turbo', '.cache', '.venv', 'venv',
  'out', 'tmp', 'temp'
]);

function walk(dir, acc = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) walk(full, acc);
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      acc.push(full);
    }
  }
  return acc;
}

if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
  console.error(`ERROR: ruta inválida: ${root}`);
  process.exit(1);
}

const files = walk(root).sort();
console.log(`Proyecto: ${root}`);
console.log(`Archivos .md encontrados: ${files.length}`);
for (const f of files) console.log(path.relative(root, f));

if (!confirm) {
  console.log('\\nDRY-RUN: no se eliminó nada.');
  console.log(`Para eliminar: node scripts/delete-existing-markdown.mjs "${root}" --confirm --backup`);
  process.exit(0);
}

if (backup && files.length) {
  const backupFile = path.join(root, `markdown-backup-${new Date().toISOString().replace(/[:.]/g, '-')}.tar.gz`);
  execFileSync('tar', ['-czf', backupFile, ...files.map(f => path.relative(root, f))], { cwd: root, stdio: 'inherit' });
  console.log(`Backup creado: ${backupFile}`);
}

for (const f of files) fs.rmSync(f, { force: true });
console.log(`Eliminados: ${files.length}`);
