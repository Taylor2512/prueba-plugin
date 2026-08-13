import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const taskId = process.argv[2];
if (!taskId) throw new Error("usage: node .ai/scripts/build-context-pack.mjs <task-id>");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(abs);
  }
  return out;
}

const cards = walk(path.join(root, ".ai", "scrum", "task-cards"));
const card = cards.find((file) => {
  const text = fs.readFileSync(file, "utf8");
  return new RegExp(`^id:\\s*${taskId.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*$`, "mi").test(text)
    || path.basename(file).startsWith(`${taskId}-`)
    || path.basename(file, ".md") === taskId;
});

if (!card) throw new Error(`task not found in .ai/scrum/task-cards: ${taskId}`);

const taskText = fs.readFileSync(card, "utf8");
const stateSources = fs.existsSync(".ai/STATE-SOURCES.md") ? fs.readFileSync(".ai/STATE-SOURCES.md", "utf8") : "";
const router = fs.existsSync(".ai/ROUTER.md") ? fs.readFileSync(".ai/ROUTER.md", "utf8") : "";

const codeSpans = [...taskText.matchAll(/`([^`\n]+)`/g)].map((match) => match[1]);
const evidencePath = codeSpans.find((value) =>
  /^(?:reports\/.*evidence\/|\.ai\/evidence\/)/i.test(value) && !value.includes("*"),
);
const defaultDir = path.join(root, "reports", "architecture", "context-packs");
const outputDir = evidencePath
  ? path.dirname(path.resolve(root, evidencePath))
  : defaultDir;

fs.mkdirSync(outputDir, { recursive: true });
const output = path.join(outputDir, `${taskId}-context-pack.md`);

const pack = [
  `# Context pack — ${taskId}`,
  "",
  `Task source: \`${path.relative(root, card).split(path.sep).join("/")}\``,
  "",
  "## Task",
  taskText,
  "",
  "## State sources",
  stateSources,
  "",
  "## Router",
  router,
  "",
  "## Rule",
  "Open source/tests only from the task read-set and routing needs. Do not expand context speculatively.",
].join("\n");

fs.writeFileSync(output, pack, "utf8");
console.log(path.relative(root, output).split(path.sep).join("/"));
