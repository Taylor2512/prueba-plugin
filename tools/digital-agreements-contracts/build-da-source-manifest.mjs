import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const candidates = [
  "src/features/DigitalAgreements/features/designer/hooks/useTemplateSave.js",
  "src/redux/states/FormsPDF.js",
  "src/modules/externalForms/pages/Editor.jsx",
  "src/modules/externalForms/components/ContentEditor/Forms/ContentFormEditor/ContentFormEditor.jsx",
  "unificados/codigo-frontend-web.md",
  "unificados/documentacion-sisad-web.md",
  "unificados/styles-web.md",
];

const hash = (b) => crypto.createHash("sha256").update(b).digest("hex");
const files = candidates.map((rel) => {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) return { path: rel, exists: false };
  const data = fs.readFileSync(abs);
  return {
    path: rel,
    exists: true,
    sha256: hash(data),
    bytes: data.length,
    mtime: fs.statSync(abs).mtime.toISOString(),
  };
});

const target = path.join(root, "unificados/DA-SOURCE-MANIFEST.generated.json");
fs.mkdirSync(path.dirname(target), { recursive: true });
fs.writeFileSync(target, JSON.stringify({
  generatedAt: new Date().toISOString(),
  files,
}, null, 2) + "\n");
console.log(target);
