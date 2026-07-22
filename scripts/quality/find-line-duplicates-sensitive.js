#!/usr/bin/env node
import { parseArgs, readEnumArg, readNumberArg, readStringArg, setExitCode } from "../lib/cli.js";
import { addToArrayMap, uniqueBy } from "../lib/collections.js";
import { isSourceFile, readTextFile, walkFilesSync } from "../lib/files.js";

const args = parseArgs(process.argv.slice(2));
const root = readStringArg(args, "root", "src");
const minLines = readNumberArg(args, "min-lines", 8, { min: 2 });
const mode = readEnumArg(args, "mode", ["exact", "semantic"], "semantic");
const blocks = new Map();

for (const file of walkFilesSync(root).filter((item) => isSourceFile(item))) {
  const lines = readTextFile(file).split(/\r?\n/);
  for (let index = 0; index <= lines.length - minLines; index += 1) {
    const normalized = normalizeBlock(lines.slice(index, index + minLines), mode, minLines);
    if (!normalized) continue;
    addToArrayMap(blocks, normalized, { file, line: index + 1 });
  }
}

const duplicates = [...blocks.entries()]
  .map(([block, locations]) => ({
    block,
    locations: uniqueBy(locations, ({ file }) => file),
  }))
  .filter(({ locations }) => locations.length > 1)
  .sort((left, right) => right.locations.length - left.locations.length || left.block.localeCompare(right.block));

console.log(`Duplicate ${minLines}-line blocks (${mode}) under ${root}: ${duplicates.length}`);
for (const duplicate of duplicates) {
  console.log("\n---");
  for (const location of duplicate.locations) console.log(`${location.file}:${location.line}`);
  console.log(duplicate.block);
}

setExitCode(duplicates.length > 0);

function normalizeBlock(lines, selectedMode, requiredLines) {
  const normalized = lines
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !line.startsWith("//"))
    .map((line) => selectedMode === "semantic"
      ? line
          .replace(/(["'`])(?:\\.|(?!\1).)*\1/g, '"<str>"')
          .replace(/\b\d+(?:\.\d+)?\b/g, "<num>")
          .replace(/\s+/g, " ")
      : line.replace(/\s+/g, " "));

  if (normalized.length < requiredLines) return "";
  const meaningful = normalized.filter((line) => /\b(?!str\b)[A-Za-z_$][\w$]*\b|=>|\?|:|=/.test(line));
  return meaningful.length >= Math.ceil(requiredLines * 0.75) ? normalized.join("\n") : "";
}
