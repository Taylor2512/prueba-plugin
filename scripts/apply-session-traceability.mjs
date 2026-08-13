#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const repoRoot = path.resolve(process.argv[2] || process.cwd());
const dry = process.argv.includes("--dry-run");
const manifest = JSON.parse(fs.readFileSync(path.join(packageRoot,"SESSION-PATCH-MANIFEST.json"),"utf8"));
const START = "<!-- SISAD-AI-SESSION-TRACE:START -->";
const END = "<!-- SISAD-AI-SESSION-TRACE:END -->";

function normalize(s){ return s.replace(/\r\n/g,"\n").trimEnd()+"\n"; }
function merge(existing, fragment){
  const managed = `${START}\n${fragment.trim()}\n${END}`;
  const a = existing.indexOf(START), b = existing.indexOf(END);
  if (a >= 0 && b > a) {
    const before = existing.slice(0,a).trimEnd();
    const after = existing.slice(b+END.length).trimStart();
    return normalize(`${before}\n\n${managed}${after?`\n\n${after}`:""}`);
  }
  return normalize(existing.trim() ? `${existing.trimEnd()}\n\n${managed}` : managed);
}

for (const rel of manifest.payload_files) {
  const src = path.join(packageRoot,"payload",rel);
  const dst = path.join(repoRoot,rel);
  if (fs.existsSync(dst)) {
    // Do not overwrite an existing real architecture file; payload additions are new by design.
    const same = fs.readFileSync(dst,"utf8") === fs.readFileSync(src,"utf8");
    console.log(same ? `UNCHANGED ${rel}` : `SKIP_EXISTS ${rel}`);
    continue;
  }
  console.log(`${dry?"WOULD_CREATE":"CREATE"} ${rel}`);
  if (!dry) {
    fs.mkdirSync(path.dirname(dst),{recursive:true});
    fs.copyFileSync(src,dst);
  }
}

for (const item of manifest.fragments) {
  const dst = path.join(repoRoot,item.target);
  const fragment = fs.readFileSync(path.join(packageRoot,item.fragment),"utf8");
  const existing = fs.existsSync(dst) ? fs.readFileSync(dst,"utf8") : "";
  const next = merge(existing,fragment);
  if (normalize(existing) === next) {
    console.log(`UNCHANGED ${item.target}`);
    continue;
  }
  console.log(`${dry?"WOULD_MERGE":"MERGE"} ${item.target}`);
  if (!dry) {
    fs.mkdirSync(path.dirname(dst),{recursive:true});
    fs.writeFileSync(dst,next,"utf8");
  }
}
console.log(dry ? "Dry-run complete." : "Session traceability applied without overwriting existing payload files.");
