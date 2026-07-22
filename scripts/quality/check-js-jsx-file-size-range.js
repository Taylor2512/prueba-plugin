#!/usr/bin/env node
import { parseArgs, readNumberArg, readStringArg, setExitCode } from "../lib/cli.js";
import { collectLineCounts } from "../lib/files.js";

const args = parseArgs(process.argv.slice(2));
const root = readStringArg(args, "root", "src");
const minLines = readNumberArg(args, "min-lines", 300, { min: 0 });
const maxLines = readNumberArg(args, "max-lines", 700, { min: minLines });
const rows = collectLineCounts(root).sort((left, right) => left.lines - right.lines);
const under = rows.filter(({ lines }) => lines < minLines);
const over = rows.filter(({ lines }) => lines > maxLines);

console.log(`JS/JSX/TS/TSX files under ${minLines} lines: ${under.length}`);
for (const row of under) console.log(`${row.lines}\t${row.file}`);

console.log(`JS/JSX/TS/TSX files over ${maxLines} lines: ${over.length}`);
for (const row of over) console.log(`${row.lines}\t${row.file}`);

setExitCode(over.length > 0);
