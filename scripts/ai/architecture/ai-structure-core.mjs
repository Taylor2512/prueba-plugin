import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { spawnSync } from "node:child_process";

export const slash = (p) => p.split(path.sep).join("/");
export const exists = (p) => fs.existsSync(p);
export const read = (p) => fs.readFileSync(p, "utf8");
export const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");

export function walk(dir, options = {}, out = []) {
  if (!fs.existsSync(dir)) return out;
  const ignore = new Set(options.ignore || [
    ".git","node_modules","dist","coverage","test-results","playwright-report",".vite",".cache"
  ]);
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (ignore.has(e.name)) continue;
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, options, out);
    else out.push(p);
  }
  return out;
}

export function loadPolicy(root) {
  return JSON.parse(read(path.join(root, "config/tooling/ai-structure-policy.json")));
}

export function ensureDir(p) { fs.mkdirSync(p, { recursive: true }); }

export function backupFile(root, file, policy) {
  if (!fs.existsSync(file) || !fs.statSync(file).isFile()) return null;
  const backupRoot = path.join(path.dirname(root), `${path.basename(root)}.${policy.backupSuffix}`);
  const rel = path.relative(root, file);
  const dst = path.join(backupRoot, rel);
  ensureDir(path.dirname(dst));
  const src = fs.readFileSync(file);
  if (!fs.existsSync(dst)) {
    fs.writeFileSync(dst, src);
  }
  // The backup root preserves the first pre-cleanup version. A file may be
  // rewritten and then deleted in the same transaction; never replace the
  // original backup with the intermediate rewritten content.
  return dst;
}

export function safeWrite(root, rel, content, policy) {
  const dst = path.join(root, rel);
  if (fs.existsSync(dst)) backupFile(root, dst, policy);
  ensureDir(path.dirname(dst));
  fs.writeFileSync(dst, content.endsWith("\n") ? content : `${content}\n`, "utf8");
}

export function safeRemove(root, rel, policy) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return false;
  if (fs.statSync(p).isDirectory()) {
    const entries = fs.readdirSync(p);
    if (entries.length) throw new Error(`REFUSE_NONEMPTY_DIRECTORY_REMOVE ${rel}`);
    fs.rmdirSync(p);
    return true;
  }
  backupFile(root, p, policy);
  fs.unlinkSync(p);
  return true;
}

export function safeMove(root, fromRel, toRel, policy) {
  const from = path.join(root, fromRel), to = path.join(root, toRel);
  if (!fs.existsSync(from)) return { status: "missing" };
  if (!fs.statSync(from).isFile()) return { status: "not-file" };
  backupFile(root, from, policy);
  ensureDir(path.dirname(to));
  if (fs.existsSync(to)) {
    const a = fs.readFileSync(from), b = fs.readFileSync(to);
    if (Buffer.compare(a, b) === 0) {
      fs.unlinkSync(from);
      return { status: "dedup-identical" };
    }
    throw new Error(`MOVE_TARGET_CONFLICT ${fromRel} -> ${toRel}`);
  }
  fs.renameSync(from, to);
  return { status: "moved" };
}

export function activeWriteClaims(root) {
  const file = path.join(root, ".ai/ops/coordination/claims.json");
  if (!fs.existsSync(file)) return [];
  try {
    const data = JSON.parse(read(file));
    return Object.values(data).filter((x) => x && x.mode !== "review");
  } catch {
    return [{ agent: "unknown", task: "invalid-claims-json" }];
  }
}

export function markdownFiles(root) {
  return walk(path.join(root, ".ai")).filter((p) => /\.mdx?$/i.test(p));
}

export function normalizeMarkdown(text) {
  return text
    .replace(/<!-- project-tools:navigation:start -->[\s\S]*?<!-- project-tools:navigation:end -->/g, "")
    .replace(/<!-- sisad-architecture-hub:start -->[\s\S]*?<!-- sisad-architecture-hub:end -->/g, "")
    .replace(/<!-- ai-structure:navigation:start -->[\s\S]*?<!-- ai-structure:navigation:end -->/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

export function titleOf(text, fallback) {
  return text.match(/^#\s+(.+)$/m)?.[1]?.trim() || fallback;
}

export function resolveMarkdownTarget(root, sourceFile, href) {
  const raw = href.trim();
  if (!raw || /^[a-z]+:\/\//i.test(raw) || raw.startsWith("mailto:") || raw.startsWith("#")) return null;
  const noHash = raw.split("#")[0].split("?")[0];
  if (!noHash) return null;
  const decoded = decodeURIComponent(noHash);
  const abs = decoded.startsWith("/")
    ? path.join(root, decoded.replace(/^\/+/, ""))
    : path.resolve(path.dirname(sourceFile), decoded);
  return abs;
}

export function scanGraph(root) {
  const files = markdownFiles(root);
  const set = new Set(files.map((p) => path.resolve(p)));
  const incoming = new Map(files.map((p) => [path.resolve(p), new Set()]));
  const broken = [];
  const linkRe = /(?<!!)\[[^\]]+\]\(([^)]+)\)/g;
  for (const file of files) {
    const text = read(file);
    for (const m of text.matchAll(linkRe)) {
      const target = resolveMarkdownTarget(root, file, m[1]);
      if (!target) continue;
      const abs = path.resolve(target);
      if (set.has(abs)) incoming.get(abs).add(path.resolve(file));
      else if (m[1].split("#")[0].match(/\.mdx?$/i)) {
        broken.push({
          source: slash(path.relative(root, file)),
          href: m[1],
          resolved: slash(path.relative(root, abs)),
        });
      }
    }
  }
  const exempt = new Set([
    ".ai/README.md",".ai/START.md",".ai/ROUTER.md",".ai/brain/HOME.md",".ai/brain/README.md"
  ]);
  const orphans = [];
  for (const file of files) {
    const rel = slash(path.relative(root, file));
    if (exempt.has(rel)) continue;
    if (rel.startsWith(".ai/index/") || rel.startsWith(".ai/cache/")) continue;
    if ((incoming.get(path.resolve(file))?.size || 0) === 0) orphans.push(rel);
  }
  return { files, incoming, broken, orphans };
}

export function duplicateAudit(root) {
  const groups = new Map();
  for (const file of markdownFiles(root)) {
    const rel = slash(path.relative(root, file));
    if (rel.startsWith(".ai/index/") || rel.startsWith(".ai/archive/")) continue;
    const h = sha(Buffer.from(normalizeMarkdown(read(file))));
    if (!groups.has(h)) groups.set(h, []);
    groups.get(h).push(rel);
  }
  return [...groups.values()].filter((x) => x.length > 1);
}

export function mergeAliasMap(root, moves) {
  const file = path.join(root, "config/tooling/architecture-path-aliases.json");
  let data = { aliases: [] };
  if (fs.existsSync(file)) {
    try { data = JSON.parse(read(file)); } catch {}
  }
  const map = new Map((data.aliases || []).map((x) => [x.from, x.to]));
  for (const [from, to] of Object.entries(moves)) {
    const existing = map.get(from);
    if (existing && existing !== from && existing !== to) {
      throw new Error(`ALIAS_CONFLICT ${from}: ${existing} != ${to}`);
    }
    map.set(from, to);
  }
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, JSON.stringify({
    ...data,
    aliases: [...map.entries()]
      .map(([from, to]) => ({ from, to }))
      .sort((a,b) => a.from.localeCompare(b.from)),
  }, null, 2) + "\n");
}

export function rewriteReferences(root, replacements, policy) {
  const allowed = new Set([".md",".mdx",".json",".jsonl",".js",".jsx",".ts",".tsx",".mjs",".cjs",".toml",".yaml",".yml"]);
  const files = walk(root).filter((p) => allowed.has(path.extname(p).toLowerCase()));
  const changed = [];
  const linkRe = /(?<!!)\[([^\]]+)\]\(([^)]+)\)/g;

  for (const file of files) {
    const relFile = slash(path.relative(root, file));
    if (relFile.startsWith(".ai/archive/")) continue;
    let text;
    try { text = read(file); } catch { continue; }
    const before = text;

    // Rewrite Markdown relative links by resolved target.
    if (/\.mdx?$/i.test(file)) {
      text = text.replace(linkRe, (full, label, href) => {
        const hash = href.includes("#") ? `#${href.split("#").slice(1).join("#")}` : "";
        const target = resolveMarkdownTarget(root, file, href);
        if (!target) return full;
        const targetRel = slash(path.relative(root, target));
        const replacement = replacements[targetRel];
        if (!replacement) return full;
        const newAbs = path.join(root, replacement);
        let newHref = slash(path.relative(path.dirname(file), newAbs));
        if (!newHref.startsWith(".")) newHref = `./${newHref}`;
        return `[${label}](${newHref}${hash})`;
      });
    }

    // Rewrite literal stable paths in code fences/config/docs.
    for (const [from, to] of Object.entries(replacements)) {
      text = text.split(from).join(to);
    }

    if (text !== before) {
      if (file.startsWith(path.join(root, ".ai"))) backupFile(root, file, policy);
      fs.writeFileSync(file, text, "utf8");
      changed.push(relFile);
    }
  }
  return changed;
}

export function upsertManaged(text, marker, body) {
  const start = `<!-- ${marker}:start -->`, end = `<!-- ${marker}:end -->`;
  const block = `${start}\n${body.trim()}\n${end}`;
  const a = text.indexOf(start), b = text.indexOf(end);
  if ((a >= 0) !== (b >= 0) || (a >= 0 && b < a)) throw new Error(`MALFORMED_MARKER ${marker}`);
  if (a >= 0) return text.slice(0, a) + block + text.slice(b + end.length);
  return `${text.trimEnd()}${text.trim() ? "\n\n" : ""}${block}\n`;
}

export function buildHierarchicalNavigation(root, policy) {
  const aiRoot = path.join(root, ".ai");
  const dirs = new Set([aiRoot]);
  for (const file of markdownFiles(root)) {
    let d = path.dirname(file);
    while (d.startsWith(aiRoot)) {
      dirs.add(d);
      if (d === aiRoot) break;
      d = path.dirname(d);
    }
  }

  const changed = [];
  for (const dir of [...dirs].sort((a,b) => b.length - a.length)) {
    const relDir = slash(path.relative(root, dir));
    if (relDir.startsWith(".ai/cache/")) continue;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const childrenDirs = entries
      .filter((e) => e.isDirectory() && ![".mutex"].includes(e.name))
      .sort((a,b) => a.name.localeCompare(b.name));
    const docs = entries
      .filter((e) => e.isFile() && /\.mdx?$/i.test(e.name) && e.name.toLowerCase() !== "readme.md")
      .sort((a,b) => a.name.localeCompare(b.name));

    if (!childrenDirs.length && !docs.length) continue;
    const readme = path.join(dir, "README.md");
    const current = fs.existsSync(readme) ? read(readme) : `# ${path.basename(dir) || ".ai"}\n`;
    const lines = ["## Navigation", ""];
    for (const e of childrenDirs) {
      if (["node_modules",".git"].includes(e.name)) continue;
      const childReadme = path.join(dir, e.name, "README.md");
      if (fs.existsSync(childReadme)) lines.push(`- [${e.name}](./${e.name}/README.md)`);
      else lines.push(`- \`${e.name}/\``);
    }
    for (const e of docs) {
      const p = path.join(dir, e.name);
      lines.push(`- [${titleOf(read(p), e.name.replace(/\.mdx?$/i,""))}](./${e.name})`);
    }
    lines.push("", "> Generated navigation. Source content outside this block remains manual.");
    const next = upsertManaged(current, "ai-structure:navigation", lines.join("\n"));
    if (next !== current) {
      if (fs.existsSync(readme)) backupFile(root, readme, policy);
      fs.writeFileSync(readme, next, "utf8");
      changed.push(slash(path.relative(root, readme)));
    }
  }
  return changed;
}

export function runNode(root, rel, args = [], allowFail = false) {
  const p = path.join(root, rel);
  if (!fs.existsSync(p)) return { skipped: true, status: 0 };
  const r = spawnSync(process.execPath, [p, ...args], { encoding: "utf8", cwd: root });
  if (r.stdout) process.stdout.write(r.stdout);
  if (r.stderr) process.stderr.write(r.stderr);
  if (r.status !== 0 && !allowFail) throw new Error(`COMMAND_FAILED ${rel} exit=${r.status}`);
  return { skipped: false, status: r.status ?? 0 };
}
