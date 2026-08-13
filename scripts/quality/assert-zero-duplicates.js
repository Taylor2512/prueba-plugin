#!/usr/bin/env node
import fs from "node:fs";
import process from "node:process";
import path from "node:path";

function readArgument(name, fallback) {
  const prefix = `--${name}=`;
  const value = process.argv.find((argument) => argument.startsWith(prefix));
  return value ? value.slice(prefix.length) : fallback;
}

const reportPath = path.resolve(
  process.cwd(),
  readArgument("report", "reports/jscpd/diagnostic/jscpd-report.json"),
);

if (!fs.existsSync(reportPath)) {
  console.error(`[dedup-zero] No existe el reporte: ${reportPath}`);
  process.exit(2);
}

let report;
try {
  report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
} catch (error) {
  console.error(`[dedup-zero] Reporte JSON inválido: ${error.message}`);
  process.exit(2);
}

const total = report?.statistics?.total;
const clones = Number(total?.clones ?? report?.duplicates?.length ?? 0);
const duplicatedLines = Number(total?.duplicatedLines ?? 0);
const percentage = Number(total?.percentage ?? 0);

console.log(
  `[dedup-zero] clones=${clones} duplicatedLines=${duplicatedLines} percentage=${percentage.toFixed(4)}%`,
);

if (clones !== 0 || duplicatedLines !== 0 || percentage !== 0) {
  console.error(
    "[dedup-zero] Gate rechazado: el perfil estricto todavía contiene duplicidad.",
  );
  process.exit(1);
}

console.log("[dedup-zero] Gate aprobado: 0 clones y 0 líneas duplicadas.");
