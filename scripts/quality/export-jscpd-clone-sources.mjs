import fs from "node:fs";
import process from "node:process";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = process.cwd();
const candidates = [
  process.argv[2],
  "reports/jscpd/diagnostic/jscpd-report.json",
  "reports/jscpd/jscpd-report.json",
  "jscpd-report.json",
].filter(Boolean);

const reportPath = candidates
  .map((candidate) => path.resolve(root, candidate))
  .find((candidate) => fs.existsSync(candidate));

if (!reportPath) {
  throw new Error(
    "No se encontró jscpd-report.json. Pasa su ruta como primer argumento.",
  );
}

const report = JSON.parse(fs.readFileSync(reportPath, "utf8"));
const duplicates = Array.isArray(report.duplicates) ? report.duplicates : [];
const sourcePaths = new Set();

for (const duplicate of duplicates) {
  for (const file of [duplicate.firstFile, duplicate.secondFile]) {
    const name = String(file?.name || "").replace(/^\.\//, "");
    if (name) sourcePaths.add(name);
  }
}

const outputBase = path.resolve(root, "reports/jscpd/remaining-clone-sources");
const projectRoot = path.join(outputBase, "prueba-plugin");
fs.rmSync(outputBase, { recursive: true, force: true });
fs.mkdirSync(projectRoot, { recursive: true });

const copied = [];
const missing = [];

for (const relativePath of [...sourcePaths].sort()) {
  const source = path.resolve(root, relativePath);
  if (!source.startsWith(root + path.sep) || !fs.existsSync(source)) {
    missing.push(relativePath);
    continue;
  }

  const destination = path.join(projectRoot, relativePath);
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  fs.copyFileSync(source, destination);
  copied.push(relativePath);
}

const manifest = {
  generatedAt: new Date().toISOString(),
  reportPath: path.relative(root, reportPath),
  cloneCount: duplicates.length,
  copiedCount: copied.length,
  missingCount: missing.length,
  copied,
  missing,
};

fs.writeFileSync(
  path.join(outputBase, "MANIFEST.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
fs.writeFileSync(
  path.join(outputBase, "remaining-clone-files.txt"),
  copied.join("\n") + "\n",
);

const zipPath = path.resolve(root, "reports/jscpd/remaining-clone-sources.zip");
fs.rmSync(zipPath, { force: true });
const zip = spawnSync("zip", ["-qr", zipPath, "."], {
  cwd: outputBase,
  stdio: "inherit",
});

if (zip.error || zip.status !== 0) {
  console.warn(
    "No se pudo crear el ZIP automáticamente. La carpeta exportada sí quedó disponible:",
    outputBase,
  );
} else {
  console.log(`ZIP creado: ${path.relative(root, zipPath)}`);
}

console.log(`Clones del reporte: ${duplicates.length}`);
console.log(`Archivos copiados: ${copied.length}`);
if (missing.length) {
  console.warn(`Archivos no encontrados: ${missing.length}`);
  for (const file of missing) console.warn(` - ${file}`);
}
