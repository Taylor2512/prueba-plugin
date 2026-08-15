#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import {
  slash, walk, loadPolicy, scanGraph, duplicateAudit, markdownFiles, normalizeMarkdown
} from "./ai-structure-core.mjs";

const root = path.resolve(process.argv[2] || ".");
const policy = loadPolicy(root);
const reportDir = path.join(root, "reports/architecture");
fs.mkdirSync(reportDir, { recursive: true });

const files = markdownFiles(root);
const graph = scanGraph(root);
const exact = duplicateAudit(root);
const top = new Map();
for (const file of files) {
  const rel = slash(path.relative(root, file));
  const seg = rel.split("/").slice(0,2).join("/");
  top.set(seg, (top.get(seg) || 0) + 1);
}

const scrumTop = files.map((p) => slash(path.relative(root,p)))
  .filter((p) => p.startsWith(".ai/scrum/") && p.split("/").length === 3)
  .sort();
const staleFiles = files.map((p) => slash(path.relative(root,p)))
  .filter((p) => /^\.ai\/brain\/10-domains\/[^/]+\/FILES\.md$/.test(p));
const oldContracts = files.map((p) => slash(path.relative(root,p)))
  .filter((p) => p.startsWith(".ai/contracts/"));

const result = {
  markdownFiles: files.length,
  brokenLinks: graph.broken,
  activeOrphans: graph.orphans,
  exactDuplicateGroups: exact,
  scrumTopLevel: scrumTop,
  domainFilesSnapshots: staleFiles,
  legacyContractRoot: oldContracts,
  deepArchiveCandidates: policy.deepArchiveCandidates || [],
};

fs.writeFileSync(path.join(reportDir, "ai-structure-audit.json"), JSON.stringify(result,null,2)+"\n");
const md = [
  "# AI structure audit",
  "",
  `- Markdown under .ai: ${result.markdownFiles}`,
  `- broken internal Markdown links: ${result.brokenLinks.length}`,
  `- active orphan candidates: ${result.activeOrphans.length}`,
  `- exact duplicate groups: ${result.exactDuplicateGroups.length}`,
  `- Scrum top-level docs: ${result.scrumTopLevel.length}`,
  `- stale domain FILES.md: ${result.domainFilesSnapshots.length}`,
  `- legacy .ai/contracts docs: ${result.legacyContractRoot.length}`,
  "",
  "## Scrum top-level",
  "",
  ...result.scrumTopLevel.map((x)=>`- \`${x}\``),
  "",
  "## Exact duplicate groups",
  "",
  ...(exact.length ? exact.map((g)=>`- ${g.map((x)=>`\`${x}\``).join(" = ")}`) : ["- none"]),
  "",
  "## Broken links",
  "",
  ...(result.brokenLinks.length ? result.brokenLinks.map((x)=>`- \`${x.source}\` -> \`${x.href}\``) : ["- none"]),
  "",
  "## Orphan candidates",
  "",
  ...(result.activeOrphans.length ? result.activeOrphans.map((x)=>`- \`${x}\``) : ["- none"]),
  "",
  "> Orphan and duplicate findings are audit signals. Apply deletes only policy-approved replacements.",
  "",
].join("\n");
fs.writeFileSync(path.join(reportDir, "AI-STRUCTURE-AUDIT.md"), md, "utf8");
console.log(JSON.stringify({
  markdownFiles: result.markdownFiles,
  brokenLinks: result.brokenLinks.length,
  activeOrphans: result.activeOrphans.length,
  exactDuplicateGroups: result.exactDuplicateGroups.length,
  scrumTopLevel: result.scrumTopLevel.length,
  domainFilesSnapshots: result.domainFilesSnapshots.length,
  legacyContractRoot: result.legacyContractRoot.length,
}, null, 2));
