import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, "..");
const repoRoot = path.resolve(process.argv[2] || process.cwd());
const source = path.join(packageRoot, "tests");
const target = path.join(repoRoot, "tests");

const copyTree = (src, dst) => {
  fs.mkdirSync(dst, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dst, entry.name);
    if (entry.isDirectory()) {
      copyTree(from, to);
      continue;
    }
    if (fs.existsSync(to)) {
      console.error(`REFUSE_EXISTING ${path.relative(repoRoot, to)}`);
      process.exitCode = 2;
      continue;
    }
    fs.copyFileSync(from, to);
    console.log(`ADD ${path.relative(repoRoot, to)}`);
  }
};

copyTree(source, target);
