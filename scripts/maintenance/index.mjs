#!/usr/bin/env node
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Router de mantenimiento.
 *
 * `project-maintenance.mjs` ya expone audit/scrum-plan/scrum-apply/clean/names/
 * verify; aquí sólo se le añaden las dos utilidades que vivían sueltas como
 * claves npm (`sync-scrum-views`, `add-labelpath-to-selects`) para que el
 * manifiesto tenga una sola entrada `maintenance`.
 */
const raiz = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const principal = path.join(raiz, 'scripts/maintenance/project-maintenance.mjs');

const SUBCOMANDOS = new Set(['audit', 'scrum-plan', 'scrum-apply', 'clean', 'names', 'verify']);

const EXTRA = {
  'sync-scrum-views': path.join(raiz, 'scripts/ai/sync-scrum-views.mjs'),
  'add-select-label-paths': path.join(raiz, 'scripts/add-labelpath-to-selects.mjs'),
};

const [comando, ...resto] = process.argv.slice(2);

if (!comando || comando === 'help' || comando === '--help') {
  console.log('npm run maintenance -- <comando> [ruta] [--apply|--full]\n\nComandos:');
  for (const nombre of [...SUBCOMANDOS, ...Object.keys(EXTRA)]) console.log(`  ${nombre}`);
  process.exit(comando ? 0 : 2);
}

let bin;
let args;
if (EXTRA[comando]) {
  bin = EXTRA[comando];
  args = resto;
} else if (SUBCOMANDOS.has(comando)) {
  bin = principal;
  args = [comando, ...(resto.some((x) => !x.startsWith('--')) ? resto : ['.', ...resto])];
} else {
  console.error(`Comando de mantenimiento desconocido: ${comando}`);
  process.exit(2);
}

const result = spawnSync(process.execPath, [bin, ...args], { stdio: 'inherit', env: process.env });
process.exit(result.status ?? 1);
