import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import {
  atomicWrite,
  backupPath,
  copyRecursive,
  ensureDir,
  externalBackupRoot,
  normalizeRelative,
  readTextSafe,
  relative,
  sha256File,
  timestamp,
  walkFiles,
} from "./core.mjs";
import { canonicalizeArchitecturePath } from "./markdown.mjs";

function commandExists(command) {
  const check = process.platform === "win32" ? "where" : "which";
  return spawnSync(check, [command], { stdio: "ignore" }).status === 0;
}

function listArchiveEntries(archive) {
  if (commandExists("tar")) {
    const result = spawnSync("tar", ["-tf", archive], { encoding: "utf8" });
    if (result.status === 0) return result.stdout.split(/\r?\n/).filter(Boolean);
  }
  if (process.platform !== "win32" && commandExists("unzip")) {
    const result = spawnSync("unzip", ["-Z1", archive], { encoding: "utf8" });
    if (result.status === 0) return result.stdout.split(/\r?\n/).filter(Boolean);
  }
  return null;
}

function assertSafeArchiveEntries(entries) {
  for (const entry of entries) {
    const normalized = entry.replace(/\\/g, "/");
    if (
      normalized.startsWith("/") ||
      /^[A-Za-z]:\//.test(normalized) ||
      normalized.split("/").includes("..")
    ) {
      throw new Error(`Unsafe archive entry: ${entry}`);
    }
  }
}

function extractZip(source) {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "project-architecture-import-"));
  const entries = listArchiveEntries(source);

  if (!entries) {
    throw new Error(
      "Cannot inspect ZIP. Install/enable 'tar' (Windows/macOS include it) or use a source folder.",
    );
  }
  assertSafeArchiveEntries(entries);

  if (process.platform !== "win32" && commandExists("unzip")) {
    const result = spawnSync("unzip", ["-q", source, "-d", temp], { stdio: "ignore" });
    if (result.status === 0) return temp;
  }

  if (commandExists("tar")) {
    const result = spawnSync("tar", ["-xf", source, "-C", temp], { stdio: "ignore" });
    if (result.status === 0) return temp;
  }

  fs.rmSync(temp, { recursive: true, force: true });
  throw new Error("Failed to extract ZIP.");
}

function collapseSingleRoot(sourceRoot) {
  const entries = fs.readdirSync(sourceRoot).filter((name) => name !== ".DS_Store");
  if (entries.length !== 1) return sourceRoot;

  const name = entries[0];
  const architectureRoots = new Set([
    ".ai",
    "docs",
    "scripts",
    "tools",
    ".claude",
    ".codex",
    ".agents",
    ".github",
  ]);
  if (architectureRoots.has(name)) return sourceRoot;

  const candidate = path.join(sourceRoot, name);
  if (fs.statSync(candidate).isDirectory()) return candidate;
  return sourceRoot;
}

function shouldInclude(rel, config) {
  const normalized = normalizeRelative(rel);

  if (config.import.generatedPrefixes.some(
    (prefix) => normalized === prefix.slice(0, -1) || normalized.startsWith(prefix),
  )) return false;

  return config.import.includeRoots.some((root) => {
    if (root.endsWith(".md")) return normalized === root;
    return normalized === root || normalized.startsWith(`${root}/`);
  });
}


function incomingCandidates(rawFromRel, rawTarget) {
  const normalizedTarget = rawTarget.replace(/\\/g, "/");
  const base = path.posix.normalize(
    path.posix.join(path.posix.dirname(rawFromRel), normalizedTarget),
  ).replace(/^\.\//, "");

  return [
    base,
    `${base}.md`,
    `${base}.mdx`,
    path.posix.join(base, "README.md"),
  ];
}

function rewriteIncomingMarkdown(text, rawFromRel, targetRel, incomingMap) {
  let next = text.replace(
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
        // Keep raw target.
      }

      const oldTarget = incomingCandidates(rawFromRel, decoded)
        .find((candidate) => incomingMap.has(candidate));
      if (!oldTarget) return full;

      const newTarget = incomingMap.get(oldTarget);
      let href = path.posix.relative(path.posix.dirname(targetRel), newTarget);
      if (!href.startsWith(".")) href = `./${href}`;
      if (fragment) href += `#${fragment}`;

      return `${prefix}${href}${titleMatch[2] || ""}${suffix}`;
    },
  );

  for (const [from, to] of incomingMap) {
    if (from === to) continue;
    next = next.split(from).join(to);
  }

  return next;
}

function copyIncoming(sourceFile, targetFile, rawRel, targetRel, incomingMap) {
  const ext = path.extname(sourceFile).toLowerCase();
  if (ext === ".md" || ext === ".mdx") {
    const text = fs.readFileSync(sourceFile, "utf8");
    atomicWrite(
      targetFile,
      rewriteIncomingMarkdown(text, rawRel, targetRel, incomingMap),
    );
    return;
  }

  ensureDir(path.dirname(targetFile));
  copyIncoming(
            sourceFile,
            targetFile,
            rawRel,
            rel,
            incomingMap,
          );
}

export function importArchitecture(repoRoot, config, {
  source,
  apply = false,
  conflictPolicy = config.import.defaultConflictPolicy,
} = {}) {
  if (!source) {
    throw new Error("Missing --source=<folder-or-zip>.");
  }

  const sourceAbs = path.resolve(source);
  if (!fs.existsSync(sourceAbs)) throw new Error(`Source not found: ${sourceAbs}`);

  let extracted = null;
  let workingSource = sourceAbs;

  if (fs.statSync(sourceAbs).isFile()) {
    if (path.extname(sourceAbs).toLowerCase() !== ".zip") {
      throw new Error("Import source file must be .zip or provide a directory.");
    }
    extracted = extractZip(sourceAbs);
    workingSource = collapseSingleRoot(extracted);
  }

  const backup = externalBackupRoot(
    repoRoot,
    config.import.externalBackupSuffix,
  );

  const actions = [];
  const conflicts = [];
  const skipped = [];

  try {
    const files = walkFiles(workingSource, {
      roots: ["."],
      includeGenerated: true,
      config: {
        ...config,
        paths: {
          ...config.paths,
          ignoredDirectoryNames: new Set([
            ...config.paths.ignoredDirectoryNames,
            ".git",
            "node_modules",
          ]),
          generatedPrefixes: [],
        },
      },
    });

    const records = files
      .map((sourceFile) => {
        const rawRel = relative(workingSource, sourceFile);
        return {
          sourceFile,
          rawRel,
          rel: canonicalizeArchitecturePath(rawRel, config),
        };
      })
      .filter((record) => shouldInclude(record.rawRel, config));

    const incomingMap = new Map(records.map((record) => [record.rawRel, record.rel]));

    for (const { sourceFile, rawRel, rel } of records) {
      const targetFile = path.join(repoRoot, rel);

      if (config.import.protectedPaths.has(rel)) {
        skipped.push({ path: rel, reason: "protected-hot-state" });
        continue;
      }

      if (!fs.existsSync(targetFile)) {
        actions.push({ action: "copy-new", source: rawRel, target: rel });
        if (apply) {
          copyIncoming(
            sourceFile,
            targetFile,
            rawRel,
            rel,
            incomingMap,
          );
        }
        continue;
      }

      const same = sha256File(sourceFile) === sha256File(targetFile);
      if (same) {
        skipped.push({ path: rel, reason: "identical" });
        continue;
      }

      if (conflictPolicy === "prefer-source") {
        actions.push({ action: "replace", source: rawRel, target: rel });
        if (apply) {
          ensureDir(backup);
          backupPath(repoRoot, backup, rel);
          ensureDir(path.dirname(targetFile));
          fs.copyFileSync(sourceFile, targetFile);
        }
        continue;
      }

      conflicts.push({
        source: rawRel,
        target: rel,
        sourceSha256: sha256File(sourceFile),
        targetSha256: sha256File(targetFile),
      });

      if (apply) {
        ensureDir(path.join(backup, "incoming-conflicts"));
        copyRecursive(
          sourceFile,
          path.join(backup, "incoming-conflicts", rel),
        );
      }
    }

    return {
      source: sourceAbs,
      apply,
      conflictPolicy,
      backup: apply ? backup : null,
      actions,
      conflicts,
      skipped,
    };
  } finally {
    if (extracted) fs.rmSync(extracted, { recursive: true, force: true });
  }
}
