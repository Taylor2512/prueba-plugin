#!/usr/bin/env node
/**
 * Gate de frontera de lenguaje/imports para `src/examples`.
 *
 * Reglas:
 * - `src/examples` solo puede contener JS/JSX/JSON.
 * - `src/examples` no puede importar archivos internos de `src/sisad-pdfme`.
 * - `src/examples` solo puede consumir entrypoints públicos documentados.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';

const ROOT = resolve(process.cwd(), getArgValue('--root') || '.');
const EXAMPLES_DIR = join(ROOT, 'src/examples');

const ALLOWED_EXTENSIONS = new Set(['.js', '.jsx', '.json']);
const ALLOWED_PUBLIC_IMPORTS = [
  '@/sisad-pdfme/labs',
  '@/sisad-pdfme/config',
  '@/sisad-pdfme/integration',
  '@/sisad-pdfme/react',
  '@sisad-pdfme/common',
  '@sisad-pdfme/schemas',
  'react',
  'react-router-dom',
];

function getArgValue(name) {
  const exact = process.argv.slice(2).find((arg) => arg === name || arg.startsWith(`${name}=`));
  if (!exact) return null;
  if (exact === name) {
    const index = process.argv.indexOf(name);
    return index >= 0 ? process.argv[index + 1] ?? null : null;
  }
  return exact.slice(name.length + 1);
}

function collectFiles(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) return collectFiles(fullPath);
    return [fullPath];
  });
}

function isAllowedPublicImport(specifier) {
  return ALLOWED_PUBLIC_IMPORTS.some((allowed) => specifier === allowed || specifier.startsWith(`${allowed}/`));
}

function isForbiddenSisadImport(specifier) {
  return /(^|\/)sisad-pdfme\//.test(specifier) && !isAllowedPublicImport(specifier);
}

const violations = [];

if (!statSync(EXAMPLES_DIR, { throwIfNoEntry: false })) {
  console.error(`✗ No existe el directorio objetivo: ${relative(ROOT, EXAMPLES_DIR)}`);
  process.exit(1);
}

for (const file of collectFiles(EXAMPLES_DIR)) {
  const extension = file.slice(file.lastIndexOf('.'));
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    violations.push({
      file: relative(ROOT, file),
      reason: `extensión no permitida (${extension || 'sin extensión'})`,
    });
    continue;
  }

  if (extension === '.json') continue;

  const source = readFileSync(file, 'utf8');
  const importRegex = /(?:import|export)\s+(?:[\s\S]*?\sfrom\s*)?['"]([^'"]+)['"]|import\(\s*['"]([^'"]+)['"]\s*\)/g;
  let match;
  while ((match = importRegex.exec(source)) !== null) {
    const specifier = match[1] || match[2];
    if (!specifier) continue;
    if (specifier.endsWith('.ts') || specifier.endsWith('.tsx')) {
      violations.push({
        file: relative(ROOT, file),
        reason: `importa una extensión TypeScript prohibida: ${specifier}`,
      });
      continue;
    }
    if (isForbiddenSisadImport(specifier)) {
      violations.push({
        file: relative(ROOT, file),
        reason: `import profundo prohibido: ${specifier}`,
      });
    }
  }
}

if (violations.length > 0) {
  console.error(`✗ Violaciones de frontera detectadas (${violations.length})`);
  for (const violation of violations) {
    console.error(`  ${violation.file}: ${violation.reason}`);
  }
  process.exit(1);
}

console.log('✓ src/examples usa solo JS/JSX/JSON y entrypoints públicos');
