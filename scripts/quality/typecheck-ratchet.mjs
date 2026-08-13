#!/usr/bin/env node
/**
 * Ratchet de tipos: separa los errores de TypeScript del host de los del fork.
 *
 * `tsc` no puede aislar el fork con `exclude`: el host importa
 * `@sisad-pdfme/*`, así que los archivos del fork entran al grafo y sus errores
 * se reportan igual. Este script ejecuta un único `tsc --noEmit`, clasifica cada
 * error por zona y aplica dos políticas distintas:
 *
 *   host  (todo lo que NO es src/components/sisad-pdfme) → debe quedar en 0.
 *   fork  (src/components/sisad-pdfme)                   → deuda con umbral.
 *
 * El umbral del fork vive en `configs/typecheck-threshold.json` y solo puede
 * bajar. Reducirlo de verdad exige una task-card TASK-PDFME-*, porque
 * `src/components/sisad-pdfme/**` no se edita en tareas de host (CLAUDE.md).
 *
 * Uso:
 *   node scripts/quality/typecheck-ratchet.mjs [--project=tsconfig.json]
 *                                             [--threshold-file=configs/typecheck-threshold.json]
 *                                             [--update]
 *                                             [--verbose]
 */

import fs from "node:fs";
import process from "node:process";
import { spawnSync } from "node:child_process";
import { parseArgs, readStringArg, hasFlag } from "../lib/cli.js";

const FORK_PREFIX = "src/components/sisad-pdfme/";

/** `path/file.ts(12,3): error TS2322: ...` */
const ERROR_LINE = /^(?<file>[^(]+)\((?<line>\d+),(?<column>\d+)\): error (?<code>TS\d+): (?<message>.*)$/;

const args = parseArgs(process.argv.slice(2));
const project = readStringArg(args, "project", "tsconfig.json");
const thresholdPath = readStringArg(args, "threshold-file", "configs/typecheck-threshold.json");
const verbose = hasFlag(args, "verbose");
const update = hasFlag(args, "update");

const result = spawnSync("npx", ["tsc", "--noEmit", "-p", project], {
  encoding: "utf8",
  maxBuffer: 64 * 1024 * 1024,
});

if (result.error) {
  console.error(`No se pudo ejecutar tsc: ${result.error.message}`);
  process.exit(1);
}

const output = `${result.stdout ?? ""}${result.stderr ?? ""}`;
const normalize = (file) => file.replace(/\\/g, "/").replace(/^\.\//, "");

const host = [];
const fork = [];
const unparsed = [];

for (const rawLine of output.split("\n")) {
  const line = rawLine.trimEnd();
  if (!line) continue;

  const match = ERROR_LINE.exec(line);

  if (!match) {
    // Errores globales sin archivo (p. ej. TS2688 "Cannot find type definition
    // file") sí cuentan: rompen la configuración, no un archivo del fork.
    if (/^error TS\d+:/.test(line)) unparsed.push(line);
    continue;
  }

  const file = normalize(match.groups.file);
  const entry = { file, line: match.groups.line, code: match.groups.code, message: match.groups.message };

  if (file.startsWith(FORK_PREFIX)) fork.push(entry);
  else host.push(entry);
}

const hostCount = host.length + unparsed.length;
const forkCount = fork.length;

const config = fs.existsSync(thresholdPath)
  ? JSON.parse(fs.readFileSync(thresholdPath, "utf8"))
  : { forkErrors: forkCount };

const limit = Number(config.forkErrors ?? forkCount);

console.log(`Errores TS host (bloqueante): ${hostCount}`);
console.log(`Errores TS fork sisad-pdfme:  ${forkCount} (umbral ${limit})`);

if (verbose || hostCount > 0) {
  for (const line of unparsed) console.error(`  ${line}`);
  for (const entry of host) {
    console.error(`  ${entry.file}:${entry.line} ${entry.code}: ${entry.message}`);
  }
}

if (verbose) {
  const byCode = fork.reduce((acc, entry) => {
    acc[entry.code] = (acc[entry.code] ?? 0) + 1;
    return acc;
  }, {});

  console.log("Deuda del fork por código:");
  for (const [code, count] of Object.entries(byCode).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(count).padStart(4)} ${code}`);
  }
}

if (update) {
  fs.writeFileSync(thresholdPath, `${JSON.stringify({ ...config, forkErrors: forkCount }, null, 2)}\n`);
  console.log(`Umbral actualizado a ${forkCount} en ${thresholdPath}.`);
  process.exit(hostCount > 0 ? 1 : 0);
}

if (hostCount > 0) {
  console.error("\nFALLA: hay errores de tipos fuera del fork. Corrígelos antes de mergear.");
  process.exit(1);
}

if (forkCount > limit) {
  console.error(
    `\nFALLA: la deuda de tipos del fork subió de ${limit} a ${forkCount}.` +
      " Revisa el cambio o justifícalo con una task-card TASK-PDFME-*."
  );
  process.exit(1);
}

if (forkCount < limit) {
  console.log(
    `\nLa deuda del fork bajó a ${forkCount}. Fija el nuevo umbral con:` +
      " npm run typecheck:update"
  );
}

console.log("\nOK: sin errores de tipos en el host y deuda del fork dentro del umbral.");
