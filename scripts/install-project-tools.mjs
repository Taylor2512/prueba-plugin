#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  backupPath,
  ensureDir,
  externalBackupRoot,
  parseArgs,
  readJson,
  sha256File,
  writeJson,
} from "./tooling/core.mjs";

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(args.positional[0] || ".");
const apply = args.has("apply");
const conflictPolicy = args.get("conflict", "keep-target");
if (!["keep-target", "prefer-source"].includes(conflictPolicy)) {
  throw new Error("--conflict must be keep-target or prefer-source.");
}
const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const configModule = await import(
  new URL("../config/tooling/project-tools.config.mjs", import.meta.url)
);
const config = configModule.default;

const payload = [
  "config/tooling/project-tools.config.mjs",
  "scripts/project-tools.mjs",
  "scripts/tooling/core.mjs",
  "scripts/tooling/markdown.mjs",
  "scripts/tooling/architecture.mjs",
  "scripts/tooling/importer.mjs",
  "docs/tooling/README.md",
  "docs/tooling/COMMANDS.md",
  "docs/tooling/ARCHITECTURE-IMPORT.md",
  "docs/tooling/MARKDOWN-SANITIZATION.md",
  ".ai/brain/20-contracts/operations/DOCUMENTATION-NAMING.md",
  ".ai/brain/30-decisions/ADR-TOOLING-CENTRALIZATION.md",
  ".ai/brain/50-guides/PROJECT-TOOLS.md",
  ".ai/brain/70-memory/topics/tooling-architecture.md",
  ".ai/prompts/TOOLING-ARCHITECTURE-START.md",
  "tests/tooling/project-tools.test.mjs",
  "scripts/normalize-documentation.mjs",
  "scripts/build-markdown-topology.mjs",
  "scripts/apply-markdown-topology.mjs",
  "scripts/validate-documentation-names.mjs",
  "scripts/validate-markdown-topology.mjs",
  "scripts/cleanup-packaging-residue.mjs",
  "tools/ai-quality/build-knowledge-index.mjs",
  "tools/ai-quality/validate-knowledge-index.mjs",
  "tools/ai-quality/check-markdown-duplicates.mjs",
];

const backup = externalBackupRoot(root, "tooling-backup");
const changes = [];
const conflicts = [];
const createFiles = [];
const replaceFiles = [];

for (const rel of payload) {
  const source = path.join(packageRoot, rel);
  const target = path.join(root, rel);
  if (!fs.existsSync(source)) throw new Error(`Package file missing: ${rel}`);

  const exists = fs.existsSync(target);
  if (!exists) {
    changes.push({ action: "create", path: rel });
  } else if (sha256File(source) === sha256File(target)) {
    changes.push({ action: "identical", path: rel });
  } else {
    const conflict = { action: "conflict", path: rel };
    conflicts.push(conflict);
    changes.push(conflict);
  }

  if (!apply) continue;

  if (!exists) {
    createFiles.push({ source, target });
  } else if (conflictPolicy === "prefer-source" && sha256File(source) !== sha256File(target)) {
    replaceFiles.push({ source, target, rel });
  }
}

const payloadCanApply = conflicts.length === 0 || conflictPolicy === "prefer-source";
const packageJson = path.join(root, "package.json");
if (fs.existsSync(packageJson)) {
  const pkg = readJson(packageJson);
  if (!pkg) throw new Error("Invalid package.json.");

  const next = structuredClone(pkg);
  next.scripts = next.scripts || {};
  const scriptConflicts = Object.entries(config.packageScripts).filter(
    ([name, value]) => next.scripts[name] !== undefined && next.scripts[name] !== value,
  );
  if (scriptConflicts.length > 0) {
    const conflict = { action: "package-script-conflict", path: "package.json", scripts: scriptConflicts.map(([name]) => name) };
    conflicts.push(conflict);
    changes.push(conflict);
  }

  for (const [name, value] of Object.entries(config.packageScripts)) {
    if (next.scripts[name] === undefined || conflictPolicy === "prefer-source") next.scripts[name] = value;
  }

  if (JSON.stringify(next) !== JSON.stringify(pkg)) {
    changes.push({ action: "merge-package-scripts", path: "package.json" });
    if (apply && payloadCanApply && (scriptConflicts.length === 0 || conflictPolicy === "prefer-source")) {
      ensureDir(backup);
      backupPath(root, backup, "package.json");
      writeJson(packageJson, next);
    }
  }
}

const canApply = apply && payloadCanApply && (conflicts.length === 0 || conflictPolicy === "prefer-source");
if (canApply) {
  for (const { source, target } of createFiles) {
    ensureDir(path.dirname(target));
    fs.copyFileSync(source, target);
  }
  for (const { source, target, rel } of replaceFiles) {
    ensureDir(backup);
    backupPath(root, backup, rel);
    ensureDir(path.dirname(target));
    fs.copyFileSync(source, target);
  }
}

console.log(JSON.stringify({
  mode: apply ? "APPLY" : "DRY-RUN",
  root,
  backup: apply ? backup : null,
  changes,
  conflicts,
}, null, 2));

if (conflicts.length > 0 && conflictPolicy === "keep-target") process.exitCode = 3;

if (!apply) {
  console.log("\nDry-run only. Re-run with --apply after reviewing the plan.");
}
