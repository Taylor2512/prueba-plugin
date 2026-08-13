#!/usr/bin/env node
/**
 * Detecta componentes de icono SVG con cuerpo idéntico declarados en más de un archivo.
 *
 * Agrupa por hash semántico del JSX (whitespace y comillas normalizados), de modo que
 * dos iconos con el mismo `viewBox`, paths y atributos caen en el mismo grupo aunque
 * difieran en indentación o en el nombre del componente.
 *
 * Uso:
 *   node scripts/quality/find-duplicate-icons.js [--root=src] [--max-groups=0]
 *   node scripts/quality/find-duplicate-icons.js --json
 */

import crypto from "node:crypto";
import path from "node:path";
import { parseArgs, readStringArg, readNumberArg, hasFlag, setExitCode } from "../lib/cli.js";
import { readTextFile, walkFilesSync } from "../lib/files.js";

const args = parseArgs(process.argv.slice(2));
const root = readStringArg(args, "root", "src");
const maxGroups = readNumberArg(args, "max-groups", 0, { min: 0 });
const asJson = hasFlag(args, "json");

const ICON_FILE = /(^|\/)(icons?|Icons?)\/index\.jsx$|Icons?\.jsx$|icons?\.jsx$/;
const EXPORTED_COMPONENT = /export\s+const\s+([A-Z][A-Za-z0-9_]*)\s*=\s*\(([^)]*)\)\s*=>\s*\{/g;

/** Normaliza el cuerpo para comparar geometría, no formato. */
function fingerprint(body) {
  const normalized = body
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/["']/g, '"')
    .replace(/\s+/g, " ")
    .trim();
  return crypto.createHash("sha1").update(normalized).digest("hex");
}

/** Extrae el cuerpo de la función desde la llave de apertura hasta su cierre balanceado. */
function readBlock(source, openBraceIndex) {
  let depth = 0;
  for (let index = openBraceIndex; index < source.length; index += 1) {
    const char = source[index];
    if (char === "{") depth += 1;
    else if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(openBraceIndex, index + 1);
    }
  }
  return null;
}

const groups = new Map();

for (const file of walkFilesSync(root)) {
  if (path.extname(file) !== ".jsx" || !ICON_FILE.test(file)) continue;

  const source = readTextFile(file);
  if (!source.includes("<svg")) continue;

  EXPORTED_COMPONENT.lastIndex = 0;
  let match = EXPORTED_COMPONENT.exec(source);
  while (match !== null) {
    const body = readBlock(source, source.indexOf("{", match.index + match[0].length - 1));
    if (body && body.includes("<svg")) {
      const key = fingerprint(body);
      const entry = groups.get(key) || { occurrences: [], lines: body.split("\n").length };
      entry.occurrences.push({ file, name: match[1] });
      groups.set(key, entry);
    }
    match = EXPORTED_COMPONENT.exec(source);
  }
}

const duplicated = [...groups.entries()]
  .map(([hash, entry]) => ({ hash, ...entry, files: new Set(entry.occurrences.map((item) => item.file)) }))
  .filter((entry) => entry.files.size > 1)
  .sort((a, b) => b.lines * b.occurrences.length - a.lines * a.occurrences.length);

if (asJson) {
  console.log(JSON.stringify(duplicated.map((entry) => ({
    hash: entry.hash.slice(0, 8),
    lines: entry.lines,
    occurrences: entry.occurrences,
  })), null, 2));
} else {
  for (const entry of duplicated) {
    console.log(`\n${entry.hash.slice(0, 8)} — ${entry.lines} líneas × ${entry.occurrences.length} copias`);
    for (const { file, name } of entry.occurrences) console.log(`  ${name} — ${file}`);
  }
  console.log(`\nGrupos de iconos duplicados entre archivos: ${duplicated.length}`);
  console.log(`Copias redundantes: ${duplicated.reduce((total, entry) => total + entry.occurrences.length - entry.files.size + (entry.files.size - 1), 0)}`);
  if (maxGroups > 0) console.log(`Máximo permitido: ${maxGroups}`);
}

setExitCode(maxGroups > 0 && duplicated.length > maxGroups);
