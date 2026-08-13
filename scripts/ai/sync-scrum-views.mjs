import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const currentFile = fileURLToPath(import.meta.url);
const repoRoot = path.resolve(path.dirname(currentFile), "../..");
const taskRoot = path.join(repoRoot, ".ai", "scrum", "task-cards");
const activeFile = path.join(repoRoot, ".ai", "scrum", "ACTIVE.md");
const completedFile = path.join(repoRoot, ".ai", "scrum", "COMPLETED.md");

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(abs, out);
    else if (entry.isFile() && entry.name.endsWith(".md") && entry.name.toLowerCase() !== "readme.md") out.push(abs);
  }
  return out;
}

function parseFrontmatter(text) {
  if (!text.startsWith("---")) return {};
  const end = text.indexOf("\n---", 3);
  if (end < 0) return {};
  const block = text.slice(3, end).trim();
  const result = {};
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*?)\s*$/);
    if (m) result[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
  return result;
}

function titleOf(text, fallback) {
  return text.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

function normalizeState(meta) {
  return String(meta.status || meta.state || "").trim().toLowerCase().replace(/[_-]+/g, " ");
}

function taskRows() {
  return walk(taskRoot).map((abs) => {
    const text = fs.readFileSync(abs, "utf8");
    const meta = parseFrontmatter(text);
    const rel = path.relative(path.dirname(activeFile), abs).split(path.sep).join("/");
    return {
      id: meta.id || path.basename(abs, ".md"),
      state: normalizeState(meta),
      title: titleOf(text, path.basename(abs, ".md")),
      rel,
    };
  });
}

function render(title, rows, description) {
  const lines = [`# ${title}`, "", description, ""];
  if (!rows.length) lines.push("- Ninguna.");
  else {
    for (const row of rows.sort((a, b) => a.id.localeCompare(b.id))) {
      lines.push(`- [${row.id}](${row.rel}) — ${row.title}`);
    }
  }
  lines.push("", "> Vista generada. La autoridad permanece en la task-card y, cuando aplique, en su ledger.", "");
  return lines.join("\n");
}

export function syncScrumViews() {
  const rows = taskRows();
  const activeStates = new Set(["claimed", "in progress", "review", "in review", "blocked", "active"]);
  const doneStates = new Set(["done", "completed", "closed"]);

  const active = rows.filter((row) => activeStates.has(row.state));
  const completed = rows.filter((row) => doneStates.has(row.state));

  fs.mkdirSync(path.dirname(activeFile), { recursive: true });
  fs.writeFileSync(activeFile, render("Active", active, "Tareas actualmente en ejecución/review detectadas por frontmatter."), "utf8");
  fs.writeFileSync(completedFile, render("Completed", completed, "Tareas cerradas detectadas por frontmatter."), "utf8");

  return { scanned: rows.length, active: active.length, completed: completed.length };
}

if (process.argv[1] && path.resolve(process.argv[1]) === currentFile) {
  const result = syncScrumViews();
  process.stdout.write(`${JSON.stringify(result)}\n`);
}
