#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const argv = process.argv.slice(2);
const command = argv.shift() || 'status';
const rootArg = argv[0] && !argv[0].startsWith('--') ? argv.shift() : '.';
const root = path.resolve(rootArg);
const dir = path.join(root, '.ai/ops/coordination');
const claimsFile = path.join(dir, 'claims.json');
const leasesFile = path.join(dir, 'leases.json');
const mutexDir = path.join(dir, '.mutex');

const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 ? argv[i + 1] : undefined;
};
const listFlag = (name) => {
  const i = argv.indexOf(`--${name}`);
  if (i < 0) return [];
  const out = [];
  for (let j = i + 1; j < argv.length && !argv[j].startsWith('--'); j += 1) out.push(argv[j]);
  return out;
};

const ensure = () => {
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(claimsFile)) fs.writeFileSync(claimsFile, '{}\n');
  if (!fs.existsSync(leasesFile)) fs.writeFileSync(leasesFile, '{}\n');
};

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8') || '{}');
const writeJson = (file, value) => {
  const tmp = `${file}.tmp-${process.pid}`;
  fs.writeFileSync(tmp, JSON.stringify(value, null, 2) + '\n');
  fs.renameSync(tmp, file);
};

const withMutex = (fn) => {
  ensure();
  let acquired = false;
  for (let i = 0; i < 100; i += 1) {
    try {
      fs.mkdirSync(mutexDir);
      acquired = true;
      break;
    } catch {
      const until = Date.now() + 20;
      while (Date.now() < until) {}
    }
  }
  if (!acquired) throw new Error('Could not acquire coordination mutex');
  try { return fn(); }
  finally { fs.rmSync(mutexDir, { recursive: true, force: true }); }
};

const normalizePath = (p) => path.posix.normalize(String(p).replaceAll('\\', '/')).replace(/^\.?\//, '');
const overlaps = (a, b) =>
  a === b ||
  a.startsWith(`${b}/`) ||
  b.startsWith(`${a}/`);

if (command === 'init') {
  ensure();
  console.log('COORDINATION_READY');
  process.exit(0);
}

if (command === 'status') {
  ensure();
  console.log(JSON.stringify({
    claims: readJson(claimsFile),
    leases: readJson(leasesFile),
  }, null, 2));
  process.exit(0);
}

if (command === 'claim') {
  const agent = flag('agent');
  const task = flag('task');
  const paths = listFlag('paths').map(normalizePath).filter(Boolean);
  const mode = flag('mode') || 'write';
  if (!agent || !task || !paths.length) {
    console.error('claim requires --agent --task --paths <...>');
    process.exit(2);
  }

  withMutex(() => {
    const claims = readJson(claimsFile);
    if (mode === 'write') {
      for (const [owner, claim] of Object.entries(claims)) {
        if (owner === agent || claim.mode !== 'write') continue;
        for (const p of paths) for (const q of claim.paths || []) {
          if (overlaps(p, q)) {
            console.error(`CLAIM_CONFLICT ${p} owned by ${owner}:${claim.task} (${q})`);
            process.exitCode = 3;
            return;
          }
        }
      }
      if (process.exitCode) return;
    }
    claims[agent] = {
      agent, task, mode, paths,
      startedAt: new Date().toISOString(),
    };
    writeJson(claimsFile, claims);
    console.log(`CLAIM_OK ${agent} ${task}`);
  });
  process.exit(process.exitCode || 0);
}

if (command === 'release') {
  const agent = flag('agent');
  if (!agent) {
    console.error('release requires --agent');
    process.exit(2);
  }
  withMutex(() => {
    const claims = readJson(claimsFile);
    delete claims[agent];
    writeJson(claimsFile, claims);
    console.log(`RELEASE_OK ${agent}`);
  });
  process.exit(0);
}

if (command === 'lease') {
  const agent = flag('agent');
  const name = flag('name');
  if (!agent || !['integrator', 'validation'].includes(name)) {
    console.error('lease requires --agent and --name integrator|validation');
    process.exit(2);
  }
  withMutex(() => {
    const leases = readJson(leasesFile);
    const current = leases[name];
    if (current && current.agent !== agent) {
      console.error(`LEASE_CONFLICT ${name} held by ${current.agent}`);
      process.exitCode = 3;
      return;
    }
    leases[name] = { agent, acquiredAt: new Date().toISOString() };
    writeJson(leasesFile, leases);
    console.log(`LEASE_OK ${name} ${agent}`);
  });
  process.exit(process.exitCode || 0);
}

if (command === 'unlease') {
  const agent = flag('agent');
  const name = flag('name');
  if (!agent || !name) {
    console.error('unlease requires --agent --name');
    process.exit(2);
  }
  withMutex(() => {
    const leases = readJson(leasesFile);
    if (leases[name]?.agent === agent) delete leases[name];
    writeJson(leasesFile, leases);
    console.log(`UNLEASE_OK ${name} ${agent}`);
  });
  process.exit(0);
}

console.error(`Unknown command: ${command}`);
process.exit(2);
