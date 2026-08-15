#!/usr/bin/env node
/**
 * Ratchet de exports sin consumidor: impide que la superficie muerta crezca.
 *
 * ## Por qué knip solo no basta
 *
 * Knip declaraba 1206 exports sin uso. La cifra era falsa por dos razones
 * distintas, y confundirlas es lo que hacía imposible actuar:
 *
 * 1. **API pública mal clasificada.** SISAD-PDFME es una librería reutilizable;
 *    sus consumidores son hosts externos, no `src/main.tsx`. Knip solo conocía
 *    la app de demostración, así que todo lo que el host importa parecía
 *    muerto. Declarar los barrels públicos como `entry` retiró 575 falsos.
 * 2. **Referencias dinámicas.** Los plugins de schema se resuelven por clave de
 *    cadena (`getSchemaPluginByType('select')`). El análisis estático no ve esa
 *    arista y nunca podrá verla.
 *
 * Por eso knip es **generador de evidencia, no autoridad de borrado**: este
 * script separa lo que puede ser candidato real de lo que solo lo parece, y
 * congela el total para que no empeore mientras se clasifica.
 *
 * Uso:
 *   node scripts/quality/dead-exports-ratchet.mjs [--update]
 */
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const args = process.argv.slice(2);
const update = args.includes('--update');
const thresholdPath = 'configs/dead-exports-threshold.json';

const run = () => {
  const raw = execFileSync('npx', ['knip', '--exports', '--reporter', 'json', '--no-progress'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    // Knip sale con código != 0 cuando encuentra hallazgos: es su forma de
    // reportar, no un fallo de ejecución.
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return JSON.parse(raw);
};

let report;
try {
  report = run();
} catch (error) {
  const stdout = error?.stdout;
  if (!stdout) {
    console.error('No se pudo ejecutar knip.');
    process.exit(1);
  }
  report = JSON.parse(String(stdout));
}

const issues = report.issues ?? [];

/**
 * Nombres que aparecen como literal de cadena en el código fuente.
 *
 * Señal barata de resolución dinámica: si un export se llama igual que una
 * clave de registry, borrarlo puede romper una arista que ningún análisis
 * estático ve. No prueba que esté vivo; prueba que **no se puede borrar a
 * ciegas**.
 */
const collectStringLiterals = () => {
  const literals = new Set();
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', 'coverage'].includes(entry.name)) continue;
        walk(full);
        continue;
      }
      if (!/\.(ts|tsx|js|jsx)$/.test(entry.name)) continue;
      const text = fs.readFileSync(full, 'utf8');
      for (const match of text.matchAll(/['"`]([A-Za-z_$][\w$]*)['"`]/g)) literals.add(match[1]);
    }
  };
  walk('src');
  return literals;
};

const literals = collectStringLiterals();

let unusedExports = 0;
let unusedTypes = 0;
const dynamicCandidates = [];
const staticCandidates = [];

for (const file of issues) {
  for (const item of file.exports ?? []) {
    unusedExports += 1;
    const row = `${file.file}:${item.line} ${item.name}`;
    (literals.has(item.name) ? dynamicCandidates : staticCandidates).push(row);
  }
  unusedTypes += (file.types ?? []).length;
}

const total = unusedExports + unusedTypes;
const summary = {
  files: issues.length,
  unusedExports,
  unusedTypes,
  total,
  possiblyDynamic: dynamicCandidates.length,
  staticCandidates: staticCandidates.length,
};

fs.mkdirSync('reports/quality', { recursive: true });
fs.writeFileSync(
  'reports/quality/dead-exports.json',
  `${JSON.stringify({ summary, dynamicCandidates, staticCandidates }, null, 2)}\n`,
);

console.log(JSON.stringify(summary, null, 2));

if (update) {
  fs.writeFileSync(
    thresholdPath,
    `${JSON.stringify(
      {
        threshold: total,
        baseline: summary,
        provenance: {
          note: 'Knip es evidencia, no autoridad de borrado. Este número solo puede bajar.',
          generatedAt: new Date().toISOString(),
        },
      },
      null,
      2,
    )}\n`,
  );
  console.log(`Baseline actualizado: ${total}`);
  process.exit(0);
}

if (!fs.existsSync(thresholdPath)) {
  console.error(`No existe ${thresholdPath}. Ejecuta con --update para fijar el baseline.`);
  process.exit(1);
}

const { threshold } = JSON.parse(fs.readFileSync(thresholdPath, 'utf8'));

if (total > threshold) {
  console.error(
    `DEAD_EXPORTS_RATCHET: ${total} > ${threshold}. La superficie sin consumidor creció; ` +
      'exporta solo lo que alguien importa o declara el nuevo entrypoint público.',
  );
  process.exit(1);
}

if (total < threshold) {
  console.log(`Margen disponible: baja el umbral de ${threshold} a ${total} con --update.`);
}
