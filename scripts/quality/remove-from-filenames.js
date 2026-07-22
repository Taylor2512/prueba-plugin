#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { DEFAULT_IGNORED_DIRECTORIES } from "../lib/files.js";
import { hasFlag, parseArgs, readStringArg } from "../lib/cli.js";

const args = parseArgs(process.argv.slice(2));
const rootDir = path.resolve(readStringArg(args, "root", "."));
const apply = hasFlag(args, "apply");
const includeDirectories = hasFlag(args, "include-dirs");
const targetWord = readStringArg(args, "word").trim();

if (!targetWord) {
  console.error("Falta --word=<token> (token estructural a eliminar de nombres de archivo).");
  process.exit(1);
}

const targetPattern = new RegExp(escapeRegExp(targetWord), "i");
const replacePattern = new RegExp(escapeRegExp(targetWord), "gi");

main().catch((error) => {
  console.error("Error al renombrar archivos:");
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  console.log(`Root: ${rootDir}`);
  console.log(`Modo: ${apply ? "APPLY - renombrará archivos" : "DRY RUN - no modifica nada"}`);
  console.log(`Incluir carpetas: ${includeDirectories ? "sí" : "no"}\n`);

  const plans = await collectRenamePlans(rootDir);
  if (!plans.length) {
    console.log("No se encontraron archivos para renombrar.");
    return;
  }

  const collisions = await findCollisions(plans);
  if (collisions.length) {
    console.error("Se detectaron colisiones. No se aplicó ningún cambio:");
    for (const item of collisions) console.error(`- ${item.relativeOld} -> ${item.relativeNew}`);
    process.exitCode = 1;
    return;
  }

  console.log("Plan de renombramiento:");
  for (const plan of plans) console.log(`- ${plan.relativeOld} -> ${plan.relativeNew}`);
  console.log(`\nTotal: ${plans.length}`);

  if (!apply) {
    console.log(`\nDry-run completado. Para aplicar:\nnode scripts/quality/remove-from-filenames.js --word=${JSON.stringify(targetWord)} --root=${JSON.stringify(rootDir)} --apply`);
    return;
  }

  // Deepest paths first so directory renames never invalidate pending child paths.
  for (const plan of [...plans].sort((left, right) => right.oldPath.length - left.oldPath.length)) {
    await fs.rename(plan.oldPath, plan.newPath);
  }
  console.log("\nRenombramiento aplicado correctamente.");
}

async function collectRenamePlans(root) {
  const entries = await collectCandidates(root);
  return entries
    .map((entry) => {
      const newName = removeTargetWord(entry.name);
      const newPath = path.join(path.dirname(entry.path), newName);
      return {
        ...entry,
        newName,
        newPath,
        relativeOld: path.relative(root, entry.path),
        relativeNew: path.relative(root, newPath),
      };
    })
    .filter((entry) => entry.newName && entry.newName !== entry.name)
    .sort((left, right) => left.relativeOld.localeCompare(right.relativeOld));
}

async function collectCandidates(root, output = []) {
  const entries = await fs.readdir(root, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory() && DEFAULT_IGNORED_DIRECTORIES.has(entry.name)) continue;
    const target = path.join(root, entry.name);

    if (entry.isDirectory()) {
      await collectCandidates(target, output);
      if (includeDirectories && targetPattern.test(entry.name)) {
        output.push({ type: "dir", path: target, name: entry.name });
      }
    } else if (entry.isFile() && targetPattern.test(entry.name)) {
      output.push({ type: "file", path: target, name: entry.name });
    }
  }
  return output;
}

async function findCollisions(plans) {
  const targetCounts = new Map();
  for (const plan of plans) targetCounts.set(plan.newPath, (targetCounts.get(plan.newPath) || 0) + 1);

  const collisions = [];
  for (const plan of plans) {
    if (targetCounts.get(plan.newPath) > 1 || await exists(plan.newPath)) collisions.push(plan);
  }
  return collisions;
}

function removeTargetWord(filename) {
  const extension = path.extname(filename);
  const basename = extension ? filename.slice(0, -extension.length) : filename;
  const cleaned = basename
    .replace(replacePattern, "")
    .replace(/[-_]{2,}/g, "-")
    .replace(/^[-_\s.]+|[-_\s.]+$/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  return `${cleaned || "renamed"}${extension}`;
}

async function exists(target) {
  try {
    await fs.access(target);
    return true;
  } catch {
    return false;
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
