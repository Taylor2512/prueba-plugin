import path from 'node:path';
import { spawnSync, execFileSync } from 'node:child_process';
import { posix, readJson } from './filesystem.mjs';

export const run = (command, args, { cwd, capture = false, env = {} } = {}) => {
  const result = spawnSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
    env: { ...process.env, ...env },
  });
  return {
    command: [command, ...args].join(' '),
    status: result.status ?? 1,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
};

/** Rutas con cambios sin commitear, incluyendo el destino de los renombrados. */
export const dirtyPaths = (root) => {
  try {
    const raw = execFileSync('git', ['status', '--porcelain=v1', '-z'], { cwd: root });
    const chunks = raw.toString('utf8').split('\0').filter(Boolean);
    const paths = new Set();
    for (let i = 0; i < chunks.length; i += 1) {
      const item = chunks[i];
      if (item.length < 4) continue;
      const status = item.slice(0, 2);
      paths.add(posix(item.slice(3)));
      if ((status.includes('R') || status.includes('C')) && chunks[i + 1]) {
        paths.add(posix(chunks[i + 1]));
        i += 1;
      }
    }
    return paths;
  } catch {
    return new Set();
  }
};

const collectClaims = (node, out = []) => {
  if (Array.isArray(node)) {
    for (const item of node) collectClaims(item, out);
    return out;
  }
  if (!node || typeof node !== 'object') return out;
  const mode = String(node.mode ?? '').toLowerCase();
  if ((mode === '' || mode.includes('write')) && Array.isArray(node.paths)) {
    for (const p of node.paths) if (typeof p === 'string') out.push(posix(p));
  }
  for (const child of Object.values(node)) collectClaims(child, out);
  return out;
};

/** Rutas reclamadas por otro agente en el mismo worktree. */
export const claimedPaths = (root, claimsFile = '.ai/ops/coordination/claims.json') =>
  new Set(collectClaims(readJson(path.join(root, claimsFile), {})));

export const conflicts = (candidate, set) => {
  const value = posix(candidate).replace(/\/+$/, '');
  for (const entry of set) {
    const other = posix(entry).replace(/\/+$/, '');
    if (value === other || value.startsWith(`${other}/`) || other.startsWith(`${value}/`)) return true;
  }
  return false;
};

/**
 * Cortafuegos antes de escribir: nunca se toca un archivo que otro agente
 * tenga reclamado o con cambios sin commitear en este mismo worktree.
 */
export const assertSafeTargets = (root, targets, claimsFile) => {
  const dirty = dirtyPaths(root);
  const claims = claimedPaths(root, claimsFile);
  const blocked = [];
  for (const target of targets) {
    if (conflicts(target, dirty)) blocked.push(`DIRTY: ${target}`);
    if (conflicts(target, claims)) blocked.push(`CLAIMED: ${target}`);
  }
  if (blocked.length) throw new Error(`UNSAFE_TARGETS\n${blocked.join('\n')}`);
};
