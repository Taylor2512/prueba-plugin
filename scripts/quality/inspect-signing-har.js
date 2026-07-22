#!/usr/bin/env node
import { parseArgs, readNumberArg, readStringArg } from "../lib/cli.js";
import { readJsonFileSync } from "../lib/json.js";

const MATCHERS = Object.freeze({
  workflowEditable: /workflow\/editable/i,
  workflowEdit: /workflow\/edit(?:\?|$|\/)/i,
  byDocumentAndFileTypes: /bydocumentandfiletypes/i,
  renderWithAnchors: /render-with-anchors/i,
  txtRemote: /_form_state|_txtTs|\.txt/i,
  createTransaction: /createtransaction/i,
  checkLiveness: /checkliveness3d/i,
  createRequest: /createrequestoneshot/i,
});
const SENSITIVE_QUERY_KEYS = new Set([
  "authorization",
  "cedula",
  "fingerprintcode",
  "jwt",
  "pin",
  "token",
]);

const args = parseArgs(process.argv.slice(2));
const file = readStringArg(args, "file", process.argv.slice(2).find((value) => !value.startsWith("--")) || "");
const top = readNumberArg(args, "top", 20, { min: 1 });

if (!file) {
  console.error("Usage: node scripts/quality/inspect-signing-har.js file.har [--top=20]");
  process.exit(1);
}

const har = readJsonFileSync(file);
const entries = Array.isArray(har?.log?.entries) ? har.log.entries : [];
const counts = Object.fromEntries(Object.keys(MATCHERS).map((key) => [key, 0]));
const endpointCounts = new Map();

for (const entry of entries) {
  const url = String(entry?.request?.url || "");
  const method = String(entry?.request?.method || "GET").toUpperCase();

  for (const [key, matcher] of Object.entries(MATCHERS)) {
    if (matcher.test(url)) counts[key] += 1;
  }

  const key = `${method} ${stripQuery(redactUrl(url))}`;
  endpointCounts.set(key, (endpointCounts.get(key) || 0) + 1);
}

console.log(`Total requests: ${entries.length}`);
for (const [key, count] of Object.entries(counts)) console.log(`${key}: ${count}`);

console.log("\nTop duplicated endpoints:");
for (const [endpoint, count] of [...endpointCounts.entries()]
  .filter(([, value]) => value > 1)
  .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
  .slice(0, top)) {
  console.log(`${count}\t${endpoint}`);
}

function redactUrl(value) {
  try {
    const url = new URL(value);
    for (const key of [...url.searchParams.keys()]) {
      if (SENSITIVE_QUERY_KEYS.has(key.toLowerCase())) url.searchParams.set(key, "<redacted>");
    }
    return url.toString();
  } catch {
    return String(value || "").replace(
      /([?&](?:authorization|token|jwt|pin|cedula|fingerprintCode)=)[^&]+/gi,
      "$1<redacted>",
    );
  }
}

function stripQuery(value) {
  return String(value || "").split("?")[0];
}
