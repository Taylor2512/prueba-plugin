#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const inputFolder = process.argv[2];
const outputFile = process.argv[3] || "styles-unificados.css";

if (!inputFolder) {
  console.error("Uso:");
  console.error("node merge-css-from-folder.js ./src styles-unificados.css");
  process.exit(1);
}

const ROOT_DIR = path.resolve(inputFolder);

if (!fs.existsSync(ROOT_DIR)) {
  console.error(`La carpeta no existe: ${ROOT_DIR}`);
  process.exit(1);
}

if (!fs.statSync(ROOT_DIR).isDirectory()) {
  console.error(`La ruta no es una carpeta: ${ROOT_DIR}`);
  process.exit(1);
}

const VALID_EXT = new Set([".css"]);

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  ".nuxt",
  "coverage",
  ".turbo",
  ".cache",
  ".idea",
  ".vscode",
  "out",
  "tmp",
  "temp",
]);

const IGNORE_FILES = new Set([
  outputFile,
]);

function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`No se pudo leer la carpeta: ${dir}. Motivo: ${message}`);
    return [];
  }
}

function normalizePath(p) {
  return p.split(path.sep).join("/");
}

function walkStyleFiles(dir, fileList = []) {
  const entries = safeReadDir(dir);

  entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        walkStyleFiles(fullPath, fileList);
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (IGNORE_FILES.has(entry.name)) {
      continue;
    }

    const ext = path.extname(entry.name).toLowerCase();
    if (VALID_EXT.has(ext)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

/**
 * Orden para mantener la cascada lo más coherente posible:
 * 1. archivos globales/base/reset/theme primero
 * 2. luego por profundidad
 * 3. luego por ruta alfabética
 */
function getPriority(relativePath) {
  const name = relativePath.toLowerCase();

  if (
    name.includes("reset.css") ||
    name.includes("normalize.css") ||
    name.includes("base.css") ||
    name.includes("globals.css") ||
    name.includes("global.css") ||
    name.includes("theme.css") ||
    name.includes("variables.css")
  ) {
    return 0;
  }

  if (
    name.includes("layout.css") ||
    name.includes("grid.css") ||
    name.includes("utilities.css") ||
    name.includes("utils.css")
  ) {
    return 1;
  }

  return 2;
}

function sortFiles(files) {
  return [...files].sort((a, b) => {
    const relA = normalizePath(path.relative(ROOT_DIR, a));
    const relB = normalizePath(path.relative(ROOT_DIR, b));

    const priorityA = getPriority(relA);
    const priorityB = getPriority(relB);

    if (priorityA !== priorityB) {
      return priorityA - priorityB;
    }

    const depthA = relA.split("/").length;
    const depthB = relB.split("/").length;

    if (depthA !== depthB) {
      return depthA - depthB;
    }

    return relA.localeCompare(relB, undefined, { sensitivity: "base" });
  });
}

function buildDirectoryTree(dir, prefix = "") {
  const entries = safeReadDir(dir)
    .filter((entry) => {
      if (entry.isDirectory()) return !IGNORE_DIRS.has(entry.name);
      if (entry.isFile()) return VALID_EXT.has(path.extname(entry.name).toLowerCase());
      return false;
    })
    .sort((a, b) =>
      a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
    );

  const lines = [];

  entries.forEach((entry, index) => {
    const isLast = index === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const nextPrefix = prefix + (isLast ? "    " : "│   ");
    const entryPath = path.join(dir, entry.name);

    lines.push(`${prefix}${connector}${entry.name}`);

    if (entry.isDirectory()) {
      lines.push(...buildDirectoryTree(entryPath, nextPrefix));
    }
  });

  return lines;
}

function countLines(content) {
  if (!content) return 0;
  return content.split(/\r?\n/).length;
}

function createTableOfContents(files) {
  const lines = ["/* TABLA DE CONTENIDOS */", ""];

  files.forEach((file, index) => {
    const relativePath = normalizePath(path.relative(ROOT_DIR, file));
    lines.push(`/* ${String(index + 1).padStart(4, "0")}. ${relativePath} */`);
  });

  return lines.join("\n");
}

function createMergedOutput(files) {
  const generatedAt = new Date().toISOString();
  const toc = createTableOfContents(files);
  const treeLines = buildDirectoryTree(ROOT_DIR);

  const output = [
    "/* =====================================================================",
    "   ARCHIVO UNIFICADO DE ESTILOS CSS",
    "   =====================================================================",
    `   Carpeta origen: ${normalizePath(ROOT_DIR)}`,
    `   Fecha de generación: ${generatedAt}`,
    `   Total de archivos incluidos: ${files.length}`,
    `   Extensiones incluidas: ${Array.from(VALID_EXT).join(", ")}`,
    "   Objetivo: consolidar estilos CSS respetando un orden estable de cascada",
    "   ===================================================================== */",
    "",
    toc,
    "",
    "/* =====================================================================",
    "   INICIO DE ESTILOS UNIFICADOS",
    "   ===================================================================== */",
    "",
  ];

  files.forEach((file, index) => {
    const relativePath = normalizePath(path.relative(ROOT_DIR, file));
    const absolutePath = normalizePath(file);

    let content = "";
    try {
      content = fs.readFileSync(file, "utf8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      content = `/* ERROR: no se pudo leer este archivo. Motivo: ${message} */\n`;
    }

    const lineCount = countLines(content);

    output.push(
      `/* ====================================================================`,
      `   ARCHIVO #${index + 1}`,
      `   Ruta relativa: ${relativePath}`,
      `   Ruta absoluta: ${absolutePath}`,
      `   Líneas aproximadas: ${lineCount}`,
      `   ==================================================================== */`,
      "",
      content,
      "",
      `/* ========================== FIN DE ${relativePath} ========================== */`,
      "",
      ""
    );
  });

  output.push(
    "/* =====================================================================",
    "   ESTRUCTURA DE CARPETAS ANALIZADA",
    "   =====================================================================",
    "",
    `   ${normalizePath(path.basename(ROOT_DIR))}`,
    ...treeLines.map((line) => `   ${line}`),
    "",
    "   ===================================================================== */",
    ""
  );

  return output.join("\n");
}

function main() {
  console.log(`Escaneando carpeta: ${ROOT_DIR}`);

  let files = walkStyleFiles(ROOT_DIR);
  files = sortFiles(files);

  console.log(`Archivos encontrados: ${files.length}`);

  if (files.length === 0) {
    console.warn("No se encontraron archivos .css");
  }

  const mergedContent = createMergedOutput(files);

  fs.writeFileSync(outputFile, mergedContent, "utf8");

  console.log(`Archivo generado correctamente: ${path.resolve(outputFile)}`);
}

main();