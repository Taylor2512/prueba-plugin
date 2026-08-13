import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const required = [
  "AGENTS.md",
  ".ai/START.md",
  ".ai/ROUTER.md",
  ".ai/STATE-SOURCES.md",
  ".ai/brain/HOME.md",
  ".ai/brain/80-work/ACTIVE.md",
  ".ai/scrum/PRODUCT-BACKLOG.md",
  ".ai/scrum/RUNTIME-PLATFORM-LEDGER.md",
];

let failed = false;
for (const rel of required) {
  if (!fs.existsSync(path.join(root, rel))) {
    console.error(`missing: ${rel}`);
    failed = true;
  }
}

const forbiddenCurrentAuthorities = [
  ".ai/scrum/SPRINT-CURRENT.md",
  ".ai/scrum/CLAIMS.md",
  ".ai/memory/CURRENT.md",
  ".ai/memory/HANDOFF.md",
];

const stateSources = path.join(root, ".ai/STATE-SOURCES.md");
if (fs.existsSync(stateSources)) {
  const text = fs.readFileSync(stateSources, "utf8");
  for (const rel of forbiddenCurrentAuthorities) {
    const canonicalRow = new RegExp(`\\|[^\\n]*\\\`${rel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\\`[^\\n]*\\|`);
    if (canonicalRow.test(text) && !text.includes("Rutas históricas no canónicas")) {
      console.error(`stale authority in STATE-SOURCES: ${rel}`);
      failed = true;
    }
  }
}

const limits = {
  "AGENTS.md": 5000,
  "CLAUDE.md": 3000,
  "CODEX.md": 3000,
  ".github/copilot-instructions.md": 6000,
  ".ai/START.md": 5000,
  ".ai/STATE-SOURCES.md": 6000,
};

for (const [rel, max] of Object.entries(limits)) {
  const file = path.join(root, rel);
  if (fs.existsSync(file) && fs.statSync(file).size > max) {
    console.error(`too large: ${rel} > ${max} bytes`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
