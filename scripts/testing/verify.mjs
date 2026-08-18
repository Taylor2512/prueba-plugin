import path from 'node:path';
import { loadConfig, parseArgs } from './core/filesystem.mjs';
import { run } from './core/git.mjs';
import { audit } from './audit.mjs';
import { coverage } from './coverage.mjs';
import { organize } from './organize.mjs';
import { validateSourceMap } from './source-tests.mjs';
import { pathToFileURL } from 'node:url';

/** Detecta ejecución directa; `import.meta.url` codifica los espacios de la ruta. */
const esEntrada = (url) => url === pathToFileURL(process.argv[1]).href;

/**
 * Verificación por etapas, de la más barata a la más cara.
 *
 * El orden importa: los gates estáticos corren primero para que un fallo de
 * estructura no consuma una suite completa de navegador antes de reportarse.
 * Ningún gate se salta en silencio; si algo se omite, sale en el resumen.
 */
export function verify({ root, full = false, strict = false, project = 'chromium' } = {}) {
  loadConfig(root);
  const resultados = [];
  const registrar = (name, status, detail = '') => {
    resultados.push({ name, status, detail });
    const marca = status === 0 ? 'OK  ' : 'FAIL';
    console.log(`[${marca}] ${name}${detail ? ` — ${detail}` : ''}`);
    return status === 0;
  };

  console.log('\n== 1. Mapa de migración ==');
  const org = organize({ root, apply: false });
  if (
    !registrar(
      'organize',
      org.ok ? 0 : 1,
      `${org.result.pendingMoves} por mover, ${org.result.pendingReview} por revisar`,
    )
  ) {
    if (strict) return { resultados, ok: false };
  }

  console.log('\n== 2. Contrato fuente→test ==');
  const map = validateSourceMap({ root });
  if (!registrar('source-map', map.ok ? 0 : 1, `${map.pending.length} cambios pendientes`)) {
    return { resultados, ok: false };
  }

  console.log('\n== 3. Auditoría de calidad ==');
  const aud = audit({ root, strict });
  if (
    !registrar(
      'audit',
      aud.ok ? 0 : 1,
      `CRITICAL=${aud.result.summary.CRITICAL ?? 0} HIGH=${aud.result.summary.HIGH ?? 0}`,
    )
  ) {
    return { resultados, ok: false };
  }

  console.log('\n== 4. Cobertura de casos de uso ==');
  const cov = coverage({ root, strict });
  registrar(
    'coverage',
    cov.ok ? 0 : 1,
    `prioritarios abiertos: ${cov.result.priorityGaps.length}`,
  );

  const pasos = [
    ['unit', 'npx', ['vitest', 'run', 'tests/unit/contracts', 'tests/unit/behavior']],
    ['tooling', process.execPath, ['tests/tooling/project-tools.test.mjs']],
    ['typecheck', 'npx', ['tsc', '--noEmit']],
    ['lint', 'npm', ['run', 'lint']],
    ['git-diff-check', 'git', ['diff', '--check']],
  ];

  if (full) {
    pasos.splice(1, 0, ['unit-files', 'npx', ['vitest', 'run', 'tests/unit/files']]);
    pasos.push(['e2e', 'npx', ['playwright', 'test', `--project=${project}`]]);
  }

  for (const [name, command, args] of pasos) {
    console.log(`\n==> ${name}: ${command} ${args.join(' ')}`);
    const r = run(command, args, { cwd: root });
    if (!registrar(name, r.status)) break;
  }

  const ok = resultados.every((r) => r.status === 0);
  console.log(`\n${ok ? 'VERIFY OK' : 'VERIFY FAIL'}`);
  console.log(JSON.stringify({ full, strict, project, resultados }, null, 2));
  return { resultados, ok };
}

if (esEntrada(import.meta.url)) {
  const { root, full, strict, project } = parseArgs();
  const { ok } = verify({ root, full, strict, project: project ?? 'chromium' });
  if (!ok) process.exitCode = 1;
}
