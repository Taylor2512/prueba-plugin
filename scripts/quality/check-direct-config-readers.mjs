#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(process.argv[2] || 'src');
const pattern = /options\.(visibility|assignment|sidebars|canvas|schemas)\b/g;
const allowedFiles = new Set([
  path.resolve('src/sisad-pdfme/ui/components/Designer/shared/designerUiConfig.ts'),
  path.resolve('src/sisad-pdfme/templates/createDefaultTemplate.ts'),
]);
const ignoredSegments = new Set(['node_modules', 'dist', '.git', '.vite', '.cache']);

const walk = (dir, files = []) => {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignoredSegments.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, files);
      continue;
    }
    if (/\.(ts|tsx|js|jsx|mjs|cjs)$/.test(entry.name)) files.push(full);
  }
  return files;
};

const matches = [];
for (const file of walk(root)) {
  if (allowedFiles.has(path.resolve(file))) continue;
  const text = fs.readFileSync(file, 'utf8');
  const found = [...text.matchAll(pattern)];
  if (found.length === 0) continue;
  matches.push({
    file: path.relative(process.cwd(), file),
    hits: found.map((match) => match[0]),
  });
}

console.log(`Direct config readers: ${matches.length}`);
for (const match of matches) {
  console.log(`${match.file}`);
  for (const hit of match.hits) {
    console.log(`  - ${hit}`);
  }
}

if (matches.length > 0) process.exitCode = 1;
