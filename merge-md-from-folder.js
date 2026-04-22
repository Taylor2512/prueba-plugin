#!/usr/bin/env node
/* global process */

import fs from "node:fs";
import path from "node:path";

const inputFolder = process.argv[2];
const outputFile = process.argv[3] || "documentacion-unificada.md";

if (!inputFolder) {
  console.error("Uso: node merge-md-from-folder.js <carpeta-entrada> [archivo-salida.md]");
  process.exit(1);
}

const ROOT_DIR = path.resolve(inputFolder);

if (!fs.existsSync(ROOT_DIR)) {
  console.error(`La ruta no existe: ${ROOT_DIR}`);
  process.exit(1);
}

if (!fs.statSync(ROOT_DIR).isDirectory()) {
  console.error(`La ruta no es una carpeta válida: ${ROOT_DIR}`);
  process.exit(1);
}

const VALID_EXT = new Set([".md"]);

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

const IGNORE_FILES = new Set([outputFile]);

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

function walkMarkdownFiles(dir, fileList = []) {
  const entries = safeReadDir(dir);

  entries.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) {
        walkMarkdownFiles(fullPath, fileList);
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
  const lines = ["# Tabla de contenidos", ""];

  files.forEach((file, index) => {
    const relativePath = normalizePath(path.relative(ROOT_DIR, file));
    const anchor = `archivo-${String(index + 1).padStart(4, "0")}`;
    lines.push(`${String(index + 1).padStart(4, "0")}. [${relativePath}](#${anchor})`);
  });

  return lines.join("\n");
}

function createMergedOutput(files) {
  const generatedAt = new Date().toISOString();
  const toc = createTableOfContents(files);
  const treeLines = buildDirectoryTree(ROOT_DIR);

  const output = [
    "# Documentación Markdown Unificada",
    "",
    `**Carpeta origen:** \`${normalizePath(ROOT_DIR)}\`  `,
    `**Fecha de generación:** \`${generatedAt}\`  `,
    `**Total de archivos incluidos:** \`${files.length}\`  `,
    `**Extensiones incluidas:** \`${Array.from(VALID_EXT).join(", ")}\``,
    "",
    "---",
    "",
    toc,
    "",
    "---",
    "",
    "# Contenido consolidado",
    ""
  ];

  files.forEach((file, index) => {
    const relativePath = normalizePath(path.relative(ROOT_DIR, file));
    const absolutePath = normalizePath(file);

    let content = "";
    try {
      content = fs.readFileSync(file, "utf8");
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      content = `> ERROR: no se pudo leer este archivo. Motivo: ${message}\n`;
    }

    const lineCount = countLines(content);
    const sectionId = `archivo-${String(index + 1).padStart(4, "0")}`;

    output.push(
      `---`,
      ``,
      `<a id="${sectionId}"></a>`,
      `## Archivo #${index + 1}: ${relativePath}`,
      ``,
      `- **Ruta relativa:** \`${relativePath}\``,
      `- **Ruta absoluta:** \`${absolutePath}\``,
      `- **Extensión:** \`.md\``,
      `- **Líneas aproximadas:** \`${lineCount}\``,
      ``,
      `### Contenido original`,
      ``,
      content.trim(),
      ``,
      `[⬆ Volver a la tabla de contenidos](#tabla-de-contenidos)`,
      ``
    );
  });

  output.push(
    "---",
    "",
    "# Estructura de carpetas analizada",
    "",
    "```text",
    normalizePath(path.basename(ROOT_DIR)),
    ...treeLines,
    "```",
    ""
  );

  return output.join("\n");
}

function main() {
  console.log(`Buscando archivos .md en: ${ROOT_DIR}`);

  let files = walkMarkdownFiles(ROOT_DIR);
  files = sortFiles(files);

  if (files.length === 0) {
    console.error("No se encontraron archivos .md en la carpeta indicada.");
    process.exit(1);
  }

  const mergedContent = createMergedOutput(files);

  fs.writeFileSync(outputFile, mergedContent, "utf8");

  console.log(`Archivo generado correctamente: ${outputFile}`);
  console.log(`Total de archivos .md incluidos: ${files.length}`);
}

main();