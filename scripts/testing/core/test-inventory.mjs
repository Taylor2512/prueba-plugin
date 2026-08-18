import fs from 'node:fs';
import path from 'node:path';
import { rel, walk } from './filesystem.mjs';

export const isTestFile = (file) => /\.(?:spec|test)\.[cm]?[jt]sx?$/.test(file);
export const isBrowserSpec = (file) => /\.spec\.[cm]?[jt]sx?$/.test(file);

/** Títulos declarados con test/it/describe, normalizados a una línea. */
export const testTitles = (source) =>
  [...source.matchAll(/\b(?:test|it|describe)(?:\.\w+)?\s*\(\s*(['"`])([\s\S]*?)\1/g)]
    .map((m) => m[2].replace(/\s+/g, ' ').trim())
    .filter(Boolean);

/** Sólo `test(...)`/`it(...)`: los `describe` no son casos ejecutables. */
export const executableTitles = (source) =>
  [...source.matchAll(/\b(?:test|it)(?:\.\w+)?\s*\(\s*(['"`])([\s\S]*?)\1/g)]
    .map((m) => m[2].replace(/\s+/g, ' ').trim())
    .filter(Boolean);

export const normalizeCaseId = (value) => String(value ?? '').trim().toUpperCase();

/**
 * IDs de caso EXPLÍCITOS.
 *
 * Sólo cuentan las anotaciones `@caso ID`. Antes también se aceptaba cualquier
 * ID que apareciese en un título, lo que convertía una mención de pasada en
 * evidencia de cobertura.
 */
export const explicitCaseIds = (source) =>
  new Set(
    [...source.matchAll(/@caso\s+([A-Z][A-Z0-9-]*-\d{1,4})/gi)].map((m) => normalizeCaseId(m[1])),
  );

/** Capa derivada de la ruta canónica, no del nombre del archivo. */
export const detectLayer = (relativePath) => {
  const p = relativePath.replace(/\\/g, '/');
  if (p.startsWith('tests/unit/files/')) return 'SOURCE';
  if (p.startsWith('tests/unit/contracts/')) return 'CONTRACT';
  if (p.startsWith('tests/unit/')) return 'UNIT';
  if (p.startsWith('tests/integration/')) return 'INTEGRATION';
  if (p.startsWith('tests/e2e/')) return 'E2E';
  if (p.startsWith('tests/support/')) return 'SUPPORT';
  if (p.startsWith('tests/tooling/')) return 'TOOLING';
  return 'SIN_CLASIFICAR';
};

/** Dominio = primer segmento bajo la capa. */
export const detectDomain = (relativePath) => {
  const parts = relativePath.replace(/\\/g, '/').split('/');
  if (parts[0] !== 'tests') return '';
  if (parts[1] === 'e2e' || parts[1] === 'integration') return parts[2] ?? '';
  if (parts[1] === 'unit') return parts[3] ?? parts[2] ?? '';
  return '';
};

export const detectRuntime = (relativePath) =>
  detectLayer(relativePath) === 'E2E' ? 'playwright' : 'vitest';

/** Inventario completo de tests: la entrada de audit, coverage y organize. */
export const inventory = (root, config) => {
  const testRoot = path.join(root, config.testRoot ?? 'tests');
  return walk(testRoot, isTestFile).map((file) => {
    const relativePath = rel(root, file);
    const source = fs.readFileSync(file, 'utf8');
    return {
      path: relativePath,
      layer: detectLayer(relativePath),
      domain: detectDomain(relativePath),
      runtime: detectRuntime(relativePath),
      generated: /^\/\/\s*@generated/m.test(source),
      titles: executableTitles(source),
      describes: testTitles(source),
      caseIds: [...explicitCaseIds(source)],
      source,
    };
  });
};
