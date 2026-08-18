import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs, sha256File, copyRecursive } from "./tooling/core.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const args = parseArgs(process.argv.slice(2));
const repoRoot = path.resolve(args.positional[0] || process.cwd());
const source = path.join(packageRoot, "tests");
const target = path.join(repoRoot, "tests");
const apply = args.has("apply");
const newOnly = args.has("new-only");

const entries = [];
const conflicts = [];

const planTree = (src, rel = "") => {
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const nextRel = path.join(rel, entry.name);
    const to = path.join(target, nextRel);
    if (entry.isDirectory()) {
      planTree(from, nextRel);
      continue;
    }
    if (fs.existsSync(to)) {
      if (sha256File(from) === sha256File(to)) entries.push({ action: "identical", path: nextRel });
      else conflicts.push({ action: "conflict", path: nextRel });
      continue;
    }
    entries.push({ action: "create", path: nextRel });
  }
};

planTree(source);

if (conflicts.length > 0 && !newOnly) {
  console.error(JSON.stringify({ mode: apply ? "APPLY_BLOCKED" : "DRY_RUN", entries, conflicts }, null, 2));
  process.exitCode = 3;
} else if (apply) {
  for (const entry of entries.filter(({ action }) => action === "create")) {
    copyRecursive(path.join(source, entry.path), path.join(target, entry.path));
    console.log(`ADD ${path.relative(repoRoot, path.join(target, entry.path))}`);
  }
}

console.log(JSON.stringify({ mode: apply ? "APPLY" : "DRY_RUN", newOnly, entries, conflicts }, null, 2));
