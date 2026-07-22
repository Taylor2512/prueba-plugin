#!/usr/bin/env node
import { parseArgs, readNumberArg, readStringArg, setExitCode } from "../lib/cli.js";
import { collectLineCounts } from "../lib/files.js";

const args = parseArgs(process.argv.slice(2));
const root = readStringArg(args, "root", "src");
const maxLines = readNumberArg(args, "max-lines", 700, { min: 1 });
const offenders = collectLineCounts(root)
  .filter(({ lines }) => lines > maxLines)
  .sort((left, right) => right.lines - left.lines || left.file.localeCompare(right.file));

console.log(`Files over ${maxLines} lines under ${root}: ${offenders.length}`);
for (const offender of offenders) {
  console.log(`${offender.lines}\t${offender.file}`);
}

setExitCode(offenders.length > 0);
