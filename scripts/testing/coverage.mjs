import fs from 'node:fs';
import path from 'node:path';
import { loadConfig, parseArgs, reportRoot, writeJson, writeText } from './core/filesystem.mjs';
import { inventory, normalizeCaseId } from './core/test-inventory.mjs';
import { pathToFileURL } from 'node:url';

/** Detecta ejecución directa; `import.meta.url` codifica los espacios de la ruta. */
const esEntrada = (url) => url === pathToFileURL(process.argv[1]).href;

/**
 * Cobertura de casos de uso.
 *
 * Autoridad única: sustituye a `test-quality/use-case-coverage.mjs` (heurística
 * textual) y a `test-suite/cases.mjs` (IDs explícitos), que emitían informes
 * contradictorios sobre los mismos casos.
 *
 * Regla que resuelve el conflicto: la heurística NUNCA declara cobertura. Sólo
 * sugiere dónde mirar. Un caso está CUBIERTO si tiene marcadores `@caso ID`
 * explícitos en al menos dos capas de comportamiento.
 *
 * Los tests generados bajo `tests/unit/files/` son capa SOURCE y quedan
 * excluidos del cómputo: demuestran que un archivo existe, parsea y resuelve
 * sus imports, no que un caso de uso funcione.
 */

const CAPAS_COMPORTAMIENTO = new Set(['UNIT', 'CONTRACT', 'INTEGRATION', 'E2E']);

const parseUseCaseIndex = (source, sourceFile) => {
  const cases = [];
  for (const line of source.split(/\r?\n/)) {
    const m = line.match(/^\|\s*([A-Z][A-Z0-9-]+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/);
    if (!m || m[1] === 'ID') continue;
    cases.push({
      id: normalizeCaseId(m[1]),
      origen: m[2].trim(),
      dominio: m[3].trim(),
      descripcion: m[4].trim(),
      sourceFile,
    });
  }
  return cases;
};

const parseRestorationMatrix = (source, sourceFile) => {
  const cases = [];
  for (const line of source.split(/\r?\n/)) {
    const m = line.match(/^\|\s*(UC-\d+)\s*\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|\s*([^|]+)\|/i);
    if (!m) continue;
    cases.push({
      id: normalizeCaseId(m[1]),
      origen: 'RESTORATION',
      dominio: m[3].trim(),
      descripcion: `${m[2].trim()} — ${m[4].trim()}`,
      prioridad: m[5].trim(),
      sourceFile,
    });
  }
  return cases;
};

const collectCases = (root, config) => {
  const found = new Map();
  for (const relative of config.canonicalUseCaseFiles ?? []) {
    const file = path.join(root, relative);
    if (!fs.existsSync(file)) continue;
    const source = fs.readFileSync(file, 'utf8');
    const parsed = relative.includes('USE-CASE-INDEX')
      ? parseUseCaseIndex(source, relative)
      : parseRestorationMatrix(source, relative);
    for (const item of parsed) {
      const prior = found.get(item.id);
      if (!prior || item.origen === 'RESTORATION') found.set(item.id, item);
    }
  }
  return [...found.values()].sort((a, b) => a.id.localeCompare(b.id, 'en', { numeric: true }));
};

const STOP = new Set(
  'de del la las el los y o a en por para con sin un una que se al como the and or to of in on for with without is debe deben cuando si su sus cada no'.split(
    ' ',
  ),
);
const palabras = (value) =>
  (value.toLowerCase().match(/[a-záéíóúñ0-9_-]{3,}/g) ?? []).filter((w) => !STOP.has(w));

const similitud = (a, b) => {
  const A = new Set(palabras(a));
  const B = new Set(palabras(b));
  if (!A.size) return 0;
  let hit = 0;
  for (const x of A) if (B.has(x)) hit += 1;
  return hit / A.size;
};

export function coverage({ root, strict = false } = {}) {
  const config = loadConfig(root);
  const reports = reportRoot(root, config);
  const casos = collectCases(root, config);
  const items = inventory(root, config);

  const evidencia = items.filter((i) => CAPAS_COMPORTAMIENTO.has(i.layer) && !i.generated);
  const generados = items.filter((i) => i.layer === 'SOURCE').length;

  const filas = casos.map((useCase) => {
    const directa = evidencia.filter((e) => e.caseIds.includes(useCase.id));
    const capas = [...new Set(directa.map((e) => e.layer))];

    let estado = 'FALTANTE';
    if (directa.length >= 2 && capas.length >= 2) estado = 'CUBIERTO';
    else if (directa.length >= 1) estado = 'PARCIAL';

    // La heurística sólo sugiere dónde buscar cuando no hay evidencia explícita.
    let sugerencias = [];
    if (estado === 'FALTANTE') {
      sugerencias = evidencia
        .map((e) => ({
          path: e.path,
          score: similitud(useCase.descripcion, `${e.titles.join(' ')} ${e.path}`),
        }))
        .filter((x) => x.score >= 0.4)
        .sort((a, b) => b.score - a.score)
        .slice(0, 3);
      if (sugerencias.length) estado = 'REVISAR';
    }

    return {
      ...useCase,
      estado,
      capas,
      tests: directa.map((e) => e.path),
      sugerencias,
    };
  });

  const totales = {};
  for (const fila of filas) totales[fila.estado] = (totales[fila.estado] ?? 0) + 1;

  const prioritarios = new Set(config.priorityCases ?? []);
  const gapsPrioritarios = filas.filter((f) => prioritarios.has(f.id) && f.estado !== 'CUBIERTO');

  const result = {
    generatedBy: 'scripts/testing/coverage.mjs',
    total: filas.length,
    totales,
    evidenceTests: evidencia.length,
    generatedSourceTests: generados,
    priorityGaps: gapsPrioritarios.map((f) => f.id),
    cases: filas,
    disclaimer:
      'CUBIERTO exige marcadores @caso explícitos en dos capas de comportamiento. Los tests generados de source-contract no cuentan.',
  };

  writeJson(path.join(reports, 'use-case-coverage.json'), result);
  writeText(
    path.join(reports, 'USE-CASE-COVERAGE.md'),
    [
      '# Cobertura de casos de uso',
      '',
      '> `CUBIERTO` exige marcadores `@caso ID` explícitos en al menos dos capas de',
      '> comportamiento (UNIT, CONTRACT, INTEGRATION, E2E). `REVISAR` es una pista',
      '> heurística, nunca una declaración de cobertura. Los source-contracts',
      '> generados no demuestran comportamiento.',
      '',
      `- Casos declarados: **${filas.length}**`,
      ...Object.entries(totales)
        .sort()
        .map(([k, v]) => `  - ${k}: ${v}`),
      `- Tests de comportamiento como evidencia: ${evidencia.length}`,
      `- Source-contracts generados (excluidos): ${generados}`,
      `- Casos prioritarios sin cerrar: **${gapsPrioritarios.length}**`,
      '',
      '## Casos prioritarios abiertos',
      '',
      ...(gapsPrioritarios.length
        ? gapsPrioritarios.map((f) => `- **${f.id}** — ${f.descripcion} — ${f.estado}`)
        : ['- Ninguno.']),
      '',
      '## Matriz',
      '',
      '| ID | Dominio | Descripción | Estado | Capas | Evidencia explícita |',
      '|---|---|---|---|---|---|',
      ...filas.map(
        (f) =>
          `| ${f.id} | ${f.dominio ?? ''} | ${String(f.descripcion ?? '').replace(/\|/g, '\\|')} | ${f.estado} | ${f.capas.join(', ')} | ${f.tests.map((t) => `\`${t}\``).join('<br>') || '—'} |`,
      ),
      '',
    ].join('\n'),
  );

  return { result, ok: !(strict && gapsPrioritarios.length > 0) };
}

if (esEntrada(import.meta.url)) {
  const { root, strict } = parseArgs();
  const { result, ok } = coverage({ root, strict });
  console.log(
    JSON.stringify(
      {
        total: result.total,
        totales: result.totales,
        evidenceTests: result.evidenceTests,
        priorityGaps: result.priorityGaps.length,
      },
      null,
      2,
    ),
  );
  if (!ok) process.exitCode = 1;
}
