import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

export const toPosix = (value) => value.split(path.sep).join("/");

export function normalizeRelative(value) {
  return toPosix(value).replace(/^\.\//, "").replace(/\/+/g, "/");
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function sha256Buffer(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function sha256File(file) {
  return sha256Buffer(fs.readFileSync(file));
}

export function readText(file) {
  return fs.readFileSync(file, "utf8");
}

export function readTextSafe(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

export function writeText(file, text) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, text.endsWith("\n") ? text : `${text}\n`, "utf8");
}

export function copyRecursive(source, target) {
  const stat = fs.statSync(source);
  if (stat.isDirectory()) {
    ensureDir(target);
    for (const entry of fs.readdirSync(source)) {
      copyRecursive(path.join(source, entry), path.join(target, entry));
    }
    return;
  }
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

export function removeRecursive(target) {
  fs.rmSync(target, { recursive: true, force: true });
}

export function timestamp() {
  const d = new Date();
  const pad = (n) => `${n}`.padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
    "-",
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds()),
  ].join("");
}

export function parseArgs(argv) {
  const positional = [];
  const flags = new Map();

  for (let i = 0; i < argv.length; i += 1) {
    const value = argv[i];
    if (!value.startsWith("--")) {
      positional.push(value);
      continue;
    }

    const raw = value.slice(2);
    const eq = raw.indexOf("=");
    if (eq >= 0) {
      flags.set(raw.slice(0, eq), raw.slice(eq + 1));
      continue;
    }

    const next = argv[i + 1];
    if (next && !next.startsWith("--")) {
      flags.set(raw, next);
      i += 1;
    } else {
      flags.set(raw, true);
    }
  }

  return {
    positional,
    flags,
    has(name) {
      return flags.has(name);
    },
    get(name, fallback = null) {
      return flags.has(name) ? flags.get(name) : fallback;
    },
  };
}

export function isIgnored(abs, root, config) {
  const rel = normalizeRelative(path.relative(root, abs));
  const segments = rel.split("/").filter(Boolean);

  if (segments.some((segment) => config.paths.ignoredDirectoryNames.has(segment))) {
    return true;
  }

  return config.paths.generatedPrefixes.some(
    (prefix) => rel === prefix.slice(0, -1) || rel.startsWith(prefix),
  );
}

export function walkFiles(root, {
  roots = ["."],
  extensions = null,
  includeGenerated = false,
  config,
} = {}) {
  const result = [];
  const visited = new Set();

  function visit(abs) {
    if (!fs.existsSync(abs)) return;

    const real = fs.realpathSync.native ? fs.realpathSync.native(abs) : fs.realpathSync(abs);
    if (visited.has(real)) return;
    visited.add(real);

    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      if (!includeGenerated && isIgnored(abs, root, config)) return;
      for (const entry of fs.readdirSync(abs)) {
        visit(path.join(abs, entry));
      }
      return;
    }

    if (extensions && !extensions.includes(path.extname(abs).toLowerCase())) return;
    result.push(abs);
  }

  for (const rel of roots) {
    const abs = path.resolve(root, rel);
    visit(abs);
  }

  return [...new Set(result)].sort();
}

export function relative(root, abs) {
  return normalizeRelative(path.relative(root, abs));
}

export function isProtected(relativePath, config) {
  const rel = normalizeRelative(relativePath);
  return config.paths.protectedPaths.has(rel);
}

export function externalBackupRoot(repoRoot, suffix) {
  return path.join(
    path.dirname(repoRoot),
    `${path.basename(repoRoot)}.${suffix}-${timestamp()}`,
  );
}

export function backupPath(repoRoot, backupRoot, relativePath) {
  const source = path.join(repoRoot, relativePath);
  if (!fs.existsSync(source)) return;
  copyRecursive(source, path.join(backupRoot, relativePath));
}

export function atomicWrite(file, text) {
  ensureDir(path.dirname(file));
  const temp = `${file}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(temp, text, "utf8");
  fs.renameSync(temp, file);
}

export function readJson(file, fallback = null) {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
}

export function writeJson(file, value) {
  atomicWrite(file, `${JSON.stringify(value, null, 2)}\n`);
}
