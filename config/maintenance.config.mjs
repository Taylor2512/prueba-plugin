export default {
  reportDir: "reports/maintenance",
  claimsFile: ".ai/ops/coordination/claims.json",
  scrumRoot: ".ai/scrum",
  policyFile: "config/scrum-cleanup-policy.json",
  managedTooling: {
    script: "scripts/maintenance/project-maintenance.mjs",
    templates: "scripts/maintenance/templates",
  },
  ignoreRoots: [
    ".git",
    "node_modules",
    "dist",
    "build",
    ".vite",
  ],
  safeJunkNames: [
    ".DS_Store",
    "Thumbs.db",
    "desktop.ini",
  ],
  safeJunkSuffixes: [
    ".bak",
    ".orig",
    ".rej",
    ".tmp",
    ".swp",
    ".swo",
    "~",
  ],
  safeGeneratedDirs: [
    "coverage",
    "playwright-report",
    "test-results",
    "testsprite_tests/tmp",
  ],
  safeGeneratedFiles: [
    "testsprite_tests/local-run-results.json",
    "testsprite_tests/LOCAL-RUN-RESULTS.md",
  ],
  stableNameRoots: [
    ".ai",
    "docs",
    "reports",
    "scripts",
    "tools",
    "config",
  ],
};
