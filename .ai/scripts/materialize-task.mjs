import fs from "node:fs";
import path from "node:path";

const id = process.argv[2];
if (!id) throw new Error("usage: node .ai/scripts/materialize-task.mjs <task-id>");

const root = process.cwd();
const taskRoot = path.join(root, ".ai", "scrum", "task-cards");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(abs);
  }
  return out;
}

const existing = walk(taskRoot).find((file) => {
  const text = fs.readFileSync(file, "utf8");
  return new RegExp(`^id:\\s*${id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "mi").test(text)
    || path.basename(file).startsWith(`${id}-`)
    || path.basename(file, ".md") === id;
});

if (existing) {
  console.log(path.relative(root, existing).split(path.sep).join("/"));
  process.exit(0);
}

throw new Error(
  `task ${id} is not materialized. The current repository has no canonical backlog JSONL generator. ` +
  "Create the task-card through the active campaign/backlog workflow instead of recreating legacy backlog-v8.jsonl."
);
