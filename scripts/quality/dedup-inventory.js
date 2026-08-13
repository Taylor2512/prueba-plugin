#!/usr/bin/env node
/**
 * Inventario reproducible de clones jscpd para la campaña de deduplicación.
 *
 * Lee un reporte JSON de jscpd, clasifica cada clon por universo y clúster,
 * lo asocia a la task card DEDUP-XXX correspondiente y emite:
 *   - <output>/jscpd-findings-<fecha>.csv
 *   - <output>/jscpd-baseline-summary-<fecha>.json
 *
 * Uso:
 *   node scripts/quality/dedup-inventory.js \
 *     --report reports/deduplication/baseline-run/jscpd-report.json \
 *     --output reports/deduplication \
 *     --label baseline
 */

import fs from "node:fs";
import process from "node:process";
import path from "node:path";
import { parseArgs, readStringArg } from "../lib/cli.js";

const args = parseArgs(process.argv.slice(2));

const reportPath = readStringArg(args, "report", "reports/deduplication/baseline-run/jscpd-report.json");
const outputDir = readStringArg(args, "output", "reports/deduplication");
const label = readStringArg(args, "label", "baseline");
const stamp = readStringArg(args, "date", new Date().toISOString().slice(0, 10));

/** Universos: separan lo que el equipo posee de lo que solo mide. */
const UNIVERSES = [
  { id: 'vendor', test: (f) => /(^|\/)(vendors?|node_modules)\//.test(f) || f.includes('sisad-pdfme/pdf-lib') },
  { id: 'generated', test: (f) => /(^|\/)(generated|dist|build)\//.test(f) },
  { id: 'tests', test: (f) => /\.(test|spec)\.[jt]sx?$/.test(f) || /(^|\/)(__tests__|tests|e2e)\//.test(f) },
  { id: 'docs', test: (f) => /\.(md|mdx)$/.test(f) },
  { id: 'tooling', test: (f) => f.startsWith('scripts/') || f.startsWith('server/') },
  { id: 'owned', test: () => true },
];

/**
 * Clústeres ordenados por especificidad. El primero que reconoce ambos
 * archivos (o el primero, si el segundo no encaja) define la tarea destino.
 */
const CLUSTERS = [
  // Iconos SVG residuales (aside, navbar, archivos).
  { id: 'icons-svg', task: 'DEDUP-016', test: (f) => /(^|\/)(icons?|Icons?|IconsResourse)(\/|\.)/.test(f) || /Icons?\.jsx$/.test(f) },

  // CSS de AG Grid: FlowExecution/TicketList va a su propia card, el resto a la receta base.
  { id: 'ag-grid-css-workflows', task: 'DEDUP-018', test: (f) => (/\.aggrid\.css$/.test(f) || /aggrid|ag-grid/i.test(f)) && /FlowExecution|Ticket/i.test(f) },
  { id: 'ag-grid-css-base', task: 'DEDUP-017', test: (f) => /\.aggrid\.css$/.test(f) || f.includes('ag-grid-layers') || (/\.css$/.test(f) && /aggrid|ag-grid/i.test(f)) },

  // Redux: la matriz de permisos se separa del lifecycle legacy y de externalForms.
  { id: 'redux-permissions', task: 'DEDUP-023', test: (f) => f.startsWith('redux/') && /Permis|Profile|Resource|Security|User/i.test(f) },
  { id: 'externalforms-slices', task: 'DEDUP-025', test: (f) => f.startsWith('modules/externalForms/') && /slice|store|persistence/i.test(f) },
  { id: 'redux-lifecycle', task: 'DEDUP-024', test: (f) => f.startsWith('redux/') },

  // Las tres variantes de TicketList son casi clones entre sí: el clúster mayor
  // del repositorio y sin card en el board de continuidad. Ver DEDUP-034.
  { id: 'ticket-list-variants', task: 'DEDUP-034', test: (f) => /TicketList(Customer|General)?\.jsx$/.test(f) },

  // Clon muerto de los plugins pdfme fuera de la frontera de la fachada. Ver DEDUP-035.
  { id: 'DigitalAgreement-plugins', task: 'DEDUP-035', test: (f) => f.startsWith('features/DigitalAgreement/') },

  // Duplicación interna concreta ya identificada en el board de continuidad.
  { id: 'ticketreport-metadataindexform', task: 'DEDUP-030', test: (f) => /TicketReport|MetadataIndexForm|TicketManagement/i.test(f) },

  // Workflows, desglosado por subdominio.
  { id: 'onlyoffice-contracts', task: 'DEDUP-027', test: (f) => /OnlyOffice/i.test(f) || f.startsWith('features/ContentWorkflows/Contracts/') },
  { id: 'emailtemplate-team', task: 'DEDUP-028', test: (f) => /EmailTemplate|TeamList|TeamManagement/i.test(f) },
  { id: 'dashboard-graph', task: 'DEDUP-029', test: (f) => /Dashboard/i.test(f) || f.startsWith('features/ContentWorkflows/FlowDesign/') },

  // Modales y diálogos.
  { id: 'error-dialogs', task: 'DEDUP-021', test: (f) => /DetailError/i.test(f) || /(Error|Errors)(Detail|Modal|Dialog|List)/.test(f) || /Modal(Error|Errors)/.test(f) },
  { id: 'filepreview-download-metadata', task: 'DEDUP-022', test: (f) => /FilePreview|Download|Descarga|Masive|Massive|Metadata/i.test(f) },
  { id: 'crud-modals', task: 'DEDUP-020', test: (f) => /Modal|Modales/.test(f) },

  // Shells de grids de gestión documental.
  { id: 'grid-shells', task: 'DEDUP-019', test: (f) => /Container(Cabinet|Group|Child|Folder)/i.test(f) || (/Grid|Table|List(\/|\.)/.test(f) && !f.startsWith('features/ContentWorkflows/')) },

  { id: 'auth-shell', task: 'DEDUP-026', test: (f) => /ResetPassword|UnlockMyUser/i.test(f) },
  { id: 'i18n', task: 'DEDUP-031', test: (f) => /(^|\/)(i18n|locales?|translations?|lang)(\/|\.)/.test(f) || /\b(es|en)\.(js|json)$/.test(f) },
  { id: 'css-primitives', task: 'DEDUP-032', test: (f) => /\.css$/.test(f) },
];

function classifyUniverse(file) {
  return UNIVERSES.find((u) => u.test(file)).id;
}

function classifyCluster(first, second) {
  for (const cluster of CLUSTERS) {
    if (cluster.test(first) && cluster.test(second)) return cluster;
  }
  for (const cluster of CLUSTERS) {
    if (cluster.test(first) || cluster.test(second)) return cluster;
  }
  return { id: 'residual', task: 'DEDUP-032' };
}

function decisionFor(cluster, sameFile, universe) {
  if (universe !== 'owned' && universe !== 'tooling') return 'exclusión justificada';
  if (sameFile) return 'helper local';
  switch (cluster.id) {
    case 'icons-svg':
      return 'catálogo canónico + reexport';
    case 'ag-grid-css-base':
    case 'ag-grid-css-workflows':
    case 'css-primitives':
      return 'capa CSS canónica';
    case 'redux-lifecycle':
    case 'externalforms-slices':
      return 'factory de lifecycle + caracterización';
    case 'redux-permissions':
      return 'matriz de permisos declarativa';
    case 'i18n':
      return 'fuente canónica';
    default:
      return 'composición sobre primitivas';
  }
}

/** R3 para lo que toca CSS de grid, estado compartido o el dominio workflows. */
const R3_CLUSTERS = new Set([
  'ag-grid-css-base',
  'ag-grid-css-workflows',
  'redux-permissions',
  'redux-lifecycle',
  'externalforms-slices',
  'onlyoffice-contracts',
  'emailtemplate-team',
  'dashboard-graph',
  'ticketreport-metadataindexform',
  'filepreview-download-metadata',
  'auth-shell',
  'ticket-list-variants',
  'DigitalAgreement-plugins',
]);

function riskFor(cluster, universe) {
  if (universe !== 'owned') return 'R1';
  return R3_CLUSTERS.has(cluster.id) ? 'R3' : 'R2';
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const rows = report.duplicates.map((dup, index) => {
  const first = dup.firstFile.name;
  const second = dup.secondFile.name;
  const sameFile = first === second;
  const universe = [classifyUniverse(first), classifyUniverse(second)]
    .sort((a, b) => UNIVERSES.findIndex((u) => u.id === a) - UNIVERSES.findIndex((u) => u.id === b))[0];
  const cluster = classifyCluster(first, second);
  return {
    id: `CLONE-${String(index + 1).padStart(4, '0')}`,
    format: dup.format,
    universe,
    cluster: cluster.id,
    task: cluster.task,
    scope: sameFile ? 'same-file' : 'cross-file',
    lines: dup.lines,
    tokens: dup.tokens,
    firstFile: first,
    firstStart: dup.firstFile.start,
    firstEnd: dup.firstFile.end,
    secondFile: second,
    secondStart: dup.secondFile.start,
    secondEnd: dup.secondFile.end,
    decision: decisionFor(cluster, sameFile, universe),
    risk: riskFor(cluster, universe),
  };
});

const HEADER = [
  'id', 'format', 'universe', 'cluster', 'task', 'scope', 'lines', 'tokens',
  'firstFile', 'firstStart', 'firstEnd', 'secondFile', 'secondStart', 'secondEnd',
  'decision', 'risk',
];

const csv = [HEADER.join(',')]
  .concat(rows.map((row) => HEADER.map((key) => {
    const value = String(row[key]);
    return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
  }).join(',')))
  .join('\n');

const byCluster = {};
for (const row of rows) {
  const entry = byCluster[row.cluster] || (byCluster[row.cluster] = { task: row.task, clones: 0, lines: 0, files: new Set() });
  entry.clones += 1;
  entry.lines += row.lines;
  entry.files.add(row.firstFile);
  entry.files.add(row.secondFile);
}

const byUniverse = {};
for (const row of rows) {
  byUniverse[row.universe] = (byUniverse[row.universe] || 0) + 1;
}

const summary = {
  label,
  date: stamp,
  report: reportPath,
  total: report.statistics.total,
  formats: Object.fromEntries(Object.entries(report.statistics.formats).map(([format, stats]) => [format, {
    clones: stats.clones,
    duplicatedLines: stats.duplicatedLines,
    lines: stats.lines,
    percentage: Number(stats.percentage.toFixed(4)),
    sources: stats.sources,
  }])),
  universes: byUniverse,
  scope: {
    'same-file': rows.filter((row) => row.scope === 'same-file').length,
    'cross-file': rows.filter((row) => row.scope === 'cross-file').length,
  },
  clusters: Object.fromEntries(Object.entries(byCluster)
    .sort((a, b) => b[1].lines - a[1].lines)
    .map(([id, entry]) => [id, {
      task: entry.task,
      clones: entry.clones,
      fragmentLines: entry.lines,
      files: entry.files.size,
    }])),
};

fs.mkdirSync(outputDir, { recursive: true });
const csvPath = path.join(outputDir, `jscpd-findings-${stamp}.csv`);
const summaryPath = path.join(outputDir, `jscpd-${label}-summary-${stamp}.json`);
fs.writeFileSync(csvPath, `${csv}\n`);
fs.writeFileSync(summaryPath, `${JSON.stringify(summary, null, 2)}\n`);

console.log(`Clones inventariados: ${rows.length}`);
console.log(`CSV:     ${csvPath}`);
console.log(`Summary: ${summaryPath}`);
console.table(summary.clusters);
