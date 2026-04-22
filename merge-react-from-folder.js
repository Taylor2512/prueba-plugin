#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const inputFolder = process.argv[2];
const outputFile = process.argv[3] || "codigo-unificado.txt";

if (!inputFolder) {
  
  
  process.exit(1);
}

const ROOT_DIR = path.resolve(inputFolder);

if (!fs.existsSync(ROOT_DIR)) {
  
  process.exit(1);
}

if (!fs.statSync(ROOT_DIR).isDirectory()) {
  
  process.exit(1);
}

const VALID_EXT = new Set([".tsx", ".ts", ".jsx", ".js"]);

const IGNORE_DIRS = new Set([
  "node_modules",
  ".git",
  "dist",
  "build",
  ".next",
  "coverage",
  ".turbo",
  ".cache",
  ".idea",
  ".vscode",
  "out",
  "tmp",
  "temp"
]);

const IGNORE_FILES = new Set([
  outputFile
]);

function safeReadDir(dir) {
  try {
    return fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }
}

function normalizePath(p) {
  return p.split(path.sep).join("/");
}

function walkSourceFiles(dir, fileList = []) {
  const entries = safeReadDir(dir);

  entries.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        walkSourceFiles(fullPath, fileList);
      }
      continue;
    }

    if (!entry.isFile()) {
      continue;
    }

    if (IGNORE_FILES.has(entry.name)) {
      continue;
    }

    const ext = path.extname(entry.name);
    if (VALID_EXT.has(ext)) {
      fileList.push(fullPath);
    }
  }

  return fileList;
}

function sortFiles(files) {
  return [...files].sort((a, b) => {
    const relA = normalizePath(path.relative(ROOT_DIR, a));
    const relB = normalizePath(path.relative(ROOT_DIR, b));

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
      if (entry.isFile()) return VALID_EXT.has(path.extname(entry.name));
      return false;
    })
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));

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

const COMMENT_PREFIX = "//";

function createTableOfContents(files) {
  const lines = ["## TABLA DE CONTENIDOS", ""];

  files.forEach((file, index) => {
    const relativePath = normalizePath(path.relative(ROOT_DIR, file));
    lines.push(`${String(index + 1).padStart(4, "0")}. ${relativePath}`);
  });

  return lines.join("\n");
}

function createMergedOutput(files) {
  const generatedAt = new Date().toISOString();
  const toc = createTableOfContents(files);
  const treeLines = buildDirectoryTree(ROOT_DIR);

  const output = [
    "/* =====================================================================",
    "   ARCHIVO UNIFICADO DE CÓDIGO PARA ANÁLISIS CON IA",
    "   =====================================================================",
    `   Carpeta origen: ${normalizePath(ROOT_DIR)}`,
    `   Fecha de generación: ${generatedAt}`,
    `   Total de archivos incluidos: ${files.length}`,
    `   Extensiones incluidas: ${Array.from(VALID_EXT).join(", ")}`,
    "   Objetivo: consolidar código fuente con contexto estructural para análisis",
    "   ===================================================================== */",
    "",
    toc,
    "",
    "/* =====================================================================",
    "   INICIO DEL CÓDIGO UNIFICADO",
    "   ===================================================================== */",
    "",
  ];

  files.forEach((file, index) => {
    const relativePath = normalizePath(path.relative(ROOT_DIR, file));
    const absolutePath = normalizePath(file);
    const ext = path.extname(file);
    const commentPrefix = COMMENT_PREFIX;

    let content = "";
    try {
      content = fs.readFileSync(file, "utf8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      content = `${commentPrefix} ERROR: no se pudo leer este archivo. Motivo: ${message}\n`;
    }

    const lineCount = countLines(content);

    output.push(
      `${commentPrefix} ====================================================================`,
      `${commentPrefix} ARCHIVO #${index + 1}`,
      `${commentPrefix} Ruta relativa: ${relativePath}`,
      `${commentPrefix} Ruta absoluta: ${absolutePath}`,
      `${commentPrefix} Extensión: ${ext}`,
      `${commentPrefix} Líneas aproximadas: ${lineCount}`,
      `${commentPrefix} Fuente: tomado desde la carpeta base "${normalizePath(ROOT_DIR)}"`,
      `${commentPrefix} ====================================================================`,
      "",
      content,
      "",
      `${commentPrefix} ========================== FIN DE ${relativePath} ==========================`,
      "",
      "",
    );
  });

  output.push(
    "/* =====================================================================",
    "   ESTRUCTURA DE CARPETAS ANALIZADA",
    "   =====================================================================",
    "",
    normalizePath(path.basename(ROOT_DIR)),
    ...treeLines,
    "",
    "   ===================================================================== */",
    "",
  );

  return output.join("\n");
}

function main() {
  

  let files = walkSourceFiles(ROOT_DIR);
  files = sortFiles(files);

  

if (files.length === 0) {
    process.exit(1);
  }

  const mergedContent = createMergedOutput(files);

  fs.writeFileSync(outputFile, mergedContent, "utf8");

  }

main();
