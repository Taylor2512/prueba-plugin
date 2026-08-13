#!/usr/bin/env node
/**
 * Baseline de activación de skills (AIOS-008).
 *
 * Simula el enrutado por descripción: para cada prompt de `evals/cases.json`, puntúa
 * todas las skills por solape léxico entre el prompt y el par `name + description`, y
 * comprueba si gana la skill que debería.
 *
 * No sustituye a una evaluación con modelo, pero es reproducible, corre en CI y detecta
 * lo que importa: descripciones que no discriminan, prompts que colisionan entre skills
 * y casos negativos que sí activan.
 *
 * Métricas por skill:
 *   - recall     = positivos propios en los que la skill queda primera
 *   - precision  = de todos los prompts del corpus que eligen esta skill, cuántos son suyos
 *   - negativos  = casos `should_not_trigger` que NO la eligen (deben ser todos)
 *
 * Uso:
 *   node tools/ai-quality/skill-activation-baseline.mjs [--root=.agents/skills]
 *                                                       [--min-recall=0.8]
 *                                                       [--min-precision=0.6]
 *                                                       [--json]
 */

import fs from "node:fs";
import process from "node:process";
import path from "node:path";

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, "").split("=");
    return [k, v ?? true];
  }),
);

const root = args.root ?? ".agents/skills";
const minRecall = Number(args["min-recall"] ?? 0.8);
const minPrecision = Number(args["min-precision"] ?? 0.6);
const emitJson = Boolean(args.json);

/** Palabras sin poder discriminante en este corpus. */
const STOP = new Set([
  "de", "la", "el", "los", "las", "un", "una", "y", "o", "en", "para", "por", "con",
  "del", "al", "que", "se", "su", "es", "the", "a", "an", "of", "to", "for", "in",
  "on", "and", "or", "is", "how", "do", "i", "como", "cómo", "qué", "que",
]);

const tokenize = (text) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    // Los números se conservan aunque sean cortos: distinguen «Tailwind 3» de «Tailwind 4».
    .filter((t) => (t.length > 2 || /^\d+$/.test(t)) && !STOP.has(t));

/** Acepta los dos formatos que conviven hoy: `"texto"` y `{ prompt: "texto" }`. */
const promptText = (entry) => (typeof entry === "string" ? entry : entry?.prompt ?? "");

const skills = [];
for (const name of fs.readdirSync(root)) {
  const dir = path.join(root, name);
  if (!fs.statSync(dir).isDirectory()) continue;

  const skillFile = path.join(dir, "SKILL.md");
  const casesFile = path.join(dir, "evals", "cases.json");
  if (!fs.existsSync(skillFile) || !fs.existsSync(casesFile)) continue;

  const body = fs.readFileSync(skillFile, "utf8");
  const front = body.match(/^---\n([\s\S]*?)\n---/);
  const description = front?.[1].match(/description:\s*(.+)/)?.[1]?.trim() ?? "";
  const cases = JSON.parse(fs.readFileSync(casesFile, "utf8"));

  const ownTerms = new Set([...tokenize(name), ...tokenize(description)]);

  // `# Anti-triggers` documenta cuándo NO debe activarse. Solo discriminan los términos
  // que la propia descripción no reclama: en «Tailwind 4» eso deja el «4».
  const antiSection = body.match(/^#\s*Anti-triggers\s*\n([\s\S]*?)(?=\n#\s|$)/m);
  const antiTerms = new Set(
    tokenize(antiSection?.[1] ?? "").filter((t) => !ownTerms.has(t)),
  );

  skills.push({
    name,
    description,
    terms: ownTerms,
    antiTerms,
    positives: (cases.should_trigger ?? []).map(promptText).filter(Boolean),
    negatives: (cases.should_not_trigger ?? []).map(promptText).filter(Boolean),
    ambiguous: (cases.ambiguous ?? []).map(promptText).filter(Boolean),
    caseFormat: typeof (cases.should_trigger ?? [])[0] === "string" ? "string" : "object",
  });
}

/** Solape léxico simple; empates se resuelven por nombre para que el resultado sea estable. */
function rank(prompt) {
  const tokens = tokenize(prompt);
  return skills
    .map((skill) => ({
      name: skill.name,
      // Un anti-trigger descarta la skill por completo, no solo la penaliza.
      score: tokens.some((t) => skill.antiTerms.has(t))
        ? 0
        : tokens.filter((t) => skill.terms.has(t)).length,
    }))
    .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
}

const selections = new Map(skills.map((s) => [s.name, []]));
const unroutable = [];

for (const skill of skills) {
  for (const prompt of skill.positives) {
    const [best] = rank(prompt);
    if (best.score === 0) {
      unroutable.push({ skill: skill.name, prompt });
      continue;
    }
    selections.get(best.name).push({ prompt, owner: skill.name });
  }
}

const rows = skills.map((skill) => {
  const chosen = selections.get(skill.name);
  const own = chosen.filter((c) => c.owner === skill.name).length;
  const routed = skill.positives.filter((p) => rank(p)[0].score > 0).length;

  const negativeFailures = skill.negatives.filter((p) => {
    const [best] = rank(p);
    return best.score > 0 && best.name === skill.name;
  });

  return {
    name: skill.name,
    positives: skill.positives.length,
    negatives: skill.negatives.length,
    ambiguous: skill.ambiguous.length,
    caseFormat: skill.caseFormat,
    recall: routed === 0 ? 0 : own / skill.positives.length,
    precision: chosen.length === 0 ? null : own / chosen.length,
    negativeFailures: negativeFailures.length,
    hasDescription: skill.description.length > 0,
  };
});

const failing = rows.filter(
  (r) =>
    r.recall < minRecall ||
    (r.precision !== null && r.precision < minPrecision) ||
    r.negativeFailures > 0,
);

if (emitJson) {
  console.log(JSON.stringify({ minRecall, minPrecision, rows, unroutable, failing }, null, 2));
} else {
  const avg = (key) => {
    const vals = rows.map((r) => r[key]).filter((v) => v !== null);
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  };

  console.log(`[skill-activation] ${rows.length} skills evaluadas`);
  console.log(`[skill-activation] recall medio ${avg("recall").toFixed(2)} · precisión media ${avg("precision").toFixed(2)}`);
  console.log(`[skill-activation] umbral: recall ≥ ${minRecall}, precisión ≥ ${minPrecision}`);

  const mixedFormat = rows.filter((r) => r.caseFormat === "string");
  if (mixedFormat.length > 0) {
    console.log(`[skill-activation] AVISO — ${mixedFormat.length} skills usan el formato antiguo de cases.json (string suelto): ${mixedFormat.map((r) => r.name).join(", ")}`);
  }

  const noAmbiguous = rows.filter((r) => r.ambiguous === 0).length;
  if (noAmbiguous > 0) {
    console.log(`[skill-activation] AVISO — ${noAmbiguous} skills sin caso ambiguo (SKILL-EVALUATION.md exige uno)`);
  }

  if (unroutable.length > 0) {
    console.log(`[skill-activation] ${unroutable.length} prompt(s) que ninguna descripción reconoce:`);
    for (const u of unroutable) console.log(`  ${u.skill}: "${u.prompt}"`);
  }

  if (failing.length === 0) {
    console.log("[skill-activation] OK — todas las skills superan el umbral.");
  } else {
    console.log(`[skill-activation] FALLO — ${failing.length} skill(s) bajo umbral:`);
    for (const r of failing) {
      const parts = [];
      if (r.recall < minRecall) parts.push(`recall ${r.recall.toFixed(2)}`);
      if (r.precision !== null && r.precision < minPrecision) parts.push(`precisión ${r.precision.toFixed(2)}`);
      if (r.negativeFailures > 0) parts.push(`${r.negativeFailures} negativo(s) que activan`);
      console.log(`  ${r.name.padEnd(34)} ${parts.join(" · ")}`);
    }
    process.exitCode = 1;
  }
}
