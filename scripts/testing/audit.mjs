import fs from 'node:fs';
import path from 'node:path';
import { loadConfig, parseArgs, reportRoot, writeJson, writeText } from './core/filesystem.mjs';
import { inventory } from './core/test-inventory.mjs';
import { classify, ORDEN_SEVERIDAD } from './core/test-classifier.mjs';
import { pathToFileURL } from 'node:url';

/** Detecta ejecución directa; `import.meta.url` codifica los espacios de la ruta. */
const esEntrada = (url) => url === pathToFileURL(process.argv[1]).href;

/**
 * Auditoría de calidad de tests.
 *
 * Autoridad única: sustituye a `test-quality/audit.mjs` y a
 * `test-suite/audit.mjs`, que producían dos informes distintos sobre el mismo
 * árbol y discrepaban en severidad.
 */
export function audit({ root, strict = false } = {}) {
  const config = loadConfig(root);
  const reports = reportRoot(root, config);
  const items = inventory(root, config);

  const findings = [];
  const porCapa = {};
  const titulos = new Map();

  for (const item of items) {
    porCapa[item.layer] = (porCapa[item.layer] ?? 0) + 1;
    // Los tests generados no se auditan por estilo: su forma la fija el
    // generador, así que un hallazgo ahí sería ruido multiplicado por 423.
    if (item.generated) continue;
    findings.push(...classify(item));
    for (const title of item.titles) {
      const clave = title.toLowerCase();
      if (!titulos.has(clave)) titulos.set(clave, []);
      titulos.get(clave).push(item.path);
    }
  }

  for (const [title, paths] of titulos) {
    const unicos = [...new Set(paths)];
    if (unicos.length > 1) {
      findings.push({
        code: 'duplicate-test-title',
        severity: 'LOW',
        path: unicos.join(', '),
        detail: `Título repetido: "${title}".`,
      });
    }
  }

  // Configuración: dos configs de Playwright coexistiendo es un falso verde
  // esperando a ocurrir, porque cada runner puede elegir una distinta.
  if (
    fs.existsSync(path.join(root, 'playwright.config.js')) &&
    fs.existsSync(path.join(root, 'playwright.config.ts'))
  ) {
    findings.push({
      code: 'duplicate-playwright-config',
      severity: 'CRITICAL',
      path: 'playwright.config.js',
      detail: 'Coexisten configuración JS y TS de Playwright.',
    });
  }

  findings.sort(
    (a, b) =>
      ORDEN_SEVERIDAD[a.severity] - ORDEN_SEVERIDAD[b.severity] || a.path.localeCompare(b.path),
  );

  const resumen = {};
  for (const f of findings) resumen[f.severity] = (resumen[f.severity] ?? 0) + 1;

  const result = {
    generatedBy: 'scripts/testing/audit.mjs',
    testFiles: items.length,
    byLayer: porCapa,
    findings: findings.length,
    summary: resumen,
    items: findings,
  };

  writeJson(path.join(reports, 'test-audit.json'), result);
  const filas = findings.length
    ? findings
        .map(
          (f) =>
            `| ${f.severity} | ${f.code} | \`${f.path}\` | ${String(f.detail).replace(/\|/g, '\\|')} |`,
        )
        .join('\n')
    : '| — | — | — | Sin hallazgos |';

  writeText(
    path.join(reports, 'TEST-AUDIT.md'),
    [
      '# Auditoría de tests',
      '',
      `- Archivos de test: **${items.length}**`,
      ...Object.entries(porCapa)
        .sort()
        .map(([capa, n]) => `  - ${capa}: ${n}`),
      `- Hallazgos: **${findings.length}**`,
      `  - CRITICAL: ${resumen.CRITICAL ?? 0}`,
      `  - HIGH: ${resumen.HIGH ?? 0}`,
      `  - MEDIUM: ${resumen.MEDIUM ?? 0}`,
      `  - LOW: ${resumen.LOW ?? 0}`,
      '',
      '> Los tests generados (`@generated`) quedan fuera de las reglas de estilo:',
      '> su forma la fija el generador, no el autor.',
      '',
      '| Severidad | Código | Ruta | Detalle |',
      '|---|---|---|---|',
      filas,
      '',
    ].join('\n'),
  );

  const rojo = (resumen.CRITICAL ?? 0) > 0 || (strict && (resumen.HIGH ?? 0) > 0);
  return { result, ok: !rojo };
}

if (esEntrada(import.meta.url)) {
  const { root, strict } = parseArgs();
  const { result, ok } = audit({ root, strict });
  console.log(
    JSON.stringify(
      { testFiles: result.testFiles, byLayer: result.byLayer, summary: result.summary },
      null,
      2,
    ),
  );
  if (!ok) process.exitCode = 1;
}
