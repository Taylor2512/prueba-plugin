#!/usr/bin/env node
/**
 * Auditoría de boundary sisad-pdfme (basada en IMPORTS reales, no en keywords).
 *
 * Falla (exit 1) si encuentra:
 *   [external-infra]  imports desde fuera de DigitalAgreements hacia
 *                     features/DigitalAgreements/core/infra/sisad-pdfme
 *   [deep-ui]         imports (de cualquier host) hacia
 *                     components/sisad-pdfme/ui/components/** (internals del diseñador)
 *   [externalForms]   externalForms importando desde features/DigitalAgreements
 *   [reexport-wrapper] archivos en core/infra/sisad-pdfme (excepto index.js)
 *                     cuyo contenido es SOLO re-export / alias sin lógica real
 *
 * Permite:
 *   DigitalAgreements -> @sisad-pdfme/{integration,shared,schemas,collaboration,...}
 *   DigitalAgreements -> DigitalAgreements/core/domain
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const projectRoot = path.resolve(process.cwd());
const SRC = path.join(projectRoot, 'src');

const DA = 'src/features/DigitalAgreements';
const DA_INFRA = 'src/features/DigitalAgreements/core/infra/sisad-pdfme';
const RUNTIME = 'src/components/sisad-pdfme';
const UI_INTERNALS = 'src/components/sisad-pdfme/ui/components';
const EXTERNAL_FORMS = 'src/modules/externalForms';

const isSource = (p) => /\.(ts|tsx|js|jsx|mjs)$/i.test(p) && !/\.d\.ts$/i.test(p);
const rel = (abs) => path.relative(projectRoot, abs).replace(/\\/g, '/');

const walk = async (dir) => {
  let out = [];
  let entries = [];
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (e.name === 'node_modules' || e.name === 'dist') continue;
      out = out.concat(await walk(full));
    } else if (e.isFile() && isSource(full)) {
      out.push(full);
    }
  }
  return out;
};

// Extrae los especificadores de módulo de un archivo (import/export ... from '...', import('...')).
const IMPORT_RE =
  /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|(?:^|[^.\w])import\s*\(\s*['"]([^'"]+)['"]\s*\)|(?:^|\n)\s*import\s+['"]([^'"]+)['"]/g;

const extractSpecifiers = (content) => {
  const specs = [];
  let m;
  while ((m = IMPORT_RE.exec(content)) !== null) {
    specs.push(m[1] || m[2] || m[3]);
  }
  return specs.filter(Boolean);
};

// Resuelve un especificador a una ruta src-relativa (o null si es bare/npm).
const resolveSpecifier = (spec, fromFileAbs) => {
  if (spec.startsWith('@sisad-pdfme/')) {
    return `src/components/sisad-pdfme/${spec.slice('@sisad-pdfme/'.length)}`;
  }
  if (spec.startsWith('@sisad-pdfme')) return 'src/components/sisad-pdfme';
  if (spec.startsWith('@/')) return `src/${spec.slice(2)}`;
  if (spec.startsWith('.')) {
    const abs = path.resolve(path.dirname(fromFileAbs), spec);
    return rel(abs);
  }
  return null; // bare / npm
};

const startsWithPath = (p, base) => p === base || p.startsWith(base + '/');

const files = await walk(SRC);
const findings = { 'external-infra': [], 'deep-ui': [], externalForms: [], 'reexport-wrapper': [] };

for (const fileAbs of files) {
  const fileRel = rel(fileAbs);
  const content = await readFile(fileAbs, 'utf8');
  const specs = extractSpecifiers(content);

  const inDA = startsWithPath(fileRel, DA);
  const inExternalForms = startsWithPath(fileRel, EXTERNAL_FORMS);

  for (const spec of specs) {
    const target = resolveSpecifier(spec, fileAbs);
    if (!target) continue;

    // [external-infra]
    if (!inDA && startsWithPath(target, DA_INFRA)) {
      findings['external-infra'].push(`${fileRel}  ->  ${spec}`);
    }
    // [deep-ui]  (los internals del runtime pueden importarse entre sí)
    if (
      startsWithPath(target, UI_INTERNALS) &&
      !startsWithPath(fileRel, RUNTIME)
    ) {
      findings['deep-ui'].push(`${fileRel}  ->  ${spec}`);
    }
    // [externalForms -> DigitalAgreements]
    if (inExternalForms && startsWithPath(target, DA)) {
      findings.externalForms.push(`${fileRel}  ->  ${spec}`);
    }
  }

  // [reexport-wrapper]  archivos en DA_INFRA (excepto index.js) que son solo re-export/alias
  if (
    startsWithPath(fileRel, DA_INFRA) &&
    path.basename(fileRel) !== 'index.js' &&
    /\.(js|ts)$/.test(fileRel)
  ) {
    const stripped = content
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '')
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);
    if (stripped.length > 0) {
      const meaningful = stripped.filter(
        (l) => !/^export\s+\*\s+from/.test(l) && !/^export\s+\{[^}]*\}\s+from/.test(l),
      );
      // Todas las líneas son `export * from` / `export {..} from`  => wrapper puro.
      const onlyReexports =
        meaningful.length === 0 &&
        stripped.some((l) => /from\s*['"]/.test(l));
      if (onlyReexports) {
        findings['reexport-wrapper'].push(fileRel);
      }
    }
  }
}

console.log('sisad-pdfme boundary audit (import-based)\n');
let total = 0;
for (const [category, items] of Object.entries(findings)) {
  const unique = [...new Set(items)];
  total += unique.length;
  console.log(`[${category}] ${unique.length}`);
  unique.slice(0, 40).forEach((i) => console.log(`  - ${i}`));
  if (unique.length > 40) console.log(`  - ... ${unique.length - 40} more`);
  console.log('');
}

if (total > 0) {
  console.error(`Boundary violations: ${total}`);
  process.exitCode = 1;
} else {
  console.log('Boundary audit passed. ✅');
}
