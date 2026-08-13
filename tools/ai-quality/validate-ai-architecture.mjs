import fs from "node:fs";
import process from "node:process";
const required = [
  "AGENTS.md", ".ai/START.md", ".ai/router/CAPABILITY-ROUTER.md",
  ".ai/governance/WRITE-OWNERSHIP.md",
  ".ai/quality/RISK-GATE-MATRIX.md",
  ".ai/scrum/task-cards/TEMPLATE.md",
  ".ai/memory/MEMORY-DELTA.schema.json"
];
const missing = required.filter(x => !fs.existsSync(x));
if (missing.length) {
  console.error("Missing:\n" + missing.map(x => `- ${x}`).join("\n"));
  process.exit(1);
}
console.log("AI architecture valid.");
