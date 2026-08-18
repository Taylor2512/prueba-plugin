import fs from 'node:fs';
import path from 'node:path';
import { loadConfig, parseArgs, reportRoot, writeJson, writeText } from './core/filesystem.mjs';
import { inventory } from './core/test-inventory.mjs';
import { assertSafeTargets } from './core/git.mjs';
import { pathToFileURL } from 'node:url';

/** Detecta ejecución directa; `import.meta.url` codifica los espacios de la ruta. */
const esEntrada = (url) => url === pathToFileURL(process.argv[1]).href;

/**
 * Mapa de migración y organización de tests.
 *
 * A diferencia del organizador anterior, no mueve por nombre de archivo: sólo
 * propone destino cuando la responsabilidad es inequívoca a partir de la capa
 * y del runtime que el test necesita. Todo lo demás queda en REVIEW, porque
 * mover un test ambiguo sin resolver su responsabilidad es exactamente cómo se
 * generaron las jerarquías paralelas que este comando existe para cerrar.
 */

const CAPAS_CANONICAS = new Set([
  'UNIT',
  'CONTRACT',
  'SOURCE',
  'INTEGRATION',
  'E2E',
  'SUPPORT',
  'TOOLING',
]);

const destinoInequivoco = (item) => {
  // Un `.spec.ts` en la raíz de tests/ es Playwright sin clasificar.
  if (!/^tests\/[^/]+\.spec\.[cm]?[jt]sx?$/.test(item.path)) return null;
  const source = item.source;
  const nombre = path.basename(item.path);
  if (/\/designer\//.test(source)) return `tests/e2e/designer/${nombre}`;
  if (/\/runtime\/viewer/.test(source)) return `tests/e2e/runtime/${nombre}`;
  if (/\/runtime\/form/.test(source)) return `tests/e2e/form/${nombre}`;
  return null;
};

export function organize({ root, apply = false } = {}) {
  const config = loadConfig(root);
  const reports = reportRoot(root, config);
  const items = inventory(root, config);

  const registros = items.map((item) => {
    const canonica = CAPAS_CANONICAS.has(item.layer);
    const suelto = /^tests\/[^/]+\.(?:spec|test)\.[cm]?[jt]sx?$/.test(item.path);
    const destino = suelto ? destinoInequivoco(item) : null;

    let accion = 'KEEP';
    let motivo = 'Ya está en su capa canónica.';
    if (item.generated) {
      accion = 'GENERATED';
      motivo = 'Derivado del generador; no se edita ni se mueve a mano.';
    } else if (suelto && destino) {
      accion = 'MOVE';
      motivo = 'E2E sin clasificar con ruta de destino inequívoca.';
    } else if (suelto) {
      accion = 'REVIEW';
      motivo = 'E2E sin clasificar: la responsabilidad no se deduce del contenido.';
    } else if (!canonica) {
      accion = 'REVIEW';
      motivo = 'Fuera de las capas canónicas.';
    }

    return {
      path: item.path,
      target: destino ?? item.path,
      layer: item.layer,
      domain: item.domain,
      runtime: item.runtime,
      caseIds: item.caseIds,
      cases: item.titles.length,
      action: accion,
      reason: motivo,
    };
  });

  const movimientos = registros.filter((r) => r.action === 'MOVE');
  const revisiones = registros.filter((r) => r.action === 'REVIEW');

  if (apply && movimientos.length) {
    assertSafeTargets(
      root,
      movimientos.flatMap((m) => [m.path, m.target]),
      config.claimsFile,
    );
    for (const movimiento of movimientos) {
      const destino = path.join(root, movimiento.target);
      if (fs.existsSync(destino)) {
        movimiento.action = 'BLOCKED';
        movimiento.reason = 'El destino ya existe.';
        continue;
      }
      fs.mkdirSync(path.dirname(destino), { recursive: true });
      fs.renameSync(path.join(root, movimiento.path), destino);
      movimiento.action = 'APPLIED';
    }
  }

  const porCapa = {};
  for (const r of registros) porCapa[r.layer] = (porCapa[r.layer] ?? 0) + 1;

  const result = {
    generatedBy: 'scripts/testing/organize.mjs',
    apply,
    total: registros.length,
    byLayer: porCapa,
    pendingMoves: movimientos.length,
    pendingReview: revisiones.length,
    items: registros,
  };

  writeJson(path.join(reports, 'test-migration-map.json'), result);
  writeText(
    path.join(reports, 'TEST-MIGRATION-MAP.md'),
    [
      '# Mapa de migración de tests',
      '',
      `Modo: **${apply ? 'apply' : 'dry-run'}**`,
      '',
      `- Archivos inventariados: **${registros.length}**`,
      ...Object.entries(porCapa)
        .sort()
        .map(([capa, n]) => `  - ${capa}: ${n}`),
      `- Movimientos pendientes: **${movimientos.length}**`,
      `- Pendientes de revisión: **${revisiones.length}**`,
      '',
      '> `MOVE` sólo aparece cuando la ruta de destino se deduce sin ambigüedad.',
      '> Un test cuya responsabilidad no está resuelta queda en `REVIEW` y se',
      '> migra a mano: mover por nombre de archivo es lo que produjo las',
      '> jerarquías paralelas anteriores.',
      '',
      '## Acciones distintas de KEEP/GENERATED',
      '',
      '| Acción | Origen | Destino | Capa | Dominio | Casos | Motivo |',
      '|---|---|---|---|---|---|---|',
      ...(registros.filter((r) => !['KEEP', 'GENERATED'].includes(r.action)).length
        ? registros
            .filter((r) => !['KEEP', 'GENERATED'].includes(r.action))
            .map(
              (r) =>
                `| ${r.action} | \`${r.path}\` | \`${r.target}\` | ${r.layer} | ${r.domain} | ${r.cases} | ${r.reason} |`,
            )
        : ['| — | — | — | — | — | — | Sin acciones pendientes |']),
      '',
    ].join('\n'),
  );

  return { result, ok: revisiones.length === 0 && movimientos.length === 0 };
}

if (esEntrada(import.meta.url)) {
  const { root, apply, strict } = parseArgs();
  const { result, ok } = organize({ root, apply });
  console.log(
    JSON.stringify(
      {
        apply,
        total: result.total,
        byLayer: result.byLayer,
        pendingMoves: result.pendingMoves,
        pendingReview: result.pendingReview,
      },
      null,
      2,
    ),
  );
  if (strict && !ok) process.exitCode = 1;
}
