import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const strict = process.argv.includes("--strict");
const issues = [];

const read = (rel) => {
  const abs = path.join(root, rel);
  if (!fs.existsSync(abs)) {
    issues.push({ level: "ERROR", path: rel, message: "Required baseline path is missing." });
    return "";
  }
  return fs.readFileSync(abs, "utf8");
};

const useTemplateSave = read("src/features/DigitalAgreements/features/designer/hooks/useTemplateSave.js");
const formsPdf = read("src/redux/states/FormsPDF.js");
const formEditor = read("src/modules/externalForms/components/ContentEditor/Forms/ContentFormEditor/ContentFormEditor.jsx");

if (formEditor && !formEditor.includes("SisadPdfmeForm")) {
  issues.push({
    level: "ERROR",
    path: "ContentFormEditor.jsx",
    message: "Editable runtime must stay on the public SisadPdfmeForm boundary.",
  });
}

if (useTemplateSave && /SecuritySISADClient|ApiKeyInfobip|UrlFormBase|BusinessId/.test(useTemplateSave)) {
  issues.push({
    level: "ERROR",
    path: "useTemplateSave.js",
    message: "Server-owned backend configuration must not be authored by Designer payload code.",
  });
}

if (formsPdf && !/filesTemplate/.test(formsPdf)) {
  issues.push({
    level: "WARN",
    path: "FormsPDF.js",
    message: "Could not find expected aggregate multipart field `filesTemplate`.",
  });
}
if (formsPdf && !/jsonTxt/.test(formsPdf)) {
  issues.push({
    level: "WARN",
    path: "FormsPDF.js",
    message: "Could not find expected aggregate multipart field `jsonTxt`.",
  });
}

const generated = [
  "unificados/codigo-frontend-web.md",
  "unificados/documentacion-sisad-web.md",
  "unificados/styles-web.md",
];
for (const rel of generated) {
  if (!fs.existsSync(path.join(root, rel))) {
    issues.push({ level: "WARN", path: rel, message: "Generated context pack not found." });
  }
}

if (issues.length === 0) {
  console.log("PASS: no DigitalAgreements contract invariant issues detected.");
  process.exit(0);
}

for (const item of issues) {
  console.log(`${item.level}: ${item.path}: ${item.message}`);
}

const errors = issues.filter((x) => x.level === "ERROR").length;
if (strict && errors > 0) process.exit(1);
