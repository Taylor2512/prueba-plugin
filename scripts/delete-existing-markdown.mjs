#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.resolve(process.argv[2] || process.cwd());
const args = new Set(process.argv.slice(3));
const confirm = args.has('--confirm');
const backup = args.has('--backup');
const IGNORE = new Set(['.git','node_modules','dist','build','coverage','.next','.nuxt','.turbo','.cache','.venv','venv','out','tmp','temp']);
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) { console.error(`ERROR: ruta inválida: ${root}`); process.exit(1); }
function walk(dir, out=[]) { for (const e of fs.readdirSync(dir,{withFileTypes:true})) { const full=path.join(dir,e.name); if (e.isDirectory()) { if (!IGNORE.has(e.name)) walk(full,out); } else if (e.isFile() && e.name.endsWith('.md')) out.push(full); } return out; }
const files = walk(root).sort();
const rel = f => path.relative(root,f).split(path.sep).join('/');
console.log(`Proyecto: ${root}`); console.log(`Archivos .md encontrados: ${files.length}`); files.forEach(f=>console.log(rel(f)));
if (!confirm) { console.log('DRY-RUN: no se eliminó nada. Usa --confirm para eliminar. Usa --confirm --backup para respaldar.'); process.exit(0); }
if (backup && files.length) { const backupFile=`markdown-backup-${new Date().toISOString().replace(/[:.]/g,'-')}.tar.gz`; execFileSync('tar',['-czf',backupFile,...files.map(rel)],{cwd:root,stdio:'inherit'}); console.log(`Backup creado: ${backupFile}`); }
for (const f of files) fs.rmSync(f,{force:true});
console.log(`Eliminación completada. Archivos .md eliminados: ${files.length}`);
