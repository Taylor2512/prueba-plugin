#!/usr/bin/env node
/**
 * Contract gate between formTemplates.json and runtime registries resolved by string.
 * Static import analyzers cannot infer these links, so this script fails when a
 * declarative transform has no corresponding registry entry.
 */
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { isFunctionLike, parseProgram } from "../lib/ast.js";
import { readTextFile } from "../lib/files.js";
import { readJsonFileSync, walkJson } from "../lib/json.js";

const SCRIPT_DIRECTORY = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(SCRIPT_DIRECTORY, "../..");
const TEMPLATES_PATH = resolve(ROOT, "src/domain/forms/templates/formTemplates.json");
const TRANSFORM_REGISTRY_FILES = [
  "src/domain/forms/templates/templateTransforms.js",
  "src/domain/forms/formsIndexConfig.js",
  "src/domain/forms/templates/templateSignerResolver.js",
];
const TRANSFORM_ALLOWLIST = new Set([
  // Consumed by documentContextRuntime's dedicated date handler.
  "datePartsAndWords",
]);

const parseErrors = [];
const registry = buildTransformRegistry();
const references = collectTransformReferences(readJsonFileSync(TEMPLATES_PATH));
const unresolved = references.filter(
  ({ name }) => !registry.has(name) && !TRANSFORM_ALLOWLIST.has(name),
);

console.log(
  `[template-contracts] transforms: ${references.length} references ` +
    `(${new Set(references.map(({ name }) => name)).size} unique) checked ` +
    `against ${registry.size} registry entries.`,
);

if (parseErrors.length) {
  console.error(`[template-contracts] Registry parse errors: ${parseErrors.length}`);
  for (const error of parseErrors) console.error(`  ${error.file}: ${error.message}`);
}

if (!unresolved.length && !parseErrors.length) {
  console.log("[template-contracts] OK — every transform resolves to a registry entry.");
  process.exit(0);
}

if (unresolved.length) {
  console.error(`\n[template-contracts] FAIL — ${unresolved.length} unresolved transform reference(s):`);
  for (const reference of unresolved) {
    console.error(`  Unknown transform: ${reference.path}\n    value: "${reference.name}"`);
  }
  console.error(
    "\nRegister each transform in a runtime registry. Use the allowlist only " +
      "for a documented resolver outside those registries.",
  );
}
process.exit(1);

function buildTransformRegistry() {
  const keys = new Set();
  for (const relativeFile of TRANSFORM_REGISTRY_FILES) {
    const file = resolve(ROOT, relativeFile);
    let source;
    try {
      source = readTextFile(file);
    } catch {
      continue;
    }

    const program = parseProgram(file, source, { errors: parseErrors });
    if (program) collectRegistryKeys(program, keys);
  }
  return keys;
}

function collectRegistryKeys(node, output) {
  if (!node || typeof node !== "object") return output;

  if (node.type === "ObjectMethod") {
    const key = propertyName(node.key);
    if (key) output.add(key);
  } else if (node.type === "ObjectProperty") {
    const key = propertyName(node.key);
    if (key && (node.shorthand || isFunctionLike(node.value))) output.add(key);
  }

  for (const value of Object.values(node)) {
    if (Array.isArray(value)) value.forEach((item) => collectRegistryKeys(item, output));
    else if (value && typeof value === "object") collectRegistryKeys(value, output);
  }
  return output;
}

function collectTransformReferences(template) {
  const references = [];
  walkJson(template, ({ key, value, path }) => {
    if ((key === "transform" || key === "format") && typeof value === "string") {
      const name = value.trim();
      if (name) references.push({ name, path });
    }
  });
  return references;
}

function propertyName(node) {
  if (node?.type === "Identifier") return node.name;
  if (["StringLiteral", "NumericLiteral"].includes(node?.type)) return String(node.value);
  return "";
}
