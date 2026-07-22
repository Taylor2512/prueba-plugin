#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { parseArgs, readStringArg } from "./lib/cli.js";
import { readJsonFileSync, writeJsonFileSync } from "./lib/json.js";

const SELECT_TYPES = new Set(["select", "search-select"]);
const args = parseArgs(process.argv.slice(2));
const templatesPath = path.resolve(
  readStringArg(args, "file", "src/domain/forms/templates/formTemplates.json"),
);

if (!fs.existsSync(templatesPath)) {
  console.error(`Templates file not found: ${templatesPath}`);
  process.exit(2);
}

let data;
try {
  data = readJsonFileSync(templatesPath);
} catch (error) {
  console.error(`Failed to parse JSON: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(2);
}

const changes = [];
visitNode(data, null, "");

if (!changes.length) {
  console.log("No select fields needed labelPath changes.");
} else {
  writeJsonFileSync(templatesPath, data);
  for (const change of changes) {
    console.log(`Added labelPath '${change.labelPath}' for field '${change.name}' at ${change.path}`);
  }
  console.log(`Updated templates file: ${templatesPath}`);
}

function visitNode(node, parent, currentPath) {
  if (Array.isArray(node)) {
    node.forEach((item, index) => visitNode(item, parent, `${currentPath}[${index}]`));
    return;
  }
  if (!node || typeof node !== "object") return;

  const fieldOverride = node.field && typeof node.field === "object" ? node.field : null;
  if (fieldOverride) {
    addLabelPath(fieldOverride, node.name, `${currentPath}.field`);
  }

  addLabelPath(node, node.name || parent?.name, currentPath || "<root>");

  for (const [key, value] of Object.entries(node)) {
    if (key === "field") continue;
    const childPath = currentPath ? `${currentPath}.${key}` : key;
    visitNode(value, node, childPath);
  }
}

function addLabelPath(field, explicitName, fieldPath) {
  if (!SELECT_TYPES.has(String(field?.type || "")) || field.labelPath) return;
  const name = String(explicitName || field.name || "").trim();
  if (!name) return;

  field.labelPath = `${name}Label`;
  changes.push({ name, labelPath: field.labelPath, path: fieldPath });
}
