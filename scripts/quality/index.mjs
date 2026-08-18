#!/usr/bin/env node
import { spawnSync } from 'node:child_process';

/**
 * CLI única de calidad.
 *
 * Sustituye a las ~35 claves `quality:*` de `package.json`. Cada una era un
 * alias de una invocación de knip, jscpd o un script propio; mantenerlas como
 * claves npm obligaba a editar el manifiesto para cualquier variación y hacía
 * imposible ver qué capacidades existen realmente.
 *
 * Dos aliases se corrigieron al migrarlos:
 *   - `example-style-boundary` apuntaba a `check-example-style-boundary.mjs`,
 *     que no existe; el script real es `check_style-boundary.mjs`.
 *   - `no-inline-domain-copy` listaba once tests bajo `src/core`, `src/domain`,
 *     `src/modules`, `src/store` y `src/shared`: ninguna de esas rutas existe
 *     en este repositorio, así que el comando fallaba siempre. No se migra.
 */

const node = (script, ...args) => [process.execPath, [script, ...args]];
const knip = (...args) => ['npx', ['knip', ...args]];
const jscpd = (...args) => ['npx', ['jscpd', ...args]];

/** Cada entrada es un comando o una secuencia de comandos. */
const COMANDOS = {
  'dead-code': [knip('--cache')],
  'dead-code:production': [knip('--production', '--cache')],
  'dead-code:audit': [knip()],
  'dead-code:ci': [knip('--production')],
  'dead-files': [knip('--files')],
  'dead-exports': [knip('--exports')],
  'dead-dependencies': [knip('--dependencies')],
  cycles: [knip('--cycles')],
  fix: [knip('--fix')],

  'dead-exports:ratchet': [node('scripts/quality/dead-exports-ratchet.mjs')],
  'dead-exports:ratchet:update': [node('scripts/quality/dead-exports-ratchet.mjs', '--update')],

  duplicates: [jscpd('src', 'server', 'scripts')],
  'duplicates:strict': [jscpd('src', 'server', 'scripts', '--mode', 'mild', '--min-lines', '6', '--min-tokens', '50')],
  'duplicates:owned': [jscpd('src', 'server', 'scripts', '--config', 'configs/jscpd-owned.json')],
  'duplicates:vendor': [jscpd('src/sisad-pdfme/pdf-lib', '--config', 'configs/jscpd-vendor.json')],
  'duplicates:docs': [jscpd('.ai', '.agents', '.github', 'docs', '--config', 'configs/jscpd-docs.json')],
  'duplicates:ratchet': [node('scripts/quality/dedup-ratchet.js', '--report=reports/jscpd-owned/jscpd-report.json')],
  'duplicates:ci': [
    jscpd('src', 'server', 'scripts', '--threshold', '8', '--reporters', 'console,json,sarif', '--output', 'reports/jscpd', '--no-tips'),
  ],

  'large-files': [node('scripts/quality/list-large-files.js', '--max-lines=700')],
  'file-size-range': [
    node('scripts/quality/check-js-jsx-file-size-range.js', '--root=src', '--min-lines=300', '--max-lines=700'),
  ],
  'duplicate-functions': [node('scripts/quality/find-symbol-name-duplicates.js', '--mode=all')],
  'duplicate-hooks': [node('scripts/quality/find-symbol-name-duplicates.js', '--mode=hooks')],
  'duplicate-css': [node('scripts/quality/find-css-duplicates.js')],
  'wrapper-components': [node('scripts/quality/find-wrapper-components.js')],

  'direct-config-readers': [node('scripts/quality/check-direct-config-readers.mjs')],
  'source-language-boundary': [node('scripts/quality/check-source-language-boundary.mjs')],
  'compatibility-language': [node('scripts/quality/audit-compatibility-language.mjs')],
  'compatibility-language:strict': [node('scripts/quality/audit-compatibility-language.mjs', '--strict')],
  'example-style-boundary': [node('scripts/quality/check_style-boundary.mjs')],
  'template-contracts': [node('scripts/quality/validate-form-template-runtime-references.mjs')],
  'inspect-signing-har': [node('scripts/quality/inspect-signing-har.js')],
  'validation-samples': [node('scripts/validate-samples.mjs')],
};

/** Agregados: sólo composiciones de lo anterior, sin lógica propia. */
const AGREGADOS = {
  custom: ['duplicate-functions', 'wrapper-components', 'duplicate-hooks', 'duplicate-css'],
  architecture: ['large-files', 'file-size-range', 'custom'],
  'duplicates:profiles': ['duplicates:owned', 'duplicates:vendor', 'duplicates:docs'],
  verify: [
    'lint',
    'direct-config-readers',
    'source-language-boundary',
    'dead-code:ci',
    'duplicates:ci',
    'architecture',
  ],
};

const ESPECIALES = {
  lint: [['npm', ['run', 'lint']]],
};

const resolver = (nombre, vistos = new Set()) => {
  if (vistos.has(nombre)) throw new Error(`Ciclo en el agregado ${nombre}`);
  vistos.add(nombre);
  if (ESPECIALES[nombre]) return ESPECIALES[nombre];
  if (COMANDOS[nombre]) return COMANDOS[nombre];
  if (AGREGADOS[nombre]) return AGREGADOS[nombre].flatMap((sub) => resolver(sub, new Set(vistos)));
  return null;
};

const uso = () => {
  const nombres = [...Object.keys(AGREGADOS), ...Object.keys(ESPECIALES), ...Object.keys(COMANDOS)].sort();
  console.log('npm run quality -- <comando> [args extra]\n');
  console.log('Comandos:');
  for (const nombre of nombres) console.log(`  ${nombre}`);
};

const [comando = 'verify', ...extra] = process.argv.slice(2);

if (comando === 'help' || comando === '--help') {
  uso();
  process.exit(0);
}

const pasos = resolver(comando);
if (!pasos) {
  console.error(`Comando de calidad desconocido: ${comando}\n`);
  uso();
  process.exit(2);
}

for (const [bin, args] of pasos) {
  const linea = [bin === process.execPath ? 'node' : bin, ...args, ...extra].join(' ');
  console.log(`\n==> ${linea}`);
  const result = spawnSync(bin, [...args, ...extra], { stdio: 'inherit', env: process.env });
  if ((result.status ?? 1) !== 0) {
    console.error(`\nFALLO: ${linea}`);
    process.exit(result.status ?? 1);
  }
}
