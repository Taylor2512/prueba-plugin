import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const manifestPath = path.join(root, "tools/digital-agreements-contracts/contract-manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const sha = (buffer) => crypto.createHash("sha256").update(buffer).digest("hex");
const rows = manifest.baselinePaths.map((rel) => {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return { path: rel, exists: false };
  const data = fs.readFileSync(abs);
  return {
    path: rel,
    exists: true,
    bytes: data.length,
    sha256: sha(data),
    mtime: fs.statSync(abs).mtime.toISOString(),
  };
});

const report = {
  generatedAt: new Date().toISOString(),
  campaign: manifest.campaign,
  cwd: root,
  files: rows,
};

const outDir = path.join(root, "reports/digital-agreements-contracts");
fs.mkdirSync(outDir, { recursive: true });
const out = path.join(outDir, "contract-report.json");
fs.writeFileSync(out, JSON.stringify(report, null, 2) + "\n");
console.log(`DigitalAgreements contract report: ${out}`);
