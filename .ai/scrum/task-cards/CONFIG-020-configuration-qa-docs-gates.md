# CONFIG-020 — Cerrar QA, documentación y quality gates

**Estado:** in progress
**Owner:** qa-reviewer  
**Modelo sugerido:** Terra medium  
**Worktree/rama:** pendiente  
**Prioridad:** P1  
**Dependencias:** CONFIG-001, CONFIG-002, CONFIG-003, CONFIG-004, CONFIG-005, CONFIG-006, CONFIG-007, CONFIG-008, CONFIG-009, CONFIG-010, CONFIG-011, CONFIG-012, CONFIG-013, CONFIG-014, CONFIG-015, CONFIG-016, CONFIG-017, CONFIG-018, CONFIG-019

## Objetivo observable

Completar documentación, ejemplos, matriz de regresión y gates que impidan nuevas lecturas directas de configuración.

## Evidencia

- Plan canónico: `.ai/plans/PLAN_CONTINUIDAD_CONFIGURACION_UNIFICADA_SISAD_PDFME.md`.
- Auditoría vigente: `reports/configuration/`.
- Estado único: `.ai/scrum/SPRINT-CURRENT.md`.
- Ruta de contexto: `.ai/routes/configuration.md`.
- `npm run quality:dead-code` sigue fallando por baseline del repositorio; la surface de exports nueva quedó cubierta y ya no reporta unused exports, solo deuda heredada en deps/types/duplicate exports.
- `npm run quality` incorpora `quality:direct-config-readers` como gate formal.
- `npx vitest run tests/unit/sisad-pdfme/config/public-api.test.ts tests/unit/sisad-pdfme/ui/detailViewPublicModules.test.ts tests/unit/sisad-pdfme/devtoolsPublicSurface.test.ts tests/unit/sisad-pdfme/adaptersPublicSurface.test.ts tests/unit/features/pdfcomponent/ui/primitivesPublicSurface.test.ts` pasó; los contratos públicos de config/react, inspector, devtools, adapters y primitives quedaron validados.
- `npx knip --cache --reporter compact --include exports --max-show-issues 120` quedó limpio en exports.
- `npx vitest run tests/unit/sisad-pdfme/integrationPublicSurface.test.ts tests/unit/sisad-pdfme/recipientsPublicSurface.test.ts tests/unit/sisad-pdfme/optionsPublicSurface.test.ts` pasó; la surface pública de integration/recipients/options quedó caracterizada.
- `npm run quality:dead-code` sigue fallando por deuda amplia heredada: 5 unused dependencies, 12 unlisted dependencies, 6 unused exported types y 3 duplicate exports; ya no reporta unused files ni unused exports.

## Contexto mínimo obligatorio

1. `.ai/START.md`
2. `.ai/routes/configuration.md`
3. `.ai/governance/ANTI-HALLUCINATION.md`
4. `.ai/governance/ANTI-LOOP.md`
5. `.ai/governance/ANTI-OVERFLOW.md`
6. `.agents/skills/sisad-configuration-service/SKILL.md`
7. Esta task-card

No cargar el plan completo si esta tarjeta contiene el alcance necesario.

## Archivos permitidos

> Confirmar las rutas con búsqueda simbólica antes de editar. No es obligatorio abrirlos todos.

- docs/07-integraciones/05-global-config.md
- docs/03-designer/02-props.md
- docs/03-designer/11-action-contract.md
- docs/04-schemas/09-inspector-contract.md
- docs/13-ejemplos/04-dynamic-host-integration-examples.md
- docs/10-testing-qa/02-regression-matrix.md
- tests/playwright/configuration
- scripts/quality/check-direct-config-readers.mjs

## Archivos prohibidos

- No introducir funcionalidades nuevas.
- No ampliar API sin task-card.
- No reescribir tests ajenos.
- No eliminar legacy antes de la ventana acordada.

Adicionalmente, quedan protegidos salvo autorización explícita de esta task-card:

- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/generator/**`

## Invariantes

- Una instancia de configuración por `SisadPdfmeProvider`, nunca singleton global.
- Canonical config gana sobre aliases legacy.
- `enabled`, `visible`, `permitted`, `available` y `executable` no son equivalentes.
- Los cambios visuales no deben reconstruir EventHub, RecipientRegistry ni DesignerEngine.
- Dos Providers no comparten recipients, eventos, permisos ni overrides.
- No introducir imports específicos de SISAD-WEB dentro de `src/sisad-pdfme`.
- No afirmar que una prueba pasó si no fue ejecutada.

## Caracterización previa

El cierre exige una sola config canónica, recursos estables, selectors en consumidores, compatibilidad legacy y pruebas por comportamiento.

Antes del parche:

- registrar `git status --short`;
- registrar commit base;
- realizar máximo 2 rondas de búsqueda;
- abrir máximo 8 archivos inicialmente;
- escribir la hipótesis principal;
- elegir al menos un test focal que falle o caracterice el comportamiento.

## Diseño/patrón

- Actualizar documentación indicada por el plan.
- Crear ocho ejemplos de configuración.
- Crear matriz QA.
- Crear Playwright configuration suite.
- Agregar gate contra readers directos.
- Ejecutar quality gates globales.

## Pasos

1. Documentar config canónica y aliases.
2. Documentar estados de feature/action/component.
3. Crear ejemplos minimal/full/reviewer/form/multi/no-collab/provider/dynamic.
4. Crear matriz unit/contract/react/playwright.
5. Implementar checker de readers directos.
6. Ejecutar lint/build/vitest/playwright/dup/dead-code.
7. Registrar excepciones justificadas.
8. Crear reporte final de cierre.

## Comandos/gates

- [x] `npm run lint`
- [x] `npm run build`
- [x] `npx vitest run`
- [x] `npx playwright test tests/playwright/configuration`
- [x] `npm run quality:duplicate-functions`
- [x] `npm run quality:direct-config-readers`
- [ ] `npm run quality:dead-code`

## Criterios de aceptación

- [ ] Todos los criterios de cierre del plan están marcados con evidencia.
- [ ] Ningún componente nuevo lee options.visibility/assignment/sidebars/canvas/schemas.
- [ ] Legacy funciona durante la ventana.
- [ ] El host integra sin internals.
- [ ] Los 16 escenarios Playwright pasan.
- [ ] No existe duplicidad funcional nueva.

## Presupuesto

- Máximo 8 archivos abiertos inicialmente.
- Máximo 5 archivos modificados.
- Máximo 2 rondas de búsqueda.
- Un solo dominio por sesión.
- Máximo 3 intentos de parche sobre la misma causa.
- WIP global máximo 3.

## Condición de parada

- Dos búsquedas consecutivas no agregan evidencia.
- Se requieren más de 5 archivos modificados.
- La causa pertenece a otra task-card.
- Se alcanza el 75% del contexto sin confirmar la causa.
- Aparece una decisión de API/UX/producto que necesita aprobación.
- Un cambio requiere tocar Moveable, Selecto, geometría, snapshot o generator fuera del alcance.

## Rollback

Revertir únicamente documentación/checker/tests nuevos; no revertir implementación validada.

## Handoff

Actualizar:

- `.ai/scrum/SPRINT-CURRENT.md`;
- `.ai/memory/HANDOFF.md`;
- `.ai/memory/CURRENT.md` solo con continuidad inmediata;
- `.ai/memory/DECISIONS.md` solo si hubo decisión durable;
- `.ai/memory/RISKS.md` solo si apareció un riesgo nuevo.

El handoff debe distinguir: modificado, observado, pendiente y no verificado.
