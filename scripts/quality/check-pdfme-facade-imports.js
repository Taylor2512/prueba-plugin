#!/usr/bin/env node
/**
 * Fitness function de la frontera PDFME.
 *
 * Impide que aparezcan importaciones nuevas a `@pdfme/*` o a `vendors/pdfme/**`
 * fuera de la capa de integración. Las violaciones preexistentes viven congeladas
 * en el baseline de `configs/pdfme-import-boundary.json`, de modo que el gate falla
 * ante cualquier import nuevo sin exigir el refactor previo.
 *
 * Uso:
 *   node scripts/quality/check-pdfme-facade-imports.js [--root=src]
 *                                                      [--config=configs/pdfme-import-boundary.json]
 *                                                      [--mode=error|warn]
 *                                                      [--json]
 *                                                      [--update-baseline]
 */

import fs from "node:fs";
import process from "node:process";
import path from "node:path";
import { parseArgs, readStringArg, readEnumArg, hasFlag, setExitCode } from "../lib/cli.js";
import { walkFilesSync, readTextFile, isSourceFile } from "../lib/files.js";

const args = parseArgs(process.argv.slice(2));
const configPath = readStringArg(args, "config", "configs/pdfme-import-boundary.json");
const emitJson = hasFlag(args, "json");
const updateBaseline = hasFlag(args, "update-baseline");

if (!fs.existsSync(configPath)) {
  console.error(`No existe la configuración ${configPath}.`);
  process.exit(2);
}

const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
const root = readStringArg(args, "root", config.root ?? "src");
const mode = readEnumArg(args, "mode", ["error", "warn"], config.mode ?? "error");

if (!fs.existsSync(root)) {
  console.error(`No existe la raíz ${root}.`);
  process.exit(2);
}

const vendorPackage = new RegExp(config.vendorPackagePattern);
const deepInternal = new RegExp(config.deepInternalPattern);
const vendorSegment = config.vendorPathSegment;

/**
 * Extrae los especificadores de módulo de un archivo.
 *
 * Cubre `import … from "x"`, `export … from "x"`, `import("x")` y `require("x")`.
 * Deliberadamente NO busca la subcadena suelta: `pdfmeVendorCapabilities.js` guarda
 * rutas de vendor como literales de documentación y no son importaciones.
 */
function extractSpecifiers(source) {
  const found = [];
  const patterns = [
    /(?:^|[\s;}])(?:import|export)\s[^;'"]*?from\s*["']([^"']+)["']/g,
    /(?:^|[\s;}])import\s*["']([^"']+)["']/g,
    /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g,
    /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g,
  ];
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const index = match.index + match[0].lastIndexOf(match[1]);
      found.push({ specifier: match[1], line: source.slice(0, index).split("\n").length });
    }
  }
  return found;
}

/** Normaliza a ruta POSIX relativa al repositorio, resolviendo relativos y el alias `@/`. */
function resolveSpecifier(specifier, fromFile) {
  if (specifier.startsWith(".")) {
    return path.relative(process.cwd(), path.resolve(path.dirname(fromFile), specifier)).split(path.sep).join("/");
  }
  if (specifier.startsWith("@/")) return `src/${specifier.slice(2)}`;
  return specifier;
}

/** Glob mínimo: solo necesita soportar prefijos terminados en `**`. */
function matchesGlob(file, glob) {
  if (glob.endsWith("/**")) return file.startsWith(glob.slice(0, -2));
  return file === glob;
}

const isAllowed = (file) => (config.allowedGlobs ?? []).some((glob) => matchesGlob(file, glob));

const allImports = [];
for (const absolute of walkFilesSync(root)) {
  const file = path.relative(process.cwd(), absolute).split(path.sep).join("/");
  if (!isSourceFile(file, { includeTests: true })) continue;

  for (const { specifier, line } of extractSpecifiers(readTextFile(absolute))) {
    const resolved = resolveSpecifier(specifier, absolute);
    const isVendor = vendorPackage.test(specifier) || resolved.includes(vendorSegment);
    if (!isVendor) continue;

    allImports.push({
      file,
      line,
      specifier,
      resolved,
      allowed: isAllowed(file),
      deepInternal: deepInternal.test(resolved),
    });
  }
}

const allowed = allImports.filter((entry) => entry.allowed);
const outside = allImports.filter((entry) => !entry.allowed);
const deepInternalInside = allowed.filter((entry) => entry.deepInternal);

const baselineFiles = new Set((config.baseline?.entries ?? []).map((entry) => entry.file));
const violations = outside.filter((entry) => !baselineFiles.has(entry.file));
const baselined = outside.filter((entry) => baselineFiles.has(entry.file));

if (updateBaseline) {
  const byFile = new Map();
  for (const entry of outside) byFile.set(entry.file, (byFile.get(entry.file) ?? 0) + 1);
  config.baseline = {
    ...config.baseline,
    date: new Date().toISOString().slice(0, 10),
    entries: [...byFile].map(([file, specifiers]) => ({
      file,
      specifiers,
      ...(config.baseline?.entries ?? []).find((entry) => entry.file === file),
    })),
  };
  fs.writeFileSync(configPath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`[pdfme-imports] baseline actualizado: ${byFile.size} archivos, ${outside.length} importaciones.`);
  process.exit(0);
}

if (emitJson) {
  console.log(JSON.stringify({
    total: allImports.length,
    allowed: allowed.length,
    baselined: baselined.length,
    deepInternal: deepInternalInside.length,
    violations,
  }, null, 2));
  setExitCode(mode === "error" && violations.length > 0);
} else {
  console.log(
    `[pdfme-imports] importaciones vendor: ${allImports.length} ` +
    `(dentro de la frontera ${allowed.length}, baseline ${baselined.length}, nuevas ${violations.length})`,
  );
  if (deepInternalInside.length > 0) {
    console.log(`[pdfme-imports] deep-internal dentro de la frontera: ${deepInternalInside.length} (informativo)`);
  }

  if (violations.length === 0) {
    console.log("[pdfme-imports] OK — ninguna importación vendor nueva fuera de la fachada.");
  } else {
    console.log(`[pdfme-imports] FALLO — ${violations.length} importación(es) vendor nuevas fuera de la fachada:`);
    for (const entry of violations) {
      console.log(`  ${entry.file}:${entry.line}  "${entry.specifier}"`);
    }
    console.log(`Frontera permitida: ${(config.allowedGlobs ?? []).join(", ")}`);
    console.log("Usa la fachada: createDesigner / createForm / createViewer / generatePdf.");
    setExitCode(mode === "error");
  }
}
