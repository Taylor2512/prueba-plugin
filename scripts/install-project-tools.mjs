#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import {
  backupPath,
  copyRecursive,
  ensureDir,
  externalBackupRoot,
  parseArgs,
  readJson,
  writeJson,
} from "./tooling/core.mjs";

const args = parseArgs(process.argv.slice(2));
const root = path.resolve(args.positional[0] || ".");
const apply = args.has("apply");
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
  ".ai/brain/20-contracts/DOCUMENTATION-NAMING.md",
  ".ai/brain/30-decisions/ADR-TOOLING-CENTRALIZATION.md",
  ".ai/brain/50-guides/PROJECT-TOOLS.md",
  ".ai/brain/70-memory/topics/tooling-architecture.md",
  ".ai/plans/PLAN_TOOLING_ARCHITECTURE_CLEANUP.md",
  ".ai/prompts/TOOLING-ARCHITECTURE-START.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-BASELINE.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-CENTRAL-CONFIG.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-MARKDOWN-ENGINE.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-STABLE-NAMES.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-IMPORTER.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-AI-DEDUP.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-COMPATIBILITY.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-MANUALS.md",
  ".ai/scrum/task-cards/tooling-architecture/TOOL-CLOSEOUT.md",
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

for (const rel of payload) {
  const source = path.join(packageRoot, rel);
  const target = path.join(root, rel);
  if (!fs.existsSync(source)) throw new Error(`Package file missing: ${rel}`);

  const exists = fs.existsSync(target);
  changes.push({ action: exists ? "replace" : "create", path: rel });

  if (!apply) continue;

  if (exists) {
    ensureDir(backup);
    backupPath(root, backup, rel);
  }
  ensureDir(path.dirname(target));
  fs.copyFileSync(source, target);
}

const packageJson = path.join(root, "package.json");
if (fs.existsSync(packageJson)) {
  const pkg = readJson(packageJson);
  if (!pkg) throw new Error("Invalid package.json.");

  const next = structuredClone(pkg);
  next.scripts = next.scripts || {};
  Object.assign(next.scripts, config.packageScripts);

  changes.push({ action: "merge-package-scripts", path: "package.json" });
  if (apply) {
    ensureDir(backup);
    backupPath(root, backup, "package.json");
    writeJson(packageJson, next);
  }
}

console.log(JSON.stringify({
  mode: apply ? "APPLY" : "DRY-RUN",
  root,
  backup: apply ? backup : null,
  changes,
}, null, 2));

if (!apply) {
  console.log("\nDry-run only. Re-run with --apply after reviewing the plan.");
}
