import path from "node:path";
import { runCli } from "./project-tools.mjs";

const root = process.argv[2] && !process.argv[2].startsWith("--")
  ? process.argv[2]
  : ".";

const argv = ["validate", root, ...["--check=names"]];

if (process.argv.includes("--apply")) argv.push("--apply");
const backupIndex = process.argv.indexOf("--backup");
if (backupIndex >= 0 && process.argv[backupIndex + 1]) {
  argv.push(`--backup=${path.resolve(process.argv[backupIndex + 1])}`);
}

const code = await runCli(argv);
process.exitCode = code;
