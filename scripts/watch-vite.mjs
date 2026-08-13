#!/usr/bin/env node

import {spawn} from "node:child_process";
import {fileURLToPath} from "node:url";

const VITE_BIN = fileURLToPath(new URL("../node_modules/vite/bin/vite.js", import.meta.url));
const DEFAULT_MAX_OLD_SPACE_SIZE = "8192";

const env = {
  ...process.env,
  NODE_OPTIONS: process.env.NODE_OPTIONS
    ? `${process.env.NODE_OPTIONS} --max-old-space-size=${DEFAULT_MAX_OLD_SPACE_SIZE}`
    : `--max-old-space-size=${DEFAULT_MAX_OLD_SPACE_SIZE}`,
};

const runBuildOnce = () =>
  new Promise((resolve) => {
    const buildOnce = spawn(process.execPath, [VITE_BIN, "build"], {
      env,
      stdio: "inherit",
    });

    buildOnce.on("error", (error) => {
      console.error(error instanceof Error ? error.message : String(error));
      resolve({code: 1, signal: null});
    });

    buildOnce.on("exit", (code, signal) => resolve({code: code ?? 1, signal}));
  });

const startWatchers = () => {
  const build = spawn(process.execPath, [VITE_BIN, "build", "--watch"], {
    env,
    stdio: "inherit",
  });

  const preview = spawn(process.execPath, [VITE_BIN, "preview"], {
    env: {...process.env},
    stdio: "inherit",
  });

  const children = [build, preview];
  let settled = false;

  const shutdown = (code = 0, signal = null) => {
    if (settled) {
      return;
    }
    settled = true;

    for (const child of children) {
      if (!child.killed) {
        child.kill(signal ?? "SIGTERM");
      }
    }

    if (signal) {
      process.exit(signal === "SIGINT" ? 130 : 1);
      return;
    }

    process.exit(code ?? 1);
  };

  for (const child of children) {
    child.on("error", (error) => {
      console.error(error instanceof Error ? error.message : String(error));
      shutdown(1);
    });
  }

  build.on("exit", (code, signal) => shutdown(code, signal));
  preview.on("exit", (code, signal) => shutdown(code, signal));

  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => shutdown(0, signal));
  }
};

const initialBuild = await runBuildOnce();
if (initialBuild.signal) {
  process.exit(initialBuild.signal === "SIGINT" ? 130 : 1);
}

if ((initialBuild.code ?? 1) !== 0) {
  process.exit(initialBuild.code ?? 1);
}

startWatchers();
