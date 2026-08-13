#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const repoRoot = path.resolve(process.argv[2] || process.cwd());
const manifest = JSON.parse(
  fs.readFileSync(path.join(packageRoot, "README-PATCH-MANIFEST.json"), "utf8")
);

const linkRe = /\[[^\]]+\]\(([^)]+)\)/g;
const failures = [];

for (const item of manifest.targets) {
  const target = path.join(repoRoot, item.target);
  if (!fs.existsSync(target)) continue;

  const text = fs.readFileSync(target, "utf8");
  let match;
  while ((match = linkRe.exec(text))) {
    const href = match[1].trim();
    if (
      !href ||
      href.startsWith("http://") ||
      href.startsWith("https://") ||
      href.startsWith("#") ||
      href.startsWith("mailto:")
    ) continue;

    const clean = href.split("#")[0].split("?")[0];
    if (!clean) continue;

    const resolved = path.resolve(path.dirname(target), clean);
    if (!fs.existsSync(resolved)) {
      failures.push({
        file: item.target,
        href,
        expected: path.relative(repoRoot, resolved),
      });
    }
  }
}

if (failures.length) {
  console.error("Broken local links:");
  for (const f of failures) {
    console.error(`- ${f.file}: ${f.href} -> ${f.expected}`);
  }
  process.exitCode = 1;
} else {
  console.log("README connectivity links: PASS");
}
