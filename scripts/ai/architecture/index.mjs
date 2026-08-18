#!/usr/bin/env node
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Router de arquitectura.
 *
 * `architecture-maintenance.mjs` y `ai-structure-maintenance.mjs` ya tienen sus
 * propios subcomandos; lo que faltaba era un punto de entrada que los reuniera,
 * de modo que `package.json` no necesite una clave por cada par
 * (herramienta, subcomando).
 */
const aqui = path.dirname(fileURLToPath(import.meta.url));

const HERRAMIENTAS = {
  // architecture-maintenance: audit | plan | apply | verify
  audit: ['architecture-maintenance.mjs', 'audit'],
  plan: ['architecture-maintenance.mjs', 'plan'],
  apply: ['architecture-maintenance.mjs', 'apply'],
  verify: ['architecture-maintenance.mjs', 'verify'],

  // estructura .ai
  'structure:audit': ['ai-structure-maintenance.mjs', 'audit'],
  'structure:plan': ['ai-structure-maintenance.mjs', 'plan'],
  'structure:apply': ['ai-structure-maintenance.mjs', 'apply'],
  'structure:verify': ['ai-structure-maintenance.mjs', 'verify'],

  status: ['reconcile-task-statuses.mjs'],
  hubs: ['build-markdown-hubs.mjs'],
};

const [comando, ...resto] = process.argv.slice(2);

if (!comando || comando === 'help' || comando === '--help') {
  console.log('npm run architecture -- <comando> [ruta] [--apply]\n\nComandos:');
  for (const nombre of Object.keys(HERRAMIENTAS)) console.log(`  ${nombre}`);
  process.exit(comando ? 0 : 2);
}

const entrada = HERRAMIENTAS[comando];
if (!entrada) {
  console.error(`Comando de arquitectura desconocido: ${comando}`);
  process.exit(2);
}

const [script, ...subcomando] = entrada;
// La ruta objetivo es opcional en la línea de comandos; por defecto, el cwd.
const args = resto.some((x) => !x.startsWith('--')) ? resto : ['.', ...resto];
const result = spawnSync(process.execPath, [path.join(aqui, script), ...subcomando, ...args], {
  stdio: 'inherit',
  env: process.env,
});
process.exit(result.status ?? 1);
