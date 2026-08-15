#!/usr/bin/env node
/**
 * Gate de frontera de lenguaje/imports para `src/`.
 *
 * La frontera tiene DOS lados y el gate vigila los dos:
 *
 * - `src/sisad-pdfme/**` es el componente reusable y va en **TypeScript**
 *   (`.ts`/`.tsx`). Un `.js` ahí dentro es una fuga del host hacia el core.
 * - el resto de `src/` es el host de ejemplos y va en **JavaScript**
 *   (`.js`/`.jsx`). Un `.ts` ahí es el core desbordándose hacia el host.
 *
 * La versión anterior recorría `src/` entero con una única lista permitida de
 * JS/JSX/JSON, así que denunciaba los 437 archivos TypeScript del propio
 * componente —exactamente al revés de la regla— y el gate no podía usarse.
 *
 * Además:
 * - el host no puede importar archivos internos de `src/sisad-pdfme`;
 * - el host solo consume entrypoints públicos documentados.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const ROOT = resolve(process.cwd(), getArgValue('--root') || '.');
const _DIR = join(ROOT, 'src/');
const CORE_DIR = join(ROOT, 'src', 'sisad-pdfme');

/** Recursos que ambos lados pueden contener: no son código de ninguno. */
const SHARED_EXTENSIONS = new Set(['.json', '.css', '.md', '.svg', '.png', '.woff', '.woff2']);
const CORE_EXTENSIONS = new Set(['.ts', '.tsx']);
const HOST_EXTENSIONS = new Set(['.js', '.jsx']);

/** Declaraciones globales del proyecto; no son código del host. */
const HOST_TYPE_DECLARATION = /\.d\.ts$/;

const isCoreFile = (file) => file === CORE_DIR || file.startsWith(CORE_DIR + sep);
const ALLOWED_PUBLIC_IMPORTS = [
  '@/sisad-pdfme/config',
  '@/sisad-pdfme/devtools',
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
    // Los archivos ocultos son ruido del sistema (.DS_Store), no código fuente.
    if (entry.startsWith('.')) return [];
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

if (!statSync(_DIR, { throwIfNoEntry: false })) {
  console.error(`✗ No existe el directorio objetivo: ${relative(ROOT, _DIR)}`);
  process.exit(1);
}

for (const file of collectFiles(_DIR)) {
  const extension = file.slice(file.lastIndexOf('.'));
  const inCore = isCoreFile(file);

  if (SHARED_EXTENSIONS.has(extension)) continue;
  // Declaraciones globales de tipos: no son código del host ni del core.
  if (!inCore && HOST_TYPE_DECLARATION.test(file)) continue;

  const allowed = inCore ? CORE_EXTENSIONS : HOST_EXTENSIONS;
  if (!allowed.has(extension)) {
    violations.push({
      file: relative(ROOT, file),
      reason: inCore
        ? `el componente va en TypeScript: extensión no permitida (${extension || 'sin extensión'})`
        : `el host de ejemplos va en JavaScript: extensión no permitida (${extension || 'sin extensión'})`,
    });
    continue;
  }

  // Los imports profundos y con extensión TS sólo se vigilan en el host: el
  // core importa sus propios módulos con toda legitimidad.
  if (inCore) continue;

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

console.log('✓ src/sisad-pdfme en TypeScript, host en JavaScript, entrypoints públicos respetados');
