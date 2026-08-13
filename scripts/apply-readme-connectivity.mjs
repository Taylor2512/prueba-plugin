#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const repoRoot = path.resolve(process.argv[2] || process.cwd());
const dryRun = process.argv.includes("--dry-run");
const manifest = JSON.parse(
  fs.readFileSync(path.join(packageRoot, "README-PATCH-MANIFEST.json"), "utf8")
);

const START = "<!-- SISAD-AI-NAV:START -->";
const END = "<!-- SISAD-AI-NAV:END -->";

const normalize = (s) => s.replace(/\r\n/g, "\n").trimEnd() + "\n";

function mergeManagedSection(existing, fragment, title) {
  const managed = `${START}\n${fragment.trim()}\n${END}`;
  const start = existing.indexOf(START);
  const end = existing.indexOf(END);

  if (start >= 0 && end > start) {
    const before = existing.slice(0, start).trimEnd();
    const after = existing.slice(end + END.length).trimStart();
    return normalize(`${before}\n\n${managed}${after ? `\n\n${after}` : ""}`);
  }

  if (!existing.trim()) {
    return normalize(`${title}\n\n${managed}`);
  }

  return normalize(`${existing.trimEnd()}\n\n${managed}`);
}

let changed = 0;
let created = 0;

for (const item of manifest.targets) {
  const target = path.join(repoRoot, item.target);
  const fragmentPath = path.join(packageRoot, item.fragment);
  const fragment = fs.readFileSync(fragmentPath, "utf8");
  const exists = fs.existsSync(target);

  if (!exists && !item.create_if_missing) continue;

  const existing = exists ? fs.readFileSync(target, "utf8") : "";
  const next = mergeManagedSection(existing, fragment, item.title);

  if (normalize(existing) === next) {
    console.log(`UNCHANGED ${item.target}`);
    continue;
  }

  if (dryRun) {
    console.log(`${exists ? "WOULD_UPDATE" : "WOULD_CREATE"} ${item.target}`);
    continue;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, next, "utf8");
  if (exists) changed += 1;
  else created += 1;
  console.log(`${exists ? "UPDATED" : "CREATED"} ${item.target}`);
}

console.log(
  dryRun
    ? "Dry-run completed. No files changed."
    : `Done. Updated=${changed}, Created=${created}. No content outside SISAD-AI-NAV markers was removed.`
);
