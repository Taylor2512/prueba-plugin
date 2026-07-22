#!/usr/bin/env node
import { parseArgs, hasFlag, readEnumArg, readStringArg, setExitCode } from "../lib/cli.js";
import { collectTopLevelFunctionNames, parseProgram } from "../lib/ast.js";
import { isSourceFile, readTextFile, walkFilesSync } from "../lib/files.js";

const args = parseArgs(process.argv.slice(2));
const root = readStringArg(args, "root", "src");
const mode = readEnumArg(args, "mode", ["all", "hooks"], "all");
const includeTests = hasFlag(args, "include-tests");
const strictParse = hasFlag(args, "strict-parse");
const parseErrors = [];
const names = new Map();

for (const file of walkFilesSync(root).filter((item) => isSourceFile(item, { includeTests }))) {
  const program = parseProgram(file, readTextFile(file), { errors: parseErrors });
  if (!program) continue;

  for (const symbol of collectTopLevelFunctionNames(program)) {
    if (mode === "hooks" && !/^use[A-Z0-9_]/.test(symbol.name)) continue;
    if (!names.has(symbol.name)) names.set(symbol.name, new Map());
    names.get(symbol.name).set(file, symbol.line);
  }
}

const duplicates = [...names.entries()]
  .filter(([, locations]) => locations.size > 1)
  .sort(([left], [right]) => left.localeCompare(right));
const label = mode === "hooks" ? "local hook" : "function/const";

console.log(`Duplicate ${label} names: ${duplicates.length}`);
for (const [name, locations] of duplicates) {
  const rows = [...locations.entries()].map(([file, line]) => `  - ${file}:${line}`);
  console.log(`${name}\n${rows.join("\n")}`);
}

if (parseErrors.length) {
  console.error(`Parse errors: ${parseErrors.length}`);
  for (const error of parseErrors) console.error(`  ${error.file}: ${error.message}`);
}

setExitCode(duplicates.length > 0 || (strictParse && parseErrors.length > 0));
