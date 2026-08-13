import fs from "node:fs";

const required = [
  "AGENTS.md",
  ".ai/START.md",
  ".ai/ROUTER.md",
  ".ai/STATE-SOURCES.md",
  ".ai/BUDGETS.md",
  ".ai/brain/HOME.md",
  ".ai/index/README.md",
];

let failed = false;
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`missing ${file}`);
    failed = true;
  }
}

const limits = {
  "AGENTS.md": 5000,
  ".ai/START.md": 5000,
  ".ai/ROUTER.md": 6000,
  ".ai/STATE-SOURCES.md": 6000,
  "CLAUDE.md": 3500,
  "CODEX.md": 3500,
  ".github/copilot-instructions.md": 5000,
};

for (const [file, max] of Object.entries(limits)) {
  if (fs.existsSync(file) && fs.statSync(file).size > max) {
    console.error(`too large ${file}: ${fs.statSync(file).size} > ${max}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
