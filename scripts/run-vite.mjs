#!/usr/bin/env node

import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";

const VITE_BIN = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const DEFAULT_MAX_OLD_SPACE_SIZE = "8192";

const argv = process.argv.slice(2);
const command = argv.shift();

if (!command) {
  console.error("Usage: node scripts/run-vite.mjs <build|dev|preview> [vite args] [--env KEY=VALUE] [--max-old-space-size=NNNN]");
  process.exit(1);
}

const viteArgs = [];
const extraEnv = {};
let maxOldSpaceSize = null;

for (let i = 0; i < argv.length; i += 1) {
  const arg = argv[i];
  if (arg === "--env") {
    const pair = argv[i + 1];
    if (!pair || pair.startsWith("--")) {
      console.error("Expected KEY=VALUE after --env");
      process.exit(1);
    }
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) {
      console.error(`Invalid --env value: ${pair}`);
      process.exit(1);
    }
    const key = pair.slice(0, eqIndex);
    const value = pair.slice(eqIndex + 1);
    if (!key) {
      console.error(`Invalid --env key in: ${pair}`);
      process.exit(1);
    }
    extraEnv[key] = value;
    i += 1;
    continue;
  }

  if (arg === "--max-old-space-size") {
    const value = argv[i + 1];
    if (!value || value.startsWith("--")) {
      console.error("Expected a numeric value after --max-old-space-size");
      process.exit(1);
    }
    maxOldSpaceSize = value;
    i += 1;
    continue;
  }

  if (arg.startsWith("--max-old-space-size=")) {
    const value = arg.slice("--max-old-space-size=".length);
    if (!value) {
      console.error("Expected a numeric value after --max-old-space-size=");
      process.exit(1);
    }
    maxOldSpaceSize = value;
    continue;
  }

  viteArgs.push(arg);
}

const env = {...process.env, ...extraEnv};
if (command === "build" || maxOldSpaceSize) {
  const desiredMaxOldSpaceSize = maxOldSpaceSize ?? DEFAULT_MAX_OLD_SPACE_SIZE;
  env.NODE_OPTIONS = env.NODE_OPTIONS
    ? `${env.NODE_OPTIONS} --max-old-space-size=${desiredMaxOldSpaceSize}`
    : `--max-old-space-size=${desiredMaxOldSpaceSize}`;
}

const child = spawn(process.execPath, [VITE_BIN, command, ...viteArgs], {
  env,
  stdio: "inherit",
});

child.on("error", (error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

child.on("exit", (code, signal) => {
  if (signal) {
    process.exit(signal === "SIGINT" ? 130 : 1);
    return;
  }
  process.exit(code ?? 1);
});
