
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { runCli } from "../../scripts/project-tools.mjs";

const target = fs.mkdtempSync(path.join(os.tmpdir(), "import-target-"));
const source = fs.mkdtempSync(path.join(os.tmpdir(), "import-source-"));

try {
  fs.mkdirSync(path.join(target, ".ai/brain"), { recursive: true });
  fs.writeFileSync(path.join(target, ".ai/NOW.md"), "# Target NOW\n");
  fs.writeFileSync(path.join(target, ".ai/brain/KEEP.md"), "# Keep target\n");

  fs.mkdirSync(path.join(source, ".ai/v7/brain-v2"), { recursive: true });
  fs.mkdirSync(path.join(source, ".ai/brain"), { recursive: true });
  fs.writeFileSync(path.join(source, ".ai/NOW.md"), "# Incoming NOW\n");
  fs.writeFileSync(path.join(source, ".ai/brain/KEEP.md"), "# Incoming conflict\n");
  fs.writeFileSync(
    path.join(source, ".ai/v7/brain-v2/NEW-V3.md"),
    "# New\n\n[Keep](../../brain/KEEP.md)\n",
  );

  let code = await runCli(["import", target, `--source=${source}`]);
  assert.equal(code, 3); // conflict reported, no mutation

  code = await runCli(["import", target, `--source=${source}`, "--apply"]);
  assert.equal(code, 3); // copy-new happens, conflict remains reported
  assert.equal(fs.readFileSync(path.join(target, ".ai/NOW.md"), "utf8"), "# Target NOW\n");
  assert.equal(
    fs.readFileSync(path.join(target, ".ai/brain/KEEP.md"), "utf8"),
    "# Keep target\n",
  );
  assert.equal(fs.existsSync(path.join(target, ".ai/brain/NEW.md")), true);

  const imported = fs.readFileSync(path.join(target, ".ai/brain/NEW.md"), "utf8");
  assert.equal(imported.includes("./KEEP.md"), true);

  console.log("architecture importer synthetic tests PASS");
} finally {
  fs.rmSync(target, { recursive: true, force: true });
  fs.rmSync(source, { recursive: true, force: true });
}
