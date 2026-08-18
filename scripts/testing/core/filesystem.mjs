import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export const posix = (value) => value.split(path.sep).join('/');
export const rel = (root, file) => posix(path.relative(root, file));
export const ensureDir = (dir) => fs.mkdirSync(dir, { recursive: true });

export const walk = (dir, predicate = () => true) => {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) stack.push(full);
      else if (predicate(full)) out.push(full);
    }
  }
  return out.sort();
};

export const readJson = (file, fallback = null) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
};

export const writeJson = (file, value) => {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
};

export const writeText = (file, value) => {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, value, 'utf8');
};

export const sha256File = (file) =>
  crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');

/**
 * Config única de testing.
 *
 * Antes había dos: `config/test-suite.config.json` y
 * `config/tooling/test-quality.config.json`, cada una alimentando su propia
 * cadena de scripts con reglas parecidas pero no iguales.
 */
export const loadConfig = (root) => {
  const file = path.join(root, 'config/testing.config.json');
  const config = readJson(file);
  if (!config) throw new Error(`Falta ${posix(path.relative(root, file))}`);
  return config;
};

export const reportRoot = (root, config) => {
  const dir = path.join(root, config.reportRoot ?? 'reports/testing');
  ensureDir(dir);
  return dir;
};

/**
 * Parseo común de argumentos del CLI.
 *
 * El primer posicional que no empieza por `--` es el subcomando; el segundo,
 * el dominio opcional. La raíz se toma de `--root` o del cwd, para que
 * `npm test -- unit schemas` funcione sin pasar `.` a mano.
 */
export const parseArgs = (argv = process.argv.slice(2)) => {
  const positionals = argv.filter((x) => !x.startsWith('--'));
  const flags = argv.filter((x) => x.startsWith('--'));
  const flagValue = (name) => {
    const hit = flags.find((f) => f === `--${name}` || f.startsWith(`--${name}=`));
    if (!hit) return undefined;
    const [, value] = hit.split('=');
    return value ?? true;
  };
  return {
    positionals,
    flags,
    root: path.resolve(typeof flagValue('root') === 'string' ? flagValue('root') : '.'),
    apply: flags.includes('--apply'),
    full: flags.includes('--full'),
    strict: flags.includes('--strict'),
    project: typeof flagValue('project') === 'string' ? flagValue('project') : undefined,
    passthrough: flags.filter(
      (f) => !/^--(apply|full|strict|root)(=|$)/.test(f),
    ),
  };
};
