#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { loadConfig, parseArgs } from './core/filesystem.mjs';
import { run } from './core/git.mjs';

/**
 * CLI única de testing.
 *
 * Sustituye a las familias `test:sisad-pdfme:*`, `test:quality:*` y
 * `test:suite:*` de `package.json`. Las variaciones son argumentos, no claves
 * npm: un script por combinación es cómo se llegó a tener tres autoridades
 * distintas ejecutando prácticamente lo mismo.
 */

const USO = `
npm test -- <comando> [dominio] [flags]

  (sin comando)          Ejecuta unit + integration (vitest).
  unit [dominio]         tests/unit[/behavior/<dominio>]
  contracts [dominio]    tests/unit/contracts[/<dominio>]
  files                  tests/unit/files (source-contracts generados)
  integration [dominio]  tests/integration[/<dominio>]
  e2e [dominio]          tests/e2e[/<dominio>]

  audit                  Auditoría de calidad de tests.
  coverage               Cobertura de casos de uso.
  organize               Mapa de migración (--apply para mover).
  source-tests           Genera source-contracts (--apply para escribir).
  verify                 Gates por etapas (--full añade files y E2E).

Flags: --apply  --full  --strict  --project=<chromium|firefox|webkit>  --watch
`.trimEnd();

const { positionals, root, apply, full, strict, project, passthrough } = parseArgs();
const [comando = 'run', dominio] = positionals;

const config = loadConfig(root);
const layers = config.layers ?? {};

const existe = (relativo) => fs.existsSync(path.join(root, relativo));

/** Ruta de ejecución para una capa, verificando que exista antes de invocar. */
const rutaCapa = (capa, base, sub) => {
  const objetivo = sub ? `${base}/${sub}` : base;
  if (!existe(objetivo)) {
    console.error(`No existe ${objetivo}. Dominios disponibles en ${base}:`);
    const dir = path.join(root, base);
    if (fs.existsSync(dir)) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) console.error(`  - ${entry.name}`);
      }
    }
    process.exit(2);
  }
  return objetivo;
};

const vitest = (rutas) => {
  const modo = passthrough.includes('--watch') ? [] : ['run'];
  const extra = passthrough.filter((f) => f !== '--watch');
  return run('npx', ['vitest', ...modo, ...rutas, ...extra], { cwd: root }).status;
};

const playwright = (rutas) =>
  run(
    'npx',
    ['playwright', 'test', ...rutas, `--project=${project ?? 'chromium'}`, ...passthrough.filter((f) => !f.startsWith('--project'))],
    { cwd: root },
  ).status;

const cargar = async (modulo) => import(`./${modulo}`);

let status = 0;

switch (comando) {
  case 'run': {
    const rutas = [layers.unit?.root ?? 'tests/unit'];
    if (existe(layers.integration?.root ?? 'tests/integration')) {
      rutas.push(layers.integration.root);
    }
    status = vitest(rutas);
    break;
  }

  case 'unit':
    status = vitest([
      dominio ? rutaCapa('unit', 'tests/unit/behavior', dominio) : rutaCapa('unit', 'tests/unit'),
    ]);
    break;

  case 'contracts':
    status = vitest([rutaCapa('unit', 'tests/unit/contracts', dominio)]);
    break;

  case 'files':
    status = vitest([rutaCapa('unit', 'tests/unit/files')]);
    break;

  case 'integration':
    status = vitest([rutaCapa('integration', 'tests/integration', dominio)]);
    break;

  case 'e2e':
    status = playwright([rutaCapa('e2e', 'tests/e2e', dominio)]);
    break;

  case 'audit': {
    const { audit } = await cargar('audit.mjs');
    const { result, ok } = audit({ root, strict });
    console.log(JSON.stringify({ testFiles: result.testFiles, byLayer: result.byLayer, summary: result.summary }, null, 2));
    status = ok ? 0 : 1;
    break;
  }

  case 'coverage': {
    const { coverage } = await cargar('coverage.mjs');
    const { result, ok } = coverage({ root, strict });
    console.log(JSON.stringify({ total: result.total, totales: result.totales, priorityGaps: result.priorityGaps }, null, 2));
    status = ok ? 0 : 1;
    break;
  }

  case 'organize': {
    const { organize } = await cargar('organize.mjs');
    const { result, ok } = organize({ root, apply });
    console.log(JSON.stringify({ apply, byLayer: result.byLayer, pendingMoves: result.pendingMoves, pendingReview: result.pendingReview }, null, 2));
    status = strict && !ok ? 1 : 0;
    break;
  }

  case 'source-tests': {
    const { sourceTests } = await cargar('source-tests.mjs');
    const result = sourceTests({ root, apply });
    console.log(JSON.stringify(result, null, 2));
    status = apply || result.changes.length === 0 ? 0 : 1;
    break;
  }

  case 'verify': {
    const { verify } = await cargar('verify.mjs');
    status = verify({ root, full, strict, project: project ?? 'chromium' }).ok ? 0 : 1;
    break;
  }

  case 'help':
  case '--help':
    console.log(USO);
    break;

  default:
    console.error(`Comando desconocido: ${comando}\n${USO}`);
    status = 2;
}

process.exit(status);
