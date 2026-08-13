#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { parseArgs, writeJson } from "./tooling/core.mjs";
import {
  applyReadmeNavigation,
  applySanitize,
  buildMarkdownIndex,
  sanitizePlan,
  scanArchitecture,
  validateArchitecture,
} from "./tooling/architecture.mjs";
import { importArchitecture } from "./tooling/importer.mjs";
import { reconcileArchitecturePaths } from "./tooling/path-reconciliation.mjs";

const here = path.dirname(fileURLToPath(import.meta.url));
const defaultConfigPath = path.resolve(
  here,
  "../config/tooling/project-tools.config.mjs",
);

async function loadConfig(configPath) {
  const absolute = path.resolve(configPath || defaultConfigPath);
  const module = await import(`${pathToFileURL(absolute).href}?t=${Date.now()}`);
  return module.default;
}

function printJson(value) {
  process.stdout.write(`${JSON.stringify(value, null, 2)}\n`);
}

function usage() {
  console.log(`
Project tools

Usage:
  node scripts/project-tools.mjs scan [repo]
  node scripts/project-tools.mjs paths [repo] [--apply]
  node scripts/project-tools.mjs sanitize [repo] [--apply]
  node scripts/project-tools.mjs index [repo]
  node scripts/project-tools.mjs links [repo] [--apply]
  node scripts/project-tools.mjs duplicates [repo]
  node scripts/project-tools.mjs orphans [repo]
  node scripts/project-tools.mjs validate [repo] [--check=all|links|names]
  node scripts/project-tools.mjs import [repo] --source=<folder|zip> [--apply] [--conflict=keep-target|prefer-source]
  node scripts/project-tools.mjs doctor [repo]
  node scripts/project-tools.mjs all [repo] [--apply]

Notes:
  index/duplicates/orphans do not use --apply.
  import always requires --source.

Global:
  --config=<path>
`);
}

export async function runCli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);
  const [command = "help", repoArg = "."] = args.positional;
  const root = path.resolve(repoArg);
  const config = await loadConfig(args.get("config"));

  if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) {
    console.error(`Repository not found: ${root}`);
    return 2;
  }

  switch (command) {
    case "help":
    case "--help":
    case "-h":
      usage();
      return 0;

    case "scan": {
      const scan = scanArchitecture(root, config);
      printJson(scan);
      return scan.versionedPaths.length ? 1 : 0;
    }

    case "paths": {
      const result = reconcileArchitecturePaths(root, config, {
        apply: args.has("apply"),
        backupRoot: args.get("backup")
          ? path.resolve(args.get("backup"))
          : null,
      });
      printJson(result);
      return result.conflicts.length ? 3 : 0;
    }

    case "sanitize": {
      const result = applySanitize(root, config, {
        apply: args.has("apply"),
        backupRoot: args.get("backup")
          ? path.resolve(args.get("backup"))
          : null,
      });

      if (args.has("residue-only")) {
        const filtered = {
          backup: result.backup,
          residue: result.residue,
          applied: result.applied.filter(
            (item) => item.action === "remove-package-residue",
          ),
        };
        printJson(filtered);
        return 0;
      }

      printJson(result);
      if (result.conflicts.length) return 3;
      return 0;
    }

    case "index": {
      const result = buildMarkdownIndex(root, config);
      printJson(result.summary);
      return 0;
    }

    case "links": {
      const result = applyReadmeNavigation(root, config, {
        apply: args.has("apply"),
      });
      printJson(result);
      if (args.has("apply")) buildMarkdownIndex(root, config);
      return 0;
    }

    case "duplicates": {
      const result = buildMarkdownIndex(root, config);
      printJson(result.duplicates);
      return result.duplicates.exact.length ? 1 : 0;
    }

    case "orphans": {
      const result = buildMarkdownIndex(root, config);
      printJson({
        count: result.orphans.length,
        paths: result.orphans.map((item) => item.path),
      });
      return 0;
    }

    case "validate": {
      const result = validateArchitecture(root, config);
      const check = args.get("check", "all");

      if (check !== "all") {
        const allowedTypes = check === "names"
          ? new Set(["versioned-path", "duplicate-id"])
          : check === "links"
            ? new Set(["broken-link"])
            : null;

        if (!allowedTypes) {
          console.error(`Unknown validation check: ${check}`);
          return 2;
        }

        const filtered = {
          ...result,
          errors: result.errors.filter((item) => allowedTypes.has(item.type)),
        };
        filtered.ok = filtered.errors.length === 0;
        printJson(filtered);
        return filtered.ok ? 0 : 1;
      }

      printJson(result);
      return result.ok ? 0 : 1;
    }

    case "import": {
      const source = args.get("source");
      if (!source) {
        console.error(
          [
            "ERROR: import requires --source=<folder-or-zip>.",
            "",
            "Examples:",
            '  node scripts/project-tools.mjs import . --source="/path/architecture.zip"',
            '  node scripts/project-tools.mjs import . --source="/path/folder" --apply',
            "",
            "With npm:",
            '  npm run architecture:import -- --source="/path/architecture.zip" --apply',
          ].join("\n"),
        );
        return 2;
      }

      const result = importArchitecture(root, config, {
        source,
        apply: args.has("apply"),
        conflictPolicy: args.get("conflict", config.import.defaultConflictPolicy),
      });
      printJson(result);
      return result.conflicts.length ? 3 : 0;
    }

    case "doctor": {
      const scan = scanArchitecture(root, config);
      const validation = validateArchitecture(root, config);
      printJson({ scan, validation });
      return validation.ok ? 0 : 1;
    }

    case "all": {
      const apply = args.has("apply");
      const paths = reconcileArchitecturePaths(root, config, { apply });
      if (paths.conflicts.length && apply) {
        // Safe aliases may still have been applied, but divergent sources remain visible.
        printJson({
          stage: "paths",
          status: "partial-conflicts",
          paths,
        });
      }

      const sanitation = applySanitize(root, config, { apply });
      if (sanitation.conflicts.length) {
        printJson({
          stage: "sanitize",
          status: "blocked-by-conflicts",
          paths,
          sanitation,
        });
        return 3;
      }

      const index = buildMarkdownIndex(root, config);
      const links = applyReadmeNavigation(root, config, { apply });
      if (apply && links.changes.length) buildMarkdownIndex(root, config);
      const validation = validateArchitecture(root, config);

      printJson({
        paths,
        sanitation,
        index: index.summary,
        links,
        validation,
      });
      return validation.ok ? 0 : 1;
    }

    default:
      console.error(`Unknown command: ${command}`);
      usage();
      return 2;
  }
}

const direct = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (direct) {
  const code = await runCli();
  process.exitCode = code;
}
