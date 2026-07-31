#!/usr/bin/env node
/**
 * Boundary de estilos del módulo de ejemplos.
 *
 * `src/examples` es un host de referencia: puede usar la API pública
 * (imports, props `className`/`style`) pero no puede alcanzar los internals de
 * `src/sisad-pdfme` con CSS ni deformar el runtime.
 *
 * Falla si aparece cualquiera de los patrones prohibidos. Sale con código 1
 * para poder usarse como gate en CI.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = process.cwd();
const TARGET_DIR = join(ROOT, 'src/examples');

/**
 * Cada patrón describe una forma de romper el aislamiento.
 * Los selectores llevan punto o corchete inicial a propósito: importar
 * `@/sisad-pdfme/react` es legítimo, escribir `.sisad-pdfme-*` no.
 */
const FORBIDDEN_PATTERNS = [
  { id: 'internal-class', pattern: /\.sisad-pdfme-/, hint: 'selector contra clases internas del runtime' },
  { id: 'moveable-class', pattern: /\.moveable-/, hint: 'selector contra Moveable' },
  { id: 'selecto-class', pattern: /\.selecto-/, hint: 'selector contra Selecto' },
  { id: 'schema-attribute', pattern: /\[data-schema-/, hint: 'selector contra atributos de schema' },
  { id: 'transform-scale', pattern: /transform:\s*scale\(|scale-\[/, hint: 'transform: scale para agrandar el runtime' },
  { id: 'css-zoom', pattern: /(^|[^-\w])zoom\s*:/, hint: 'zoom CSS' },
  { id: 'important', pattern: /!important/, hint: '!important sobre el runtime' },
];

const SCANNED_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.css']);

function collectFiles(dir) {
  const entries = readdirSync(dir);
  return entries.flatMap((entry) => {
    const fullPath = join(dir, entry);
    if (statSync(fullPath).isDirectory()) return collectFiles(fullPath);
    const dotIndex = entry.lastIndexOf('.');
    const extension = dotIndex === -1 ? '' : entry.slice(dotIndex);
    return SCANNED_EXTENSIONS.has(extension) ? [fullPath] : [];
  });
}

/**
 * Un comentario no aplica estilos, así que no puede romper el boundary.
 * Ignorarlos evita falsos positivos cuando la documentación menciona
 * literalmente `zoom`, `scale` o el nombre de una clase interna.
 */
const isCommentLine = (line) => /^\s*(\/\/|\/\*|\*)/.test(line);

const violations = [];

for (const file of collectFiles(TARGET_DIR)) {
  const lines = readFileSync(file, 'utf8').split('\n');
  lines.forEach((line, index) => {
    if (isCommentLine(line)) return;
    for (const { id, pattern, hint } of FORBIDDEN_PATTERNS) {
      if (pattern.test(line)) {
        violations.push({
          file: relative(ROOT, file),
          line: index + 1,
          id,
          hint,
          source: line.trim().slice(0, 120),
        });
      }
    }
  });
}

if (violations.length > 0) {
  console.error(`✗ Boundary de estilos roto (${violations.length} hallazgo(s)):\n`);
  for (const violation of violations) {
    console.error(`  ${violation.file}:${violation.line} [${violation.id}] ${violation.hint}`);
    console.error(`    ${violation.source}`);
  }
  console.error('\nUsa la API pública (imports, props className/style) en lugar de CSS profundo.');
  process.exit(1);
}

console.log('✓ src/examples no alcanza internals de src/sisad-pdfme');
