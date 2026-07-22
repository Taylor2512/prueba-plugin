#!/usr/bin/env node
import path from "node:path";
import { parseArgs, readStringArg, setExitCode } from "../lib/cli.js";
import { addToSetMap } from "../lib/collections.js";
import { readTextFile, walkFilesSync } from "../lib/files.js";

const args = parseArgs(process.argv.slice(2));
const root = readStringArg(args, "root", "src");
const declarations = new Map();

for (const file of walkFilesSync(root).filter((item) => path.extname(item) === ".css")) {
  const source = stripCssComments(readTextFile(file));
  for (const match of source.matchAll(/([^{}]+)\{([^{}]+)\}/g)) {
    const selector = normalizeWhitespace(match[1]);
    const body = normalizeWhitespace(match[2]);
    if (!selector || !body || selector.startsWith("@")) continue;
    addToSetMap(declarations, `${selector} { ${body} }`, file);
  }
}

const duplicates = [...declarations.entries()]
  .filter(([, files]) => files.size > 1)
  .sort(([left], [right]) => left.localeCompare(right));

console.log(`Duplicate CSS declaration blocks across files: ${duplicates.length}`);
for (const [block, files] of duplicates) {
  console.log(`${block}\n${[...files].map((file) => `  - ${file}`).join("\n")}`);
}

setExitCode(duplicates.length > 0);

function stripCssComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, "");
}

function normalizeWhitespace(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}
