import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import assert from "node:assert/strict";
import { runCli } from "../../scripts/project-tools.mjs";

const root = fs.mkdtempSync(path.join(os.tmpdir(), "project-tools-test-"));
try {
  fs.mkdirSync(path.join(root, ".ai/v8/brain-v2"), { recursive: true });
  fs.writeFileSync(
    path.join(root, ".ai/v8/brain-v2", "RUNTIME-V3.md"),
    "# Runtime\n\nSee [Other](../../OTHER-V2.md).\n",
  );
  fs.writeFileSync(path.join(root, ".ai", "OTHER-V2.md"), "# Other\n");
  fs.writeFileSync(
    path.join(root, ".ai", "README.md"),
    "# AI\n\nSee [Runtime](./v8/brain-v2/RUNTIME-V3.md).\n",
  );

  let code = await runCli(["sanitize", root]);
  assert.equal(code, 0);

  code = await runCli(["sanitize", root, "--apply"]);
  assert.equal(code, 0);
  assert.equal(fs.existsSync(path.join(root, ".ai/brain", "RUNTIME.md")), true);
  assert.equal(fs.existsSync(path.join(root, ".ai", "OTHER.md")), true);
  assert.equal(fs.existsSync(path.join(root, ".ai/v8")), false);

  const readmeAfter = fs.readFileSync(path.join(root, ".ai", "README.md"), "utf8");
  assert.equal(readmeAfter.includes("./brain/RUNTIME.md"), true);

  code = await runCli(["index", root]);
  assert.equal(code, 0);
  assert.equal(
    fs.existsSync(path.join(root, ".ai/index/architecture/markdown.jsonl")),
    true,
  );

  fs.writeFileSync(
    path.join(root, ".ai/brain", "RUNTIME.md"),
    "# Runtime\n\nSee [Missing](./MISSING.md).\n",
  );
  code = await runCli(["validate", root]);
  assert.equal(code, 1);

  fs.writeFileSync(
    path.join(root, ".ai/brain", "RUNTIME.md"),
    "# Runtime\n\nSee [Other](../OTHER.md).\n",
  );
  code = await runCli(["validate", root]);
  assert.equal(code, 0);

  console.log("project-tools synthetic tests PASS");
} finally {
  fs.rmSync(root, { recursive: true, force: true });
}
