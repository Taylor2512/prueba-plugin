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
  "reports",
  "templates",
];

const markdownRoots = [
  ".ai",
  "docs",
  "tools",
  ".claude",
  ".codex",
  ".agents",
  ".github",
  "reports",
  "templates",
  "src",
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
  ".ai/brain/70-memory/CURRENT.md",
  ".ai/brain/70-memory/HANDOFF.md",
  ".ai/brain/80-work/ACTIVE.md",
  ".ai/scrum/views/BACKLOG.md",
  ".ai/scrum/views/RUNTIME-PLATFORM.md",
]);

const generatedPrefixes = [
  ".ai/index/",
  ".ai/cache/",
  "reports/architecture/",
];

export default {
  schemaVersion: 2,

  paths: {
    architectureRoots,
    markdownRoots,
    ignoredDirectoryNames,
    protectedPaths,
    generatedPrefixes,
    indexRoot: ".ai/index/architecture",
    reportRoot: "reports/architecture",
    aliasMap: "config/tooling/architecture-path-aliases.json",
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
    // Campaign execution identities are operational records, not document revisions.
    operationalIdentityPatterns: [
      /^\.ai\/ops\//,
      /^\.ai\/(?:plans|prompts)\/(?:PLAN|PROMPT)_[A-Z0-9_-]+_V\d+\.md$/,
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

    // Orphan warnings are meaningful only on curated navigable knowledge.
    // Task cards, provider profiles, prompts, reports and source-adjacent docs
    // may be intentional leaf nodes and must not be "fixed" with fake links.
    orphanPolicy: {
      trackedPrefixes: [
        "docs/",
        ".ai/brain/",
        ".ai/architecture/",
        ".ai/memory/",
        ".ai/knowledge/",
      ],
      requireParentIndex: true,
      exemptPaths: new Set([
        ".ai/brain/HOME.md",
        ".ai/brain/README.md",
        ".ai/memory/INDEX.md",
      ]),
    },
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
    /**
     * Límites de tamaño de los markdown bajo `.ai/`.
     *
     * El mínimo era 100 y lo violaban **730 de 1239** ficheros. No era deuda:
     * era una regla equivocada. Contradice frontalmente a
     * `.ai/CONTEXT-BUDGET.md`, que exige lo contrario —L0 boot en 2.5k tokens y
     * 4 archivos, `SKILL.md` ideal ≤4 KB, logs de más de 100 líneas
     * prohibidos—, y la propia plantilla `.ai/templates/TASK-CARD.md` tiene 26
     * líneas, así que el repositorio incumplía su regla en su propio molde.
     *
     * Exigir longitud mínima en una base de conocimiento con presupuesto de
     * contexto premia el relleno: la única forma de cumplirla es escribir de
     * más. Por eso se retira.
     *
     * El máximo sí es señal y se conserva: un documento que pasa de 1000 líneas
     * ha dejado de poder cargarse dentro del presupuesto. Con el mínimo fuera
     * quedan las violaciones reales, que eran 1.
     */
    aiMarkdownMinLines: 0,
    aiMarkdownMaxLines: 1000,
    duplicateThresholdPercent: 8,
    wrapperAudit: true,
    deadCodeProduction: true,
  },

  packageScripts: {
    "docs": "node scripts/project-tools.mjs",
  },

  resolve(root, relativePath) {
    return path.resolve(root, relativePath);
  },
};
