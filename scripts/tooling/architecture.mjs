import fs from "node:fs";
import path from "node:path";
import {
  atomicWrite,
  backupPath,
  ensureDir,
  externalBackupRoot,
  normalizeRelative,
  readTextSafe,
  relative,
  removeRecursive,
  sha256File,
  walkFiles,
  writeJson,
} from "./core.mjs";
import {
  canonicalizeArchitecturePath,
  hasVersionToken,
  jaccard,
  markdownLinks,
  markdownMetadata,
  normalizedContentHash,
  relativeMarkdownLink,
  resolveMarkdownLink,
  shingles,
  splitFrontmatter,
  upsertManagedNavigation,
  words,
} from "./markdown.mjs";

function markdownFiles(root, config) {
  return walkFiles(root, {
    roots: config.paths.markdownRoots,
    extensions: config.markdown.extensions,
    config,
  });
}

function topLevelArchitectureFiles(root, config) {
  if (!fs.existsSync(root)) return [];
  return fs.readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => path.join(root, entry.name))
    .filter((abs) =>
      config.paths.topLevelArchitectureExtensions.includes(
        path.extname(abs).toLowerCase(),
      ),
    );
}

function architectureFiles(root, config) {
  return [...new Set([
    ...walkFiles(root, {
      roots: config.paths.architectureRoots,
      includeGenerated: true,
      config,
    }),
    ...topLevelArchitectureFiles(root, config),
  ])].sort();
}

function residuePlan(root, config) {
  const items = [];

  for (const name of config.residue.directories) {
    const abs = path.join(root, name);
    if (fs.existsSync(abs)) items.push({ path: name, kind: "directory" });
  }

  for (const name of config.residue.rootFiles) {
    const abs = path.join(root, name);
    if (fs.existsSync(abs)) items.push({ path: name, kind: "file" });
  }

  return items;
}

export function scanArchitecture(root, config) {
  const files = architectureFiles(root, config);

  const markdown = markdownFiles(root, config);
  const versioned = files
    .map((abs) => relative(root, abs))
    .filter((rel) => !config.naming.operationalIdentityPatterns.some((pattern) => {
      pattern.lastIndex = 0;
      return pattern.test(rel);
    }))
    .filter((rel) => hasVersionToken(rel, config));

  return {
    root,
    fileCount: files.length,
    markdownCount: markdown.length,
    versionedPaths: versioned,
  };
}

export function sanitizePlan(root, config) {
  const files = architectureFiles(root, config);

  const planned = [];
  const destinationGroups = new Map();

  for (const abs of files) {
    const from = relative(root, abs);
    const to = canonicalizeArchitecturePath(from, config);
    if (to === from) continue;

    const item = { from, to, kind: "rename" };
    planned.push(item);

    if (!destinationGroups.has(to)) destinationGroups.set(to, []);
    destinationGroups.get(to).push(item);
  }

  const conflicts = [];
  const duplicates = [];
  const safe = [];

  for (const item of planned) {
    const sourceAbs = path.join(root, item.from);
    const targetAbs = path.join(root, item.to);
    const group = destinationGroups.get(item.to) || [];

    if (group.length > 1) {
      const hashes = new Map();
      for (const candidate of group) {
        const candidateAbs = path.join(root, candidate.from);
        const hash = sha256File(candidateAbs);
        if (!hashes.has(hash)) hashes.set(hash, []);
        hashes.get(hash).push(candidate);
      }

      if (hashes.size === 1) {
        duplicates.push({ to: item.to, sources: group.map((x) => x.from) });
      } else {
        conflicts.push({
          to: item.to,
          sources: group.map((x) => x.from),
          reason: "multiple-versioned-files-differ",
          details: group.map((x) => {
            const abs = path.join(root, x.from);
            const text = readTextSafe(abs);
            return {
              path: x.from,
              sha256: sha256File(abs),
              lines: text ? text.split(/\r?\n/).length : 0,
            };
          }),
          resolution: "Merge the divergent content into the stable target, then remove versioned sources.",
        });
      }
      continue;
    }

    if (fs.existsSync(targetAbs)) {
      const same = sha256File(sourceAbs) === sha256File(targetAbs);
      if (same) {
        duplicates.push({ to: item.to, sources: [item.from, item.to] });
      } else {
        conflicts.push({
          to: item.to,
          sources: [item.from, item.to],
          reason: "canonical-target-differs",
          details: [item.from, item.to].map((rel) => {
            const abs = path.join(root, rel);
            const text = readTextSafe(abs);
            return {
              path: rel,
              sha256: sha256File(abs),
              lines: text ? text.split(/\r?\n/).length : 0,
            };
          }),
          resolution: "Review/merge both files into the stable target. Do not auto-delete divergent Markdown.",
        });
      }
      continue;
    }

    safe.push(item);
  }

  return {
    safe,
    duplicates,
    conflicts,
    residue: residuePlan(root, config),
  };
}

export function applySanitize(root, config, {
  apply = false,
  backupRoot = null,
} = {}) {
  const plan = sanitizePlan(root, config);
  const backup = backupRoot || externalBackupRoot(
    root,
    config.import.externalBackupSuffix,
  );

  if (!apply) return { ...plan, plannedBackup: backup, applied: [] };

  if (plan.conflicts.length) {
    return {
      ...plan,
      backup: null,
      applied: [],
      rewrittenMarkdown: [],
      blocked: true,
      message: "No changes applied because divergent canonicalization conflicts must be resolved first.",
    };
  }

  let backupCreated = false;
  const ensureBackup = () => {
    if (!backupCreated) {
      ensureDir(backup);
      backupCreated = true;
    }
  };

  const applied = [];

  for (const item of plan.residue) {
    const abs = path.join(root, item.path);
    if (!fs.existsSync(abs)) continue;
    ensureBackup();
    backupPath(root, backup, item.path);
    removeRecursive(abs);
    applied.push({ action: "remove-package-residue", path: item.path });
  }

  // Identical duplicate families: preserve one canonical path, backup all removed sources.
  for (const cluster of plan.duplicates) {
    const canonicalAbs = path.join(root, cluster.to);
    const existingCanonical = fs.existsSync(canonicalAbs);

    let sourceToKeep = existingCanonical
      ? cluster.to
      : cluster.sources.find((source) => source !== cluster.to) || cluster.sources[0];

    if (!existingCanonical) {
      const fromAbs = path.join(root, sourceToKeep);
      ensureBackup();
      backupPath(root, backup, sourceToKeep);
      ensureDir(path.dirname(canonicalAbs));
      fs.renameSync(fromAbs, canonicalAbs);
      applied.push({ action: "rename", from: sourceToKeep, to: cluster.to });
    }

    for (const source of cluster.sources) {
      if (source === cluster.to || source === sourceToKeep) continue;
      const sourceAbs = path.join(root, source);
      if (!fs.existsSync(sourceAbs)) continue;
      ensureBackup();
      backupPath(root, backup, source);
      removeRecursive(sourceAbs);
      applied.push({ action: "remove-identical-duplicate", path: source });
    }
  }

  for (const item of plan.safe) {
    const fromAbs = path.join(root, item.from);
    const toAbs = path.join(root, item.to);
    if (!fs.existsSync(fromAbs)) continue;

    ensureBackup();
    backupPath(root, backup, item.from);
    ensureDir(path.dirname(toAbs));
    fs.renameSync(fromAbs, toAbs);
    applied.push({ action: "rename", from: item.from, to: item.to });
  }

  const renameMap = new Map();
  for (const item of applied) {
    if (item.action === "rename") renameMap.set(item.from, item.to);
  }
  for (const cluster of plan.duplicates) {
    for (const source of cluster.sources) {
      if (source !== cluster.to) renameMap.set(source, cluster.to);
    }
  }

  const rewrittenMarkdown = rewriteReferencesAfterRenames(
    root,
    config,
    renameMap,
    backup,
    ensureBackup,
  );

  pruneEmptyDirectories(root, config);

  return {
    ...plan,
    backup: backupCreated ? backup : null,
    applied,
    rewrittenMarkdown,
    blocked: false,
  };
}


function candidateOldTargets(oldFromRel, rawTarget) {
  const target = rawTarget.replace(/\\/g, "/");
  const base = path.posix.normalize(
    path.posix.join(path.posix.dirname(oldFromRel), target),
  ).replace(/^\.\//, "");

  return [
    base,
    `${base}.md`,
    `${base}.mdx`,
    path.posix.join(base, "README.md"),
  ];
}

function rewriteReferencesAfterRenames(root, config, renameMap, backup, ensureBackup) {
  if (!renameMap.size) return [];

  const reverseMap = new Map([...renameMap].map(([from, to]) => [to, from]));
  const markdown = markdownFiles(root, config);
  const changed = [];

  for (const abs of markdown) {
    const currentRel = relative(root, abs);
    const oldFromRel = reverseMap.get(currentRel) || currentRel;
    const current = readTextSafe(abs);

    let next = current.replace(
      /(?<!!)(\[[^\]]*]\()([^)]+)(\))/g,
      (full, prefix, rawInside, suffix) => {
        const titleMatch = rawInside.match(/^(\S+?)(\s+["'][^"']*["'])?$/);
        if (!titleMatch) return full;

        const rawHref = titleMatch[1];
        if (/^(?:https?:|mailto:|tel:|#)/i.test(rawHref)) return full;

        const [rawTarget, fragment = ""] = rawHref.split("#", 2);
        let decoded = rawTarget;
        try {
          decoded = decodeURIComponent(rawTarget);
        } catch {
          // Keep undecoded target.
        }

        const oldTarget = candidateOldTargets(oldFromRel, decoded)
          .find((candidate) => renameMap.has(candidate));
        if (!oldTarget) return full;

        const newTargetRel = renameMap.get(oldTarget);
        let href = path.posix.relative(path.posix.dirname(currentRel), newTargetRel);
        if (!href.startsWith(".")) href = `./${href}`;
        if (fragment) href += `#${fragment}`;

        const title = titleMatch[2] || "";
        return `${prefix}${href}${title}${suffix}`;
      },
    );

    // Repository-relative literals in code spans or prose are also updated.
    for (const [from, to] of renameMap) {
      if (from === to) continue;
      next = next.split(from).join(to);
    }

    if (next !== current) {
      ensureBackup();
      backupPath(root, backup, currentRel);
      atomicWrite(abs, next);
      changed.push(currentRel);
    }
  }

  return changed;
}

function pruneEmptyDirectories(root, config) {
  const candidates = config.naming.scope
    .map((rel) => path.join(root, rel))
    .filter((abs) => fs.existsSync(abs) && fs.statSync(abs).isDirectory());

  function visit(dir) {
    for (const entry of fs.readdirSync(dir)) {
      const child = path.join(dir, entry);
      if (fs.statSync(child).isDirectory()) visit(child);
    }

    if (dir === root) return;
    if (!fs.existsSync(dir)) return;
    if (fs.readdirSync(dir).length === 0) {
      fs.rmdirSync(dir);
    }
  }

  for (const dir of candidates) visit(dir);
}

function buildDuplicateReport(root, config, markdown) {
  const exactByHash = new Map();
  const versionFamily = new Map();

  for (const abs of markdown) {
    const text = readTextSafe(abs);
    const hash = normalizedContentHash(text, config);
    const rel = relative(root, abs);
    if (!exactByHash.has(hash)) exactByHash.set(hash, []);
    exactByHash.get(hash).push(rel);

    const canonical = canonicalizeArchitecturePath(rel, config);
    if (!versionFamily.has(canonical)) versionFamily.set(canonical, []);
    versionFamily.get(canonical).push(abs);
  }

  const exact = [...exactByHash.entries()]
    .filter(([, paths]) => paths.length > 1)
    .map(([hash, paths]) => ({ hash, paths }));

  const near = [];
  for (const [canonical, files] of versionFamily) {
    if (files.length < 2) continue;

    for (let i = 0; i < files.length; i += 1) {
      const aText = readTextSafe(files[i]);
      if (words(aText).length < config.markdown.nearDuplicateMinWords) continue;
      const a = shingles(aText);

      for (let j = i + 1; j < files.length; j += 1) {
        const bText = readTextSafe(files[j]);
        if (words(bText).length < config.markdown.nearDuplicateMinWords) continue;
        const score = jaccard(a, shingles(bText));
        if (score >= config.markdown.nearDuplicateThreshold && score < 1) {
          near.push({
            canonical,
            a: relative(root, files[i]),
            b: relative(root, files[j]),
            score: Number(score.toFixed(4)),
          });
        }
      }
    }
  }

  return { exact, near };
}

export function buildMarkdownIndex(root, config) {
  const markdown = markdownFiles(root, config);
  const mdSet = new Set(markdown.map((file) => path.resolve(file)));
  const nodes = markdown.map((abs) => markdownMetadata(root, abs, config));
  const edges = [];
  const broken = [];

  for (const abs of markdown) {
    const from = relative(root, abs);
    for (const link of markdownLinks(readTextSafe(abs))) {
      const resolved = resolveMarkdownLink(root, abs, link.target);
      if (!resolved) {
        broken.push({ from, target: link.target });
        continue;
      }
      if (!mdSet.has(path.resolve(resolved))) continue;
      edges.push({ from, to: relative(root, resolved), fragment: link.fragment || null });
    }
  }

  const incoming = new Map();
  for (const edge of edges) {
    incoming.set(edge.to, (incoming.get(edge.to) || 0) + 1);
  }

  for (const node of nodes) node.incoming = incoming.get(node.path) || 0;
  const orphanPolicy = config.markdown.orphanPolicy || {};
  const trackedPrefixes = orphanPolicy.trackedPrefixes || [];
  const exemptPaths = orphanPolicy.exemptPaths || new Set();

  const indexedDirs = new Set(
    nodes
      .filter((node) => /^(?:README|HOME)\.md$/i.test(path.basename(node.path)))
      .map((node) => path.posix.dirname(node.path)),
  );

  const shouldTrackOrphan = (node) => {
    if (node.incoming !== 0) return false;
    if (/^(?:README|HOME)\.md$/i.test(path.basename(node.path))) return false;
    if (exemptPaths.has(node.path)) return false;
    if (trackedPrefixes.length && !trackedPrefixes.some((prefix) => node.path.startsWith(prefix))) {
      return false;
    }
    if (orphanPolicy.requireParentIndex && !indexedDirs.has(path.posix.dirname(node.path))) {
      return false;
    }
    return true;
  };

  const orphans = nodes.filter(shouldTrackOrphan);

  const duplicateReport = buildDuplicateReport(root, config, markdown);

  const indexRoot = path.join(root, config.paths.indexRoot);
  const reportRoot = path.join(root, config.paths.reportRoot);
  ensureDir(indexRoot);
  ensureDir(reportRoot);

  atomicWrite(
    path.join(indexRoot, "markdown.jsonl"),
    nodes.map((row) => JSON.stringify(row)).join("\n") + "\n",
  );
  atomicWrite(
    path.join(indexRoot, "links.jsonl"),
    edges.map((row) => JSON.stringify(row)).join("\n") + "\n",
  );
  atomicWrite(
    path.join(indexRoot, "broken-links.jsonl"),
    broken.map((row) => JSON.stringify(row)).join("\n") + (broken.length ? "\n" : ""),
  );
  atomicWrite(
    path.join(indexRoot, "orphans.jsonl"),
    orphans.map((row) => JSON.stringify(row)).join("\n") + (orphans.length ? "\n" : ""),
  );
  writeJson(path.join(indexRoot, "duplicates.json"), duplicateReport);

  const summary = {
    markdown: nodes.length,
    links: edges.length,
    brokenLinks: broken.length,
    orphans: orphans.length,
    exactDuplicateClusters: duplicateReport.exact.length,
    nearDuplicates: duplicateReport.near.length,
    versionedPaths: nodes.filter((node) => node.versionedPath).length,
  };

  writeJson(path.join(reportRoot, "summary.json"), summary);

  return {
    nodes,
    edges,
    broken,
    orphans,
    duplicates: duplicateReport,
    summary,
  };
}

export function applyReadmeNavigation(root, config, { apply = false } = {}) {
  const markdown = markdownFiles(root, config);
  const byDir = new Map();

  for (const file of markdown) {
    const dir = path.dirname(file);
    if (!byDir.has(dir)) byDir.set(dir, []);
    byDir.get(dir).push(file);
  }

  const changes = [];

  for (const [dir, files] of byDir) {
    const readme = files.find((file) => /(?:README|HOME)\.md$/i.test(path.basename(file)));
    if (!readme) continue;

    const childNotes = files
      .filter((file) => file !== readme)
      .sort()
      .map((file) => {
        const meta = markdownMetadata(root, file, config);
        return `- [${meta.title}](${relativeMarkdownLink(readme, file)})`;
      });

    const childDirs = [...byDir.keys()]
      .filter((candidate) => path.dirname(candidate) === dir && candidate !== dir)
      .map((candidate) => {
        const entry = (byDir.get(candidate) || [])
          .find((file) => /(?:README|HOME)\.md$/i.test(path.basename(file)));
        if (!entry) return null;
        const meta = markdownMetadata(root, entry, config);
        return `- [${meta.title}](${relativeMarkdownLink(readme, entry)})`;
      })
      .filter(Boolean)
      .sort();

    const lines = [
      "## Navegación generada",
      "",
      ...(childDirs.length ? ["### Secciones", "", ...childDirs, ""] : []),
      ...(childNotes.length ? ["### Notas", "", ...childNotes] : []),
    ];

    const current = readTextSafe(readme);
    const next = upsertManagedNavigation(current, lines.join("\n"), config);

    if (next !== current) {
      changes.push({ path: relative(root, readme) });
      if (apply) atomicWrite(readme, next);
    }
  }

  return { changes };
}

export function validateArchitecture(root, config) {
  const index = buildMarkdownIndex(root, config);
  const scan = scanArchitecture(root, config);

  const ids = new Map();
  const duplicateIds = [];

  for (const node of index.nodes) {
    if (!node.id) continue;
    if (ids.has(node.id)) {
      duplicateIds.push({ id: node.id, paths: [ids.get(node.id), node.path] });
    } else {
      ids.set(node.id, node.path);
    }
  }

  const errors = [];

  for (const versioned of scan.versionedPaths) {
    errors.push({
      type: "versioned-path",
      path: versioned,
      message: "Architecture paths must use stable semantic names.",
    });
  }

  for (const item of index.broken) {
    errors.push({
      type: "broken-link",
      path: item.from,
      message: `Broken Markdown link: ${item.target}`,
    });
  }

  for (const item of duplicateIds) {
    errors.push({
      type: "duplicate-id",
      path: item.paths.join(", "),
      message: `Duplicate Markdown id: ${item.id}`,
    });
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings: [
      ...index.duplicates.near.map((item) => ({
        type: "near-duplicate",
        path: `${item.a} <> ${item.b}`,
        message: `Near duplicate score ${item.score}`,
      })),
      ...index.orphans.map((item) => ({
        type: "orphan",
        path: item.path,
        message: "Markdown note has no incoming relative links.",
      })),
    ],
    summary: index.summary,
  };
}
