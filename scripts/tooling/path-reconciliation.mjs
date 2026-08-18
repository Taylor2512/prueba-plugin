import fs from "node:fs";
import path from "node:path";
import {
  atomicWrite,
  backupPath,
  ensureDir,
  externalBackupRoot,
  normalizeRelative,
  relative,
  removeRecursive,
  sha256File,
  walkFiles,
} from "./core.mjs";

const TEXT_EXTENSIONS = new Set([
  ".md", ".mdx", ".json", ".jsonl", ".yml", ".yaml", ".txt",
  ".mjs", ".cjs", ".js", ".jsx", ".ts", ".tsx",
]);

function loadAliases(root, config) {
  const rel = config.paths.aliasMap || "config/tooling/architecture-path-aliases.json";
  const file = path.resolve(root, rel);
  if (!fs.existsSync(file)) {
    return { file: rel, aliases: [] };
  }
  const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
  const aliases = Array.isArray(parsed.aliases) ? parsed.aliases : [];
  return {
    file: rel,
    aliases: aliases
      .filter((entry) => entry?.from && entry?.to && entry.from !== entry.to)
      .map((entry) => ({
        from: normalizeRelative(entry.from),
        to: normalizeRelative(entry.to),
      }))
      .sort((a, b) => b.from.length - a.from.length),
  };
}

function samePathContent(fromAbs, toAbs) {
  if (!fs.existsSync(fromAbs) || !fs.existsSync(toAbs)) return false;
  const a = fs.statSync(fromAbs);
  const b = fs.statSync(toAbs);
  if (a.isFile() && b.isFile()) return sha256File(fromAbs) === sha256File(toAbs);
  return false;
}

function planAliases(root, aliases) {
  const moves = [];
  const duplicates = [];
  const conflicts = [];
  const alreadyApplied = [];
  const aliasesOnly = [];

  for (const alias of aliases) {
    const fromAbs = path.join(root, alias.from);
    const toAbs = path.join(root, alias.to);
    const fromExists = fs.existsSync(fromAbs);
    const toExists = fs.existsSync(toAbs);

    if (!fromExists && toExists) {
      alreadyApplied.push(alias);
      continue;
    }
    if (!fromExists && !toExists) {
      aliasesOnly.push(alias);
      continue;
    }
    if (fromExists && !toExists) {
      moves.push(alias);
      continue;
    }

    const fromStat = fs.statSync(fromAbs);
    const toStat = fs.statSync(toAbs);
    if (fromStat.isFile() && toStat.isFile() && samePathContent(fromAbs, toAbs)) {
      duplicates.push(alias);
      continue;
    }

    conflicts.push({
      ...alias,
      reason: fromStat.isDirectory() || toStat.isDirectory()
        ? "both-paths-exist"
        : "canonical-target-differs",
    });
  }

  return { moves, duplicates, conflicts, alreadyApplied, aliasesOnly };
}

function relativeVariants(fromFileRel, targetRel) {
  const base = path.posix.dirname(fromFileRel);
  const rel = path.posix.relative(base, targetRel);
  const normalized = rel || path.posix.basename(targetRel);
  return new Set([
    normalized,
    normalized.startsWith(".") ? normalized : `./${normalized}`,
    targetRel,
    `/${targetRel}`,
  ]);
}

function replaceAllLiteral(text, needle, replacement) {
  if (!needle || needle === replacement || !text.includes(needle)) return text;
  return text.split(needle).join(replacement);
}

function rewriteTextForAliases(text, fileRel, aliases) {
  let next = text;

  for (const alias of aliases) {
    next = replaceAllLiteral(next, alias.from, alias.to);
    next = replaceAllLiteral(next, `/${alias.from}`, `/${alias.to}`);

    const oldVariants = [...relativeVariants(fileRel, alias.from)];
    const newVariants = [...relativeVariants(fileRel, alias.to)];
    // Match variant by whether it used "./" or root-like syntax.
    for (const oldValue of oldVariants) {
      let newValue = newVariants[0];
      if (oldValue.startsWith("./")) {
        newValue = newVariants.find((value) => value.startsWith("./")) || newValue;
      } else if (oldValue.startsWith("/")) {
        newValue = newVariants.find((value) => value.startsWith("/")) || newValue;
      } else if (!oldValue.includes("/") && alias.to.includes("/")) {
        // Keep normal relative representation for basename-only old links.
        newValue = path.posix.relative(path.posix.dirname(fileRel), alias.to);
      }
      next = replaceAllLiteral(next, oldValue, newValue);
    }
  }

  return next;
}

function textFiles(root, config) {
  const roots = [...new Set([
    ...config.paths.architectureRoots,
    ...config.paths.markdownRoots,
    "config",
  ])];
  return walkFiles(root, {
    roots,
    includeGenerated: true,
    config,
  }).filter((file) => TEXT_EXTENSIONS.has(path.extname(file).toLowerCase()));
}

function pruneEmpty(root, config) {
  const candidates = config.paths.architectureRoots
    .map((rel) => path.resolve(root, rel))
    .filter((abs) => fs.existsSync(abs) && fs.statSync(abs).isDirectory());

  const visit = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory()) visit(path.join(dir, entry.name));
    }
    if (dir !== root && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
  };

  for (const dir of candidates) visit(dir);
}

export function reconcileArchitecturePaths(root, config, {
  apply = false,
  backupRoot = null,
} = {}) {
  const loaded = loadAliases(root, config);
  const plan = planAliases(root, loaded.aliases);
  const backup = backupRoot || externalBackupRoot(
    root,
    config.import.externalBackupSuffix || "architecture-backup",
  );

  if (!apply) {
    return {
      aliasMap: loaded.file,
      aliases: loaded.aliases.length,
      ...plan,
      plannedBackup: backup,
      applied: [],
      rewritten: [],
    };
  }

  let backupCreated = false;
  const ensureBackup = () => {
    if (!backupCreated) {
      ensureDir(backup);
      backupCreated = true;
    }
  };

  const applied = [];

  // Safe moves only. Divergent conflicts are never deleted/overwritten.
  for (const item of plan.moves) {
    const fromAbs = path.join(root, item.from);
    const toAbs = path.join(root, item.to);
    if (!fs.existsSync(fromAbs) || fs.existsSync(toAbs)) continue;

    ensureBackup();
    backupPath(root, backup, item.from);
    ensureDir(path.dirname(toAbs));
    fs.renameSync(fromAbs, toAbs);
    applied.push({ action: "move", ...item });
  }

  for (const item of plan.duplicates) {
    const fromAbs = path.join(root, item.from);
    if (!fs.existsSync(fromAbs)) continue;
    ensureBackup();
    backupPath(root, backup, item.from);
    removeRecursive(fromAbs);
    applied.push({ action: "remove-identical-alias", ...item });
  }

  // Rewriting uses every alias, including already-applied ones, so stale docs are repaired.
  const rewritten = [];
  for (const file of textFiles(root, config)) {
    const rel = relative(root, file);
    const current = fs.readFileSync(file, "utf8");
    const next = rewriteTextForAliases(current, rel, loaded.aliases);
    if (next === current) continue;

    ensureBackup();
    backupPath(root, backup, rel);
    atomicWrite(file, next);
    rewritten.push(rel);
  }

  pruneEmpty(root, config);

  return {
    aliasMap: loaded.file,
    aliases: loaded.aliases.length,
    ...plan,
    backup: backupCreated ? backup : null,
    applied,
    rewritten,
  };
}
