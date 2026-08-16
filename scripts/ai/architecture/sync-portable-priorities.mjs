#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(process.argv[2] || ".");

function read(p) { return fs.readFileSync(p, "utf8"); }
function write(p, s) { fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, s.endsWith("\n") ? s : s + "\n", "utf8"); }
function parseFrontmatter(file) {
  const text = read(file);
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const out = { file, id: path.basename(file, ".md"), status: "UNKNOWN", priority: "P9", depends_on: [] };
  if (!m) return out;
  const fm = m[1];
  const get = (key) => fm.match(new RegExp(`^${key}:\\s*(.+)$`, "m"))?.[1]?.trim();
  out.id = get("id") || out.id;
  out.status = (get("status") || "UNKNOWN").replace(/^["']|["']$/g, "");
  out.priority = (get("priority") || "P9").replace(/^["']|["']$/g, "");
  const depRaw = get("depends_on") || get("dependsOn") || "[]";
  try { out.depends_on = JSON.parse(depRaw.replace(/'/g,'"')); } catch { out.depends_on = []; }
  return out;
}
function filesIn(dir, re) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(n => re.test(n)).map(n => path.join(dir,n));
}
function replaceManaged(file, start, end, block) {
  let text = fs.existsSync(file) ? read(file) : "";
  const a = text.indexOf(start), b = text.indexOf(end);
  const managed = `${start}\n${block.trim()}\n${end}`;
  if (a >= 0 && b >= a) text = text.slice(0,a) + managed + text.slice(b + end.length);
  else {
    const title = text.match(/^# .+$/m);
    if (title) {
      const idx = text.indexOf(title[0]) + title[0].length;
      text = text.slice(0,idx) + "\n\n" + managed + text.slice(idx);
    } else text = managed + "\n\n" + text;
  }
  write(file, text);
}

const rtpDir = path.join(root, ".ai/scrum/task-cards/runtime-platform");
const prtDir = path.join(root, ".ai/scrum/task-cards/portable-runtime");
const rtp = filesIn(rtpDir, /^RTP-\d+\.md$/)
  .map(parseFrontmatter)
  .filter(t => {
    const n = Number(t.id.split("-")[1]);
    return Number.isFinite(n) && n >= 425 && n <= 545;
  })
  .sort((a,b)=>Number(a.id.split("-")[1])-Number(b.id.split("-")[1]));
const prt = filesIn(prtDir, /^PRT-\d+\.md$/)
  .map(parseFrontmatter)
  .sort((a,b)=>Number(a.id.split("-")[1])-Number(b.id.split("-")[1]));

const statusById = new Map([...rtp,...prt].map(t=>[t.id,t.status]));
function openDeps(t) {
  return (t.depends_on || []).filter(id => statusById.get(id) && statusById.get(id) !== "PASS");
}
function effective(t) {
  if (t.status === "PASS" || t.status === "ARCHIVED") return t.status;
  const open = openDeps(t);
  if (open.length && ["READY","BACKLOG","IN_PROGRESS","REVIEW"].includes(t.status)) return "BLOCKED";
  return t.status;
}
for (const t of [...rtp,...prt]) { t.open = openDeps(t); t.effective = effective(t); }

const rtpPass = rtp.filter(t=>t.status==="PASS").length;
const rtpPartial = rtp.filter(t=>t.status==="PARTIAL" || t.status==="BLOCKED").map(t=>t.id);
const nextPrt = prt.find(t=>["READY","IN_PROGRESS","REVIEW"].includes(t.effective))
  || prt.find(t=>t.effective==="BACKLOG")
  || null;

const priorityOrder = { P0:0, P1:1, P2:2, P3:3, P9:9 };
const active = [...rtp,...prt]
  .filter(t=>!["PASS","ARCHIVED"].includes(t.effective))
  .sort((a,b)=>(priorityOrder[a.priority]??9)-(priorityOrder[b.priority]??9) || a.id.localeCompare(b.id,undefined,{numeric:true}));

const view = [
  "# Current priorities",
  "",
  "> Generated from task-card frontmatter. Historical Runtime Platform 000..420 is provenance, not the active queue.",
  "",
  "## Runtime Platform active window",
  "",
  `- range: RTP-425..RTP-545`,
  `- PASS: ${rtpPass}/${rtp.length}`,
  `- unresolved: ${rtpPartial.length ? rtpPartial.join(", ") : "none"}`,
  "",
  "## Portable Runtime",
  "",
  ...(prt.length ? prt.map(t=>`- [${t.id}](../task-cards/portable-runtime/${t.id}.md) — **${t.effective}** — ${t.priority}${t.open.length ? ` — open: ${t.open.join(", ")}` : ""}`) : ["- none"]),
  "",
  "## Execution order",
  "",
  ...(active.length ? active.map((t,i)=>`${i+1}. **${t.id}** — ${t.effective} — ${t.priority}${t.open.length ? ` — blocked by ${t.open.join(", ")}` : ""}`) : ["- none"]),
  "",
  "## Rule",
  "",
  "Do not reopen superseded Runtime Platform 000..420 cards merely because they remain in historical storage.",
];
write(path.join(root, ".ai/scrum/views/PRIORITIES.md"), view.join("\n"));

const portableView = [
  "# Portable Runtime state",
  "",
  "| Task | Status | Effective | Priority | Open dependencies |",
  "|---|---|---|---|---|",
  ...prt.map(t=>`| [${t.id}](../task-cards/portable-runtime/${t.id}.md) | ${t.status} | **${t.effective}** | ${t.priority} | ${t.open.join(", ") || "-"} |`),
  "",
  "> Authority: task-card frontmatter plus dependency DAG.",
];
write(path.join(root, ".ai/scrum/views/PORTABLE-RUNTIME.md"), portableView.join("\n"));

const currentBlock = [
  "## Generated current priority window",
  "",
  `- Runtime Platform RTP-425..545: **${rtpPass}/${rtp.length} PASS**.`,
  `- Runtime unresolved: **${rtpPartial.length ? rtpPartial.join(", ") : "none"}**.`,
  `- Portable Runtime next attention: **${nextPrt ? `${nextPrt.id} — ${nextPrt.effective}` : "none"}**.`,
  "",
  "Canonical queue: [`../../scrum/views/PRIORITIES.md`](../../scrum/views/PRIORITIES.md).",
  "",
  "> Historical prose below does not override live task-card frontmatter.",
].join("\n");
replaceManaged(
  path.join(root, ".ai/brain/70-memory/CURRENT.md"),
  "<!-- portable-priority-sync:start -->",
  "<!-- portable-priority-sync:end -->",
  currentBlock
);

const activeBlock = [
  "## Generated current attention",
  "",
  ...(active.slice(0,12).length ? active.slice(0,12).map(t=>`- ${t.id}: ${t.effective} (${t.priority})`) : ["- none"]),
  "",
  "Canonical queue: [`../../scrum/views/PRIORITIES.md`](../../scrum/views/PRIORITIES.md).",
].join("\n");
replaceManaged(
  path.join(root, ".ai/brain/80-work/ACTIVE.md"),
  "<!-- portable-priority-sync:start -->",
  "<!-- portable-priority-sync:end -->",
  activeBlock
);

console.log(JSON.stringify({
  runtimePlatform: { total: rtp.length, pass: rtpPass, unresolved: rtpPartial },
  portableRuntime: { total: prt.length, next: nextPrt?.id || null },
  active: active.map(t=>t.id)
}, null, 2));
