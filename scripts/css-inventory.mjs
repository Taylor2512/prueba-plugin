#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const targets = [
  'src/styles/tailwind.css',
  'src/style.css',
  'src/styles/sisad-tailwind-bridge.css',
  'src/features/pdfcomponent/labRoutes.css',
  'src/sisad-pdfme/ui/styles/sisad-pdfme.css',
  'src/sisad-pdfme/ui/styles/tokens.css',
];

const outDir = path.join(root, 'reports/tailwind-migration');
fs.mkdirSync(outDir, { recursive: true });

const rows = ['| Archivo | Líneas | KB | Nota |', '|---|---:|---:|---|'];

for (const rel of targets) {
  const full = path.join(root, rel);
  if (!fs.existsSync(full)) {
    rows.push(`| \`${rel}\` | 0 | 0 | no existe |`);
    continue;
  }
  const text = fs.readFileSync(full, 'utf8');
  const lines = text.split(/\r?\n/).length;
  const kb = (Buffer.byteLength(text, 'utf8') / 1024).toFixed(1);
  const note =
    rel.endsWith('tokens.css') ? 'conservar tokens' :
    rel.includes('sisad-pdfme.css') ? 'migrar solo reglas visuales seguras' :
    rel.includes('labRoutes.css') ? 'migrar lab UI por componentes' :
    rel.endsWith('style.css') ? 'mantener neutralizado' :
    rel.endsWith('tailwind.css') ? 'fuente única Tailwind' :
    'revisar';
  rows.push(`| \`${rel}\` | ${lines} | ${kb} | ${note} |`);
}

const report = [
  '# Inventario CSS activo',
  '',
  ...rows,
  '',
  'No incluir `reports/**` ni `.tailwind-migration-backups/**` como CSS activo.',
  '',
].join('\n');

fs.writeFileSync(path.join(outDir, 'active-css-inventory.md'), report, 'utf8');
console.log('[css-inventory] escrito reports/tailwind-migration/active-css-inventory.md');
