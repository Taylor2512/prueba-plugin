import fs from "node:fs";

const limits = {
  ".ai/memory/INDEX.md": [150, 20000],
  ".ai/memory/PROJECT.md": [200, 30000],
  ".ai/brain/70-memory/CURRENT.md": [80, 12000],
  ".ai/brain/70-memory/HANDOFF.md": [100, 16000],
  ".ai/brain/80-work/ACTIVE.md": [80, 12000],
};

let failed = false;
for (const [file, [maxLines, maxBytes]] of Object.entries(limits)) {
  if (!fs.existsSync(file)) continue;
  const text = fs.readFileSync(file, "utf8");
  const lines = text.split(/\r?\n/).length;
  const bytes = Buffer.byteLength(text);
  if (lines > maxLines || bytes > maxBytes) {
    console.error(`${file}: lines=${lines}/${maxLines} bytes=${bytes}/${maxBytes}`);
    failed = true;
  }
}

process.exit(failed ? 1 : 0);
