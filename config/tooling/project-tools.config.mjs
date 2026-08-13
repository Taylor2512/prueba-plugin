import path from "node:path";

const architectureRoots = [
  ".ai",
  "docs",
  "scripts",
  "tools",
  ".claude",
  ".codex",
  ".agents",
  ".github",
];

const markdownRoots = [
  ".ai",
  "docs",
  "tools",
  ".claude",
  ".codex",
  ".agents",
  ".github",
  "README.md",
  "AGENTS.md",
  "CLAUDE.md",
  "CODEX.md",
  "GEMINI.md",
];

const ignoredDirectoryNames = new Set([
  ".git",
  "node_modules",
  "dist",
  "coverage",
  "test-results",
  "playwright-report",
  ".knip",
  ".vite",
  ".cache",
  ".obsidian",
  ".trash",
]);

const protectedPaths = new Set([
  ".ai/NOW.md",
  ".ai/brain/70-memory/CURRENT.md",
  ".ai/brain/70-memory/HANDOFF.md",
  ".ai/ops/tasks/CURRENT.md",
  ".ai/ops/tasks/TASK-LEDGER.md",
  ".ai/scrum/CURRENT.md",
  ".ai/scrum/TASK-LEDGER.md",
]);

const generatedPrefixes = [
  ".ai/index/",
  ".ai/cache/",
  "reports/architecture/",
];

export default {
  schemaVersion: 1,

  paths: {
    architectureRoots,
    markdownRoots,
    ignoredDirectoryNames,
    protectedPaths,
    generatedPrefixes,
    indexRoot: ".ai/index/architecture",
    reportRoot: "reports/architecture",
    topLevelArchitectureExtensions: [".md", ".mdx"],
  },

  residue: {
    directories: new Set(["payload", "reference-snapshot", "current-index"]),
    rootFiles: new Set([
      "APPLY-INCREMENTALLY.md",
      "APPLY-INSTRUCTIONS.md",
      "ARCHITECTURE.md",
      "AUDIT.md",
      "CHAT-KNOWLEDGE-CROSSWALK.md",
      "CONNECTIVITY-AUDIT.md",
      "INCREMENTAL-MIGRATION.md",
      "INSTALL.md",
      "MANIFEST.md",
      "MIGRATION.md",
      "PATCH-MANIFEST.md",
      "PROJECT-CROSSCHECK.md",
      "PROMPT-SESSION-RULE-UNIVERSAL.md",
      "SESSION-LIFECYCLE.md",
      "STRUCTURE.md",
      "TREE.md",
    ]),
  },

  naming: {
    /**
     * Revision tokens in FILE/DIRECTORY names are prohibited in architecture roots.
     * Historical IDs may stay inside Markdown frontmatter/body.
     */
    versionTokenPatterns: [
      /(^|[-_.\s])v\d+(?:[._-]\d+)*(?=$|[-_.\s])/gi,
      /(^|[-_.\s])version[-_.\s]?\d+(?:[._-]\d+)*(?=$|[-_.\s])/gi,
    ],
    copyTokenPatterns: [
      /(?:\s|\-|_|\.)(?:copy|copia|old|backup|final)(?:[-_.\s]*\d+)?$/gi,
      /\(\d+\)$/g,
    ],
    revisionDatePatterns: [
      /(?:[-_.])20\d{2}[-_.]?\d{2}[-_.]?\d{2}$/g,
      /(?:[-_.])20\d{6}$/g,
    ],
    allowedHistoricalIdsInContent: true,
    scope: architectureRoots,
  },

  markdown: {
    extensions: [".md", ".mdx"],
    managedNavigationStart: "<!-- project-tools:navigation:start -->",
    managedNavigationEnd: "<!-- project-tools:navigation:end -->",
    volatileFrontmatterKeys: new Set([
      "updated",
      "generated_at",
      "generatedAt",
      "last_modified",
      "lastModified",
      "sha",
      "sha1",
      "sha256",
    ]),
    nearDuplicateThreshold: 0.92,
    nearDuplicateMinWords: 80,
  },

  import: {
    includeRoots: architectureRoots,
    protectedPaths,
    generatedPrefixes,
    defaultConflictPolicy: "keep-target",
    externalBackupSuffix: "architecture-backup",
  },

  quality: {
    largeFileLines: 700,
    duplicateThresholdPercent: 8,
    wrapperAudit: true,
    deadCodeProduction: true,
  },

  packageScripts: {
    "tools:doctor": "node scripts/project-tools.mjs doctor .",
    "docs:scan": "node scripts/project-tools.mjs scan .",
    "docs:sanitize": "node scripts/project-tools.mjs sanitize .",
    "docs:sanitize:apply": "node scripts/project-tools.mjs sanitize . --apply",
    "docs:index": "node scripts/project-tools.mjs index .",
    "docs:links": "node scripts/project-tools.mjs links . --apply",
    "docs:duplicates": "node scripts/project-tools.mjs duplicates .",
    "docs:validate": "node scripts/project-tools.mjs validate .",
    "architecture:import": "node scripts/project-tools.mjs import .",
    "architecture:all": "node scripts/project-tools.mjs all . --apply",
  },

  resolve(root, relativePath) {
    return path.resolve(root, relativePath);
  },
};
