import fs from "node:fs";
import path from "node:path";
import {
  normalizeRelative,
  readTextSafe,
  relative,
  sha256Buffer,
  toPosix,
} from "./core.mjs";

export function splitFrontmatter(text) {
  if (!text.startsWith("---\n")) {
    return { frontmatter: "", body: text, fields: {} };
  }

  const end = text.indexOf("\n---", 4);
  if (end < 0) return { frontmatter: "", body: text, fields: {} };

  const frontmatter = text.slice(4, end);
  const body = text.slice(end + 4).replace(/^\n/, "");
  const fields = {};

  for (const line of frontmatter.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_.-]+):\s*(.*?)\s*$/);
    if (match) fields[match[1]] = match[2].replace(/^["']|["']$/g, "");
  }

  return { frontmatter, body, fields };
}

export function firstHeading(text) {
  const { body } = splitFrontmatter(text);
  const match = body.match(/^#\s+(.+?)\s*$/m);
  return match ? match[1].trim() : "";
}

function normalizeMarkdownForHash(text, config) {
  const { frontmatter, body } = splitFrontmatter(text);
  const volatile = config.markdown.volatileFrontmatterKeys;

  const stableFrontmatter = frontmatter
    .split(/\r?\n/)
    .filter((line) => {
      const key = line.match(/^([A-Za-z0-9_.-]+):/)?.[1];
      return !key || !volatile.has(key);
    })
    .join("\n");

  const withoutManaged = stripManagedNavigation(body, config);

  const normalized = `${stableFrontmatter}\n${withoutManaged}`
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return normalized;
}

export function normalizedContentHash(text, config) {
  return sha256Buffer(normalizeMarkdownForHash(text, config));
}

function stripManagedNavigation(text, config) {
  const start = config.markdown.managedNavigationStart;
  const end = config.markdown.managedNavigationEnd;

  const a = text.indexOf(start);
  const b = text.indexOf(end);
  if (a >= 0 && b >= a) {
    return `${text.slice(0, a)}${text.slice(b + end.length)}`;
  }
  return text;
}

export function upsertManagedNavigation(text, block, config) {
  const start = config.markdown.managedNavigationStart;
  const end = config.markdown.managedNavigationEnd;
  const managed = `${start}\n${block.trim()}\n${end}`;

  const a = text.indexOf(start);
  const b = text.indexOf(end);
  if (a >= 0 && b >= a) {
    return `${text.slice(0, a)}${managed}${text.slice(b + end.length)}`;
  }

  return `${text.trimEnd()}\n\n${managed}\n`;
}

export function markdownLinks(text) {
  const links = [];
  const regex = /(?<!!)\[[^\]]*]\(([^)]+)\)/g;
  let match;

  while ((match = regex.exec(text))) {
    const raw = match[1].trim();
    if (!raw || raw.startsWith("#")) continue;
    if (/^(?:https?:|mailto:|tel:)/i.test(raw)) continue;

    const withoutTitle = raw.replace(/\s+["'][^"']*["']\s*$/, "");
    const [target, fragment] = withoutTitle.split("#", 2);
    if (!target) continue;

    let decoded = target;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      // Keep raw path; validator will report it if unresolved.
    }

    links.push({ raw, target: decoded, fragment: fragment || "" });
  }

  return links;
}

export function resolveMarkdownLink(root, fromAbs, target) {
  const base = path.resolve(path.dirname(fromAbs), target);
  const candidates = [
    base,
    `${base}.md`,
    `${base}.mdx`,
    path.join(base, "README.md"),
  ];

  return candidates.find((candidate) => {
    try {
      return !!candidate && !!root && candidate.startsWith(root) && requireExists(candidate);
    } catch {
      return false;
    }
  }) || null;
}

function requireExists(file) {
  return fs.existsSync(file);
}

function canonicalizeSegment(segment, config) {
  const ext = path.extname(segment);
  let stem = ext ? segment.slice(0, -ext.length) : segment;
  const hiddenPrefix = stem.startsWith(".") && !stem.startsWith("..") ? "." : "";
  if (hiddenPrefix) stem = stem.slice(1);

  for (const pattern of config.naming.versionTokenPatterns) {
    pattern.lastIndex = 0;
    stem = stem.replace(pattern, "$1");
  }
  for (const pattern of config.naming.copyTokenPatterns) {
    pattern.lastIndex = 0;
    stem = stem.replace(pattern, "");
  }
  for (const pattern of config.naming.revisionDatePatterns) {
    pattern.lastIndex = 0;
    stem = stem.replace(pattern, "");
  }

  stem = stem
    .replace(/[-_.\s]{2,}/g, "-")
    .replace(/^[-_.\s]+|[-_.\s]+$/g, "");

  if (!stem) {
    if (!ext) return "";
    stem = hiddenPrefix ? "config" : "README";
  }
  return `${hiddenPrefix}${stem}${ext}`;
}

export function hasVersionToken(relativePath, config) {
  const normalizedPath = normalizeRelative(relativePath);
  if (config.naming.operationalIdentityPatterns?.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(normalizedPath);
  })) return false;

  return normalizedPath
    .split("/")
    .some((segment) => {
      const ext = path.extname(segment);
      const stem = ext ? segment.slice(0, -ext.length) : segment;

      return config.naming.versionTokenPatterns.some((pattern) => {
        pattern.lastIndex = 0;
        return pattern.test(stem);
      });
    });
}

export function canonicalizeArchitecturePath(relativePath, config) {
  return normalizeRelative(relativePath)
    .split("/")
    .map((segment) => canonicalizeSegment(segment, config))
    .filter(Boolean)
    .join("/");
}

export function words(text) {
  return normalizeMarkdownForSimilarity(text)
    .split(/\s+/)
    .filter(Boolean);
}

function roughTokens(text) {
  return Math.ceil(text.length / 4);
}

function normalizeMarkdownForSimilarity(text) {
  return splitFrontmatter(text).body
    .toLowerCase()
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function shingles(text, width = 5) {
  const tokens = normalizeMarkdownForSimilarity(text).split(/\s+/).filter(Boolean);
  const result = new Set();
  for (let i = 0; i <= tokens.length - width; i += 1) {
    result.add(tokens.slice(i, i + width).join(" "));
  }
  return result;
}

export function jaccard(a, b) {
  if (!a.size && !b.size) return 1;
  let intersection = 0;
  const small = a.size <= b.size ? a : b;
  const large = small === a ? b : a;
  for (const value of small) if (large.has(value)) intersection += 1;
  return intersection / (a.size + b.size - intersection);
}

export function markdownMetadata(root, abs, config) {
  const text = readTextSafe(abs);
  const fm = splitFrontmatter(text);

  return {
    path: relative(root, abs),
    title: firstHeading(text) || path.basename(abs),
    id: fm.fields.id || null,
    type: fm.fields.type || fm.fields.kind || null,
    domain: fm.fields.domain || null,
    status: fm.fields.status || null,
    lines: text ? text.split(/\r?\n/).length : 0,
    words: words(text).length,
    roughTokens: roughTokens(text),
    sha256: normalizedContentHash(text, config),
    versionedPath: hasVersionToken(relative(root, abs), config),
  };
}

export function relativeMarkdownLink(fromAbs, toAbs) {
  let relPath = toPosix(path.relative(path.dirname(fromAbs), toAbs));
  if (!relPath.startsWith(".")) relPath = `./${relPath}`;
  return relPath;
}
