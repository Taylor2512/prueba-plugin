#!/usr/bin/env node
/**
 * Ratchet de duplicación: impide que el porcentaje owned empeore.
 *
 * Compara el reporte jscpd recién generado contra el umbral vigente en
 * `configs/dedup-threshold.json`. Falla si el porcentaje lo supera y sugiere
 * el siguiente umbral cuando el margen ya es suficiente.
 *
 * Uso:
 *   node scripts/quality/dedup-ratchet.js [--report=reports/jscpd/jscpd-report.json]
 *                                         [--threshold-file=configs/dedup-threshold.json]
 *                                         [--update]
 */

import fs from "node:fs";
import process from "node:process";
import { parseArgs, readStringArg, hasFlag, setExitCode } from "../lib/cli.js";

const args = parseArgs(process.argv.slice(2));
const reportPath = readStringArg(args, "report", "reports/jscpd/jscpd-report.json");
const thresholdPath = readStringArg(args, "threshold-file", "configs/dedup-threshold.json");

if (!fs.existsSync(reportPath)) {
  console.error(`No existe el reporte ${reportPath}. Ejecuta primero npm run quality -- duplicates:owned.`);
  process.exit(1);
}

/** Umbral inmediatamente superior al valor medido, con un colchón de una centésima. */
function nextThreshold(percentage) {
  return Number((Math.ceil(percentage * 100) / 100 + 0.01).toFixed(2));
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const config = JSON.parse(fs.readFileSync(thresholdPath, "utf8"));

const { percentage, clones, duplicatedLines } = report.statistics.total;
const current = Number(percentage.toFixed(4));
const limit = config.threshold;

console.log(`Duplicación owned: ${current} % (${clones} clones, ${duplicatedLines} líneas)`);
console.log(`Umbral vigente:    ${limit} %`);
console.log(`Baseline campaña:  ${config.baseline.percentage} % (${config.baseline.clones} clones)`);

if (hasFlag(args, "update")) {
  const next = nextThreshold(current);
  if (next < limit) {
    config.threshold = next;
    config.history = [...(config.history || []), { date: new Date().toISOString().slice(0, 10), from: limit, to: next, percentage: current }];
    fs.writeFileSync(thresholdPath, `${JSON.stringify(config, null, 2)}\n`);
    console.log(`Umbral ajustado: ${limit} % -> ${next} %`);
  } else {
    console.log("Sin margen para ajustar el umbral todavía.");
  }
  process.exit(0);
}

if (current > limit) {
  console.error(`FALLO: la duplicación subió por encima del umbral (${current} % > ${limit} %).`);
  setExitCode(true);
  process.exit(1);
}

const next = nextThreshold(current);
if (next < limit) {
  console.log(`Listo para apretar el ratchet: ${limit} % -> ${next} % (npm run quality -- duplicates:ratchet:update).`);
}
