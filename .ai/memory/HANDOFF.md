# HANDOFF

- Task: CONFIG-020
- Estado: in progress; gates focales verdes, `quality:dead-code` sigue baseline heredado de deps/types y 3 duplicate exports semánticos
- Rama/worktree: `main` / `/Users/desarrollo1/Documents/Taylor/frontend/prueba-plugin`
- Commit base: `23596c5`
- Archivos: `.ai/scrum/task-cards/CONFIG-020-configuration-qa-docs-gates.md`, `.ai/scrum/SPRINT-CURRENT.md`, `.ai/memory/HANDOFF.md`, `.ai/memory/CURRENT.md`, `src/sisad-pdfme/devtools/index.ts`, `tests/unit/sisad-pdfme/devtoolsPublicSurface.test.ts`, `tests/unit/sisad-pdfme/adaptersPublicSurface.test.ts`, `tests/unit/features/pdfcomponent/ui/primitivesPublicSurface.test.ts`, `tests/unit/sisad-pdfme/integrationPublicSurface.test.ts`, `tests/unit/sisad-pdfme/recipientsPublicSurface.test.ts`, `tests/unit/sisad-pdfme/optionsPublicSurface.test.ts`
- Causa confirmada: el baseline de `knip` ya no tiene unused files ni unused exports; lo que queda es export surface heredada en deps/types y 3 duplicate exports semánticos aceptables en `text/constants`.
- Cambios: eliminé el barrel muerto de `schemas/options`, corregí el barrel `devtools` (`downloadBytes`), recorté exports `default` redundantes en options/UI detail components, y añadí smokes públicos para config, inspector, devtools, adapters, primitives, integration, recipients y options.
- Gates: `npm run lint` ✅, `npx vitest run tests/unit/sisad-pdfme/config/public-api.test.ts tests/unit/sisad-pdfme/ui/detailViewPublicModules.test.ts tests/unit/sisad-pdfme/devtoolsPublicSurface.test.ts tests/unit/sisad-pdfme/adaptersPublicSurface.test.ts tests/unit/features/pdfcomponent/ui/primitivesPublicSurface.test.ts tests/unit/sisad-pdfme/integrationPublicSurface.test.ts tests/unit/sisad-pdfme/recipientsPublicSurface.test.ts tests/unit/sisad-pdfme/optionsPublicSurface.test.ts tests/unit/sisad-pdfme/schemas/options/optionGroupRenderer.test.ts tests/unit/sisad-pdfme/ui/components/Designer/shared/useDesignerKeyboardShortcuts.test.ts tests/unit/generated/assignments/assignments.lifecycle.test.ts` ✅, `npm run quality:duplicate-functions` ✅, `npm run quality:direct-config-readers` ✅, `npx knip --cache --reporter compact --include exports --max-show-issues 120` ✅, `npm run quality:dead-code` ❌ baseline heredado.
- Claims no verificados: `quality:dead-code` completo sigue sin quedar en verde.
- Riesgos: el restante de `quality:dead-code` está en dependencias/tipos y 3 alias/constantes duplicadas heredadas; seguir apretando sin una ola dedicada puede crecer mucho el diff.
- Siguiente acción: si se continúa, abrir una ola separada para el último bloque de alias/constantes o documentar la excepción de `dead-code`.
- Condición de parada: si el siguiente intento exige tocar lógica real fuera de la surface de re-export, parar y documentar la excepción.
