#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import maintenanceConfig from "../../config/maintenance.config.mjs";

const argv = process.argv.slice(2);
const command = argv[0] || "audit";
const apply = argv.includes("--apply");
const full = argv.includes("--full");
const allowTrackedNames = argv.includes("--apply-tracked-names");
const rootArg = argv.find((x, i) => i > 0 && !x.startsWith("--"));
const root = path.resolve(rootArg || ".");

const slash = (p) => p.split(path.sep).join("/");
const exists = (rel) => fs.existsSync(path.join(root, rel));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const write = (rel, value) => {
  const p = path.join(root, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, value, "utf8");
};
const run = (cmd, args, options = {}) => {
  const r = spawnSync(cmd, args, {
    cwd: root,
    encoding: "utf8",
    stdio: options.inherit ? "inherit" : "pipe",
  });
  if (!options.allowFail && r.status !== 0) {
    throw new Error(`COMMAND_FAILED ${cmd} ${args.join(" ")} exit=${r.status}\n${r.stderr || ""}`);
  }
  return r;
};

function assertRepo() {
  if (!exists(".git")) throw new Error(`NOT_GIT_REPO ${root}`);
  if (!exists("package.json")) throw new Error(`MISSING_PACKAGE_JSON ${root}`);
}

function walk(startRel = ".") {
  const out = [];
  const start = path.join(root, startRel);
  if (!fs.existsSync(start)) return out;
  const ignored = new Set(maintenanceConfig.ignoreRoots);
  const visit = (abs) => {
    const rel = slash(path.relative(root, abs));
    if (rel && [...ignored].some(x => rel === x || rel.startsWith(`${x}/`))) return;
    let st;
    try { st = fs.lstatSync(abs); } catch { return; }
    if (st.isDirectory()) {
      for (const name of fs.readdirSync(abs)) visit(path.join(abs, name));
    } else {
      out.push(rel);
    }
  };
  visit(start);
  return out;
}

function walkDirs(startRel = ".") {
  const out = [];
  const start = path.join(root, startRel);
  if (!fs.existsSync(start)) return out;
  const ignored = new Set(maintenanceConfig.ignoreRoots);
  const visit = (abs) => {
    const rel = slash(path.relative(root, abs));
    if (rel && [...ignored].some(x => rel === x || rel.startsWith(`${x}/`))) return;
    let st;
    try { st = fs.lstatSync(abs); } catch { return; }
    if (!st.isDirectory()) return;
    if (rel && rel !== ".") out.push(rel);
    for (const name of fs.readdirSync(abs)) visit(path.join(abs, name));
  };
  visit(start);
  return out;
}

function parsePorcelain() {
  // porcelain=v1 is intentionally script-oriented; -z prevents path escaping ambiguity.
  const r = run("git", ["status", "--porcelain=v1", "-z", "--untracked-files=all"]);
  const chunks = (r.stdout || "").split("\0").filter(Boolean);
  const dirty = new Map();
  for (const chunk of chunks) {
    if (chunk.length < 4) continue;
    const status = chunk.slice(0, 2);
    const rel = chunk.slice(3);
    dirty.set(slash(rel), status);
  }
  return dirty;
}

function trackedSet() {
  const r = run("git", ["ls-files", "-z"]);
  return new Set((r.stdout || "").split("\0").filter(Boolean).map(slash));
}

function claims() {
  const rel = maintenanceConfig.claimsFile;
  if (!exists(rel)) return [];
  try {
    const parsed = JSON.parse(read(rel));
    const rows = Array.isArray(parsed) ? parsed : Array.isArray(parsed.claims) ? parsed.claims : [];
    return rows.filter(x => x && (x.mode === "write" || !x.mode));
  } catch (error) {
    throw new Error(`INVALID_CLAIMS_FILE ${rel}: ${error.message}`);
  }
}

function claimedPaths() {
  const out = new Set();
  for (const c of claims()) {
    for (const p of c.paths || []) out.add(slash(p));
  }
  return out;
}

function pathIsClaimed(rel, set = claimedPaths()) {
  return [...set].some(p => rel === p || rel.startsWith(`${p}/`) || p.startsWith(`${rel}/`));
}

function sha256(rel) {
  return crypto.createHash("sha256").update(fs.readFileSync(path.join(root, rel))).digest("hex");
}

function ensureReportDir() {
  fs.mkdirSync(path.join(root, maintenanceConfig.reportDir), { recursive: true });
}

function loadPolicy() {
  const rel = maintenanceConfig.policyFile;
  if (!exists(rel)) throw new Error(`MISSING_POLICY ${rel}`);
  return JSON.parse(read(rel));
}

function taskCardInventory() {
  const base = ".ai/scrum/task-cards";
  return walk(base)
    .filter(p => p.endsWith(".md") && !p.endsWith("/README.md") && p !== `${base}/README.md`)
    .map(rel => {
      const body = read(rel);
      const id = (body.match(/^id:\s*["']?([^"' \n]+)["']?/m) || [])[1]
        || (path.basename(rel).match(/([A-Za-z]+-\d+)/) || [])[1]
        || path.basename(rel, ".md");
      const status = (body.match(/^status:\s*([A-Z_-]+)/m) || [])[1] || "UNKNOWN";
      const title = (body.match(/^#\s+(.+)$/m) || [])[1] || path.basename(rel, ".md");
      return { id, status, title, path: rel };
    });
}

function auditScrum() {
  const policy = loadPolicy();
  const dirty = parsePorcelain();
  const claimed = claimedPaths();
  const cards = taskCardInventory();
  const known = policy.taskDecisions || {};
  const rows = cards.map(card => {
    const d = known[card.id] || { decision: policy.defaultDecision || "REVIEW", destination: "", rationale: "Unknown task" };
    return {
      ...card,
      decision: d.decision,
      destination: d.destination || "",
      rationale: d.rationale || "",
      dirty: dirty.has(card.path),
      claimed: pathIsClaimed(card.path, claimed),
    };
  });
  const missingKnown = Object.entries(known)
    .filter(([, d]) => d.path && !exists(d.path))
    .map(([id, d]) => ({ id, path: d.path, decision: d.decision }));
  const unknownLive = rows.filter(r => !known[r.id]);
  return { rows, missingKnown, unknownLive };
}

function versionNameInfo(rel) {
  const b = path.basename(rel);
  const ext = path.extname(b);
  let stem = ext ? b.slice(0, -ext.length) : b;
  const original = stem;

  // Only terminal copy/version/date noise is canonicalized automatically.
  const rules = [
    [/\s*\(20\d{6}(?:[-_.]?\d{4,6})?\)$/i, ""],
    [/\s*\(\d+\)$/i, ""],
    [/(?:[-_. ](?:v|ver|version))\d+$/i, ""],
    [/(?:[-_. ])20\d{2}[-_.]?\d{2}[-_.]?\d{2}(?:[-_.]?\d{4,6})?$/i, ""],
    [/(?:[-_. ])(?:copy|copia|backup|bak|old|new|final\d*)$/i, ""],
  ];
  for (const [rx, rep] of rules) stem = stem.replace(rx, rep);
  stem = stem.replace(/[-_. ]+$/g, "");
  if (stem === original || !stem) return null;
  return { candidate: `${stem}${ext}`, original };
}

function treeHash(rel) {
  const base = path.join(root, rel);
  if (!fs.existsSync(base) || !fs.statSync(base).isDirectory()) return null;
  const h = crypto.createHash("sha256");
  const files = walk(rel).sort();
  for (const file of files) {
    h.update(slash(path.relative(rel, file)));
    h.update(fs.readFileSync(path.join(root, file)));
  }
  return h.digest("hex");
}

function junkInventory() {
  const files = walk(".");
  const dirs = walkDirs(".");
  const tracked = trackedSet();
  const dirty = parsePorcelain();
  const claimed = claimedPaths();
  const safe = [];
  const names = [];

  for (const rel of files) {
    const base = path.basename(rel);
    const isSafeName =
      maintenanceConfig.safeJunkNames.includes(base) ||
      maintenanceConfig.safeJunkSuffixes.some(s => base.endsWith(s)) ||
      base.startsWith("._");
    const isSafeGeneratedFile = maintenanceConfig.safeGeneratedFiles.includes(rel);
    if (isSafeName || isSafeGeneratedFile) {
      safe.push({
        path: rel,
        tracked: tracked.has(rel),
        dirty: dirty.has(rel),
        claimed: pathIsClaimed(rel, claimed),
      });
    }
    const rootName = rel.split("/")[0];
    const allowed = maintenanceConfig.stableNameRoots.includes(rootName);
    if (allowed) {
      const info = versionNameInfo(rel);
      if (info) {
        const dest = slash(path.join(path.dirname(rel), info.candidate));
        names.push({
          path: rel,
          destination: dest,
          tracked: tracked.has(rel),
          dirty: dirty.has(rel),
          claimed: pathIsClaimed(rel, claimed),
          destinationExists: exists(dest),
          exactDuplicate: exists(dest) && sha256(rel) === sha256(dest),
        });
      }
    }
  }
  for (const dir of maintenanceConfig.safeGeneratedDirs) {
    if (exists(dir)) {
      safe.push({
        path: dir,
        directory: true,
        tracked: false,
        dirty: false,
        claimed: pathIsClaimed(dir, claimed),
      });
    }
  }

  // Carpetas documentales/tooling con sufijos de versión/fecha/copia.
  // Una carpeta candidata prevalece sobre los archivos hijos para evitar dobles renames.
  const dirCandidates = [];
  for (const rel of dirs) {
    const rootName = rel.split("/")[0];
    if (!maintenanceConfig.stableNameRoots.includes(rootName)) continue;
    const info = versionNameInfo(rel);
    if (!info) continue;
    const dest = slash(path.join(path.dirname(rel), info.candidate));
    const containedTracked = [...tracked].some(p => p.startsWith(`${rel}/`));
    const containedDirty = [...dirty.keys()].some(p => p === rel || p.startsWith(`${rel}/`));
    const destinationExists = exists(dest);
    dirCandidates.push({
      path: rel,
      destination: dest,
      directory: true,
      tracked: containedTracked,
      dirty: containedDirty,
      claimed: pathIsClaimed(rel, claimed),
      destinationExists,
      exactDuplicate: destinationExists && treeHash(rel) === treeHash(dest),
    });
  }

  const filteredFileNames = names.filter(
    row => !dirCandidates.some(d => row.path.startsWith(`${d.path}/`)),
  );
  return { safe, names: [...dirCandidates, ...filteredFileNames] };
}

function markdownReplaceLinkToRetired(body, card, target) {
  const fileName = path.basename(card.path).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const linkRx = new RegExp(`\\[([^\\]]+)\\]\\((?:\\.\\.?\\/)*[^)\\n]*${fileName}\\)`, "g");
  if (target && /^PRT-\d+/.test(target)) {
    const targetId = target.split(",")[0];
    const targetCard = taskCardInventory().find(x => x.id === targetId);
    if (targetCard) {
      const relative = slash(path.relative(path.dirname(card.path), targetCard.path));
      const href = relative.startsWith(".") ? relative : `./${relative}`;
      return body.replace(linkRx, `[${targetId}](${href})`);
    }
  }
  return body.replace(linkRx, (m, label) => `\`${label}\` (retired; Git/evidence is provenance)`);
}

function applyScrum() {
  const { rows, unknownLive } = auditScrum();
  if (unknownLive.length) {
    throw new Error(
      `UNKNOWN_TASKS_REQUIRE_REVIEW:\n${unknownLive.map(x => `${x.id} [${x.status}] ${x.path}`).join("\n")}\n` +
      `Policy is intentionally closed. Classify these exact IDs before applying.`
    );
  }
  const claimed = claimedPaths();
  const dirty = parsePorcelain();

  const retire = rows.filter(x => ["DELETE", "MERGE_DELETE"].includes(x.decision));
  const blocked = retire.filter(x => x.claimed || x.dirty);
  if (blocked.length) {
    throw new Error(`SCRUM_APPLY_BLOCKED_BY_DIRTY_OR_CLAIM:\n${blocked.map(x => `${x.id} ${x.path} dirty=${x.dirty} claimed=${x.claimed}`).join("\n")}`);
  }

  // Install consolidated UX templates if old visual/core UX cards exist.
  const templateDir = path.join(path.dirname(fileURLToPath(import.meta.url)), "templates");
  const uxDestDir = path.join(root, ".ai/scrum/task-cards/visual-ux");
  fs.mkdirSync(uxDestDir, { recursive: true });
  if (fs.existsSync(templateDir)) {
    for (const name of fs.readdirSync(templateDir).filter(x => x.endsWith(".md"))) {
      const dest = path.join(uxDestDir, name);
      if (!fs.existsSync(dest)) fs.copyFileSync(path.join(templateDir, name), dest);
    }
  }

  // Rewrite Markdown links conservatively before deleting.
  const markdown = walk(".").filter(x => /\.(md|mdx)$/.test(x));
  for (const file of markdown) {
    if (retire.some(r => r.path === file)) continue;
    if (pathIsClaimed(file, claimed) || dirty.has(file)) continue;
    let body = read(file);
    let next = body;
    for (const card of retire) {
      if (next.includes(path.basename(card.path))) {
        next = markdownReplaceLinkToRetired(next, card, card.destination);
      }
    }
    if (next !== body) write(file, next);
  }

  for (const card of retire) {
    if (exists(card.path)) fs.rmSync(path.join(root, card.path));
  }

  // Remove now-empty task directories, but never portable-runtime / visual-ux.
  const cardRoot = path.join(root, ".ai/scrum/task-cards");
  for (const name of fs.readdirSync(cardRoot)) {
    const abs = path.join(cardRoot, name);
    if (!fs.statSync(abs).isDirectory()) continue;
    if (["portable-runtime", "visual-ux"].includes(name)) continue;
    const remaining = fs.readdirSync(abs).filter(x => x !== "README.md");
    if (remaining.length === 0) fs.rmSync(abs, { recursive: true });
  }

  // Regenerate existing architecture status/views using living repo tooling.
  const candidates = [
    ["node", ["scripts/ai/architecture/reconcile-task-statuses.mjs", ".", "--apply"]],
    ["node", ["scripts/ai/architecture/sync-architecture-views.mjs", "."]],
    ["node", ["scripts/ai/architecture/build-markdown-hubs.mjs", ".", "--apply"]],
  ];
  for (const [cmd, args] of candidates) {
    if (exists(args[0])) run(cmd, args, { inherit: true, allowFail: true });
  }
}

function cleanSafe() {
  const { safe } = junkInventory();
  const blocked = safe.filter(x => x.claimed || (x.tracked && x.dirty));
  const eligible = safe.filter(x => !x.claimed && !(x.tracked && x.dirty));
  if (!apply) return { eligible, blocked };
  for (const row of eligible) {
    const p = path.join(root, row.path);
    if (!fs.existsSync(p)) continue;
    fs.rmSync(p, { recursive: Boolean(row.directory), force: true });
  }
  return { eligible, blocked };
}

function nameReferenceFiles(row) {
  const oldToken = row.directory ? `${path.basename(row.path)}/` : path.basename(row.path);
  const files = walk(".").filter(x => /\.(md|mdx|json|ya?ml|toml|mjs|cjs|js|jsx|ts|tsx)$/.test(x));
  const hits = [];
  for (const file of files) {
    if (file === row.path || file.startsWith(`${row.path}/`)) continue;
    let body;
    try { body = read(file); } catch { continue; }
    if (body.includes(oldToken)) hits.push(file);
  }
  return { oldToken, hits };
}

function rewriteNameReferences(row, claimed, dirty) {
  const { oldToken, hits } = nameReferenceFiles(row);
  const newToken = row.directory ? `${path.basename(row.destination)}/` : path.basename(row.destination);
  const blockedRefs = hits.filter(file => pathIsClaimed(file, claimed) || dirty.has(file));
  if (blockedRefs.length) return { ok:false, blockedRefs, rewritten:[] };
  if (!apply) return { ok:true, blockedRefs:[], rewritten:hits };
  const rewritten = [];
  for (const file of hits) {
    const before = read(file);
    const after = before.split(oldToken).join(newToken);
    if (after !== before) {
      write(file, after);
      rewritten.push(file);
    }
  }
  return { ok:true, blockedRefs:[], rewritten };
}

function applyNames() {
  const { names } = junkInventory();
  const claimed = claimedPaths();
  const dirty = parsePorcelain();
  const changes = [], blocked = [];

  for (const row of names) {
    if (row.claimed || row.dirty) {
      blocked.push({ ...row, reason: "DIRTY_OR_CLAIMED" });
      continue;
    }
    if (row.tracked && !allowTrackedNames) {
      blocked.push({ ...row, reason: "TRACKED_REQUIRES_--apply-tracked-names" });
      continue;
    }
    if (row.destinationExists && !row.exactDuplicate) {
      blocked.push({ ...row, reason: "DESTINATION_CONFLICT" });
      continue;
    }

    const refs = rewriteNameReferences(row, claimed, dirty);
    if (!refs.ok) {
      blocked.push({ ...row, reason: "DIRTY_OR_CLAIMED_REFERENCE", references: refs.blockedRefs });
      continue;
    }

    if (!apply) {
      changes.push({
        ...row,
        action: row.exactDuplicate ? "DELETE_DUPLICATE" : "RENAME",
        referencesToRewrite: refs.rewritten,
      });
      continue;
    }

    const src = path.join(root, row.path);
    const dst = path.join(root, row.destination);
    if (row.exactDuplicate) {
      fs.rmSync(src, { recursive:Boolean(row.directory), force:true });
      changes.push({ ...row, action:"DELETE_DUPLICATE", rewrittenReferences:refs.rewritten });
    } else {
      fs.mkdirSync(path.dirname(dst), { recursive:true });
      fs.renameSync(src, dst);
      changes.push({ ...row, action:"RENAME", rewrittenReferences:refs.rewritten });
    }
  }
  return { changes, blocked };
}

function verify() {
  const checks = [
    ["git diff --check", "git", ["diff", "--check"]],
    ["architecture:status", "npm", ["run", "architecture", "--silent", "--", "status"]],
    ["architecture:verify", "npm", ["run", "architecture", "--silent", "--", "verify"]],
    ["ai:structure:verify", "npm", ["run", "architecture", "--silent", "--", "structure:verify"]],
    ["docs:broken-links", "npm", ["run", "docs", "--silent", "--", "validate", ".", "--check=links"]],
    ["dead-code production", "npm", ["run", "quality", "--silent", "--", "dead-code:production"]],
    ["dead-export ratchet", "npm", ["run", "quality", "--silent", "--", "dead-exports:ratchet"]],
    ["typecheck", "npx", ["tsc", "--noEmit"]],
    ["lint", "npm", ["run", "lint", "--silent"]],
  ];
  if (full) {
    checks.push(["tests", "npm", ["test"]]);
    checks.push(["build", "npm", ["run", "build"]]);
  }
  const results = [];
  for (const [name, cmd, args] of checks) {
    const pkg = JSON.parse(read("package.json"));
    if (cmd === "npm" && args[0] === "run") {
      const scriptName = args[1];
      if (!pkg.scripts?.[scriptName]) {
        results.push({ name, status: "SKIP", reason: "SCRIPT_NOT_FOUND" });
        continue;
      }
    }
    const r = run(cmd, args, { allowFail: true });
    results.push({
      name,
      status: r.status === 0 ? "PASS" : "FAIL",
      exit: r.status,
      stdout: (r.stdout || "").slice(-4000),
      stderr: (r.stderr || "").slice(-4000),
    });
  }
  return results;
}

function report(commandName, payload) {
  ensureReportDir();
  const jsonRel = `${maintenanceConfig.reportDir}/maintenance-audit.json`;
  const mdRel = `${maintenanceConfig.reportDir}/MAINTENANCE-AUDIT.md`;
  const result = {
    command: commandName,
    root,
    apply,
    head: (run("git", ["rev-parse", "HEAD"], { allowFail: true }).stdout || "").trim(),
    branch: (run("git", ["branch", "--show-current"], { allowFail: true }).stdout || "").trim(),
    ...payload,
  };
  write(jsonRel, JSON.stringify(result, null, 2) + "\n");
  const md = [
    "# Maintenance audit",
    "",
    `- command: \`${commandName}\``,
    `- mode: \`${apply ? "APPLY" : "DRY_RUN"}\``,
    `- branch: \`${result.branch}\``,
    `- head: \`${result.head}\``,
    "",
    "```json",
    JSON.stringify(payload, null, 2),
    "```",
    "",
  ].join("\n");
  write(mdRel, md);
  console.log(JSON.stringify(result, null, 2));
  return result;
}

function usage() {
  console.log(`
Usage:
  node scripts/maintenance/project-maintenance.mjs audit [root]
  node scripts/maintenance/project-maintenance.mjs scrum-plan [root]
  node scripts/maintenance/project-maintenance.mjs scrum-apply [root] --apply
  node scripts/maintenance/project-maintenance.mjs clean [root]
  node scripts/maintenance/project-maintenance.mjs clean [root] --apply
  node scripts/maintenance/project-maintenance.mjs names [root]
  node scripts/maintenance/project-maintenance.mjs names [root] --apply
  node scripts/maintenance/project-maintenance.mjs names [root] --apply --apply-tracked-names
  node scripts/maintenance/project-maintenance.mjs verify [root]
  node scripts/maintenance/project-maintenance.mjs verify [root] --full
`);
}

assertRepo();

if (command === "audit") {
  report("audit", {
    scrum: auditScrum(),
    residue: junkInventory(),
    claims: claims(),
    dirty: [...parsePorcelain()].map(([path, status]) => ({ path, status })),
  });
} else if (command === "scrum-plan") {
  report("scrum-plan", { scrum: auditScrum() });
} else if (command === "scrum-apply") {
  if (!apply) throw new Error("SCRUM_APPLY_REQUIRES_--apply");
  applyScrum();
  report("scrum-apply", { scrum: auditScrum() });
} else if (command === "clean") {
  report("clean", cleanSafe());
} else if (command === "names") {
  report("names", applyNames());
} else if (command === "verify") {
  const results = verify();
  report("verify", { results });
  if (results.some(x => x.status === "FAIL")) process.exitCode = 1;
} else {
  usage();
  process.exitCode = 2;
}
