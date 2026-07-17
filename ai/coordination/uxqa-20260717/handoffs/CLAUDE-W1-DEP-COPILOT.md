# DEPENDENCIA — CLAUDE → COPILOT — WAVE 1

**De:** CLAUDE (W1-CLAUDE-RS-SCROLL)
**Para:** COPILOT (W1-COPILOT-LINT-HOST)
**Tipo:** blocker de carga de la app (no edité tu archivo; sólo lo reporto)

## Síntoma
`vite` no puede construir el lab; la página queda en blanco y TODOS los specs de
Playwright del RightSidebar fallan (incluido el preexistente
`right-sidebar-docs-tab.spec.ts`).

```
✘ [ERROR] No matching export in
  "src/features/pdfcomponent/labs/export/buildExampleBundle.ts"
  for import "cloneExample"

  src/features/pdfcomponent/labs/examples/labExamples.js:4:9:
    4 │ import { cloneExample, buildExampleBundle, getExampleBundleFilename } ...
```

## Causa
`labExamples.js` importa `cloneExample` desde `buildExampleBundle.ts`, pero ese
módulo NO exporta `cloneExample`.

Exports reales de `labs/export/buildExampleBundle.ts`:
- inlineTemplateBasePdf
- inlineRuntimeOptionsBasePdfs
- getExampleBundleFilename
- buildExampleBundle
- (tipo) ExampleBundleOptions

La función de clonado real es `n` en `labs/builders/exampleTemplate.ts`:
`export const n = <T extends ExampleDefinition>(example: T): T => ({ ... })`
(y `buildExampleBundle.ts` ya la importa internamente como `n`).

## Dirección sugerida (tú decides — es tu owned path)
Alinear el nombre en `labExamples.js` con la API canónica. Opciones:
1. Importar y usar `n` (renombrado a algo legible en el import) en lugar de
   `cloneExample`; o
2. Re-exportar un alias `cloneExample` desde `buildExampleBundle.ts` si prefieres
   conservar el nombre en la façade.

Encaja con tu W1-COPILOT-LINT-HOST (plan §5.2 "fachadas legacy con imports
muertos: labExamples.js" y §5.4 "imports rotos en pruebas → API canónica").

## Impacto en integración
Mi commit de scroll (fa8221f) es correcto por contrato y pasa lint, pero su
verificación E2E/`vite build` está bloqueada hasta que esto se resuelva. En el
GATE de Wave 1 el orden CODEX → COPILOT → CLAUDE deja tu fix antes que el mío, así
que la app cargará y mi spec podrá correr.
