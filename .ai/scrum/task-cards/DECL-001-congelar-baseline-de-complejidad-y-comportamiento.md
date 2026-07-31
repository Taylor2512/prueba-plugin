# DECL-001 — Congelar baseline de complejidad y comportamiento

**Estado:** ready  
**Wave:** W0  
**Prioridad:** P0  
**Riesgo:** Medio  
**Owner sugerido:** explorer  
**Modelo sugerido:** Terra medium  
**Dependencias:** ninguna  
**Worktree/rama:** pendiente

## Coordinación multi-asistente

- Writer: uno.
- Readers: máximo dos, read-only.
- Claim: `DECL-001`.
- Lease: una sesión o hasta handoff.
- Reviewer: distinto del writer.
- WIP global máximo: 3.
- Solo una task-card de riesgo Muy alto en progreso.

## Objetivo observable

Medir exactamente cuánto código y qué responsabilidades viven en examples antes de moverlas.

## Checkpoint baseline 2026-07-31

- Causa probable: `src/examples` todavía concentra builders, recipes, pages y wiring que luego deberían migrar a la fachada declarativa.
- Evidencia actual: 28 archivos en `src/examples`, 3 en `src/sisad-pdfme/integration`, `npm run build` verde y 9 suites focales verdes.
- Invariantes: no modificar código funcional, no tocar geometría, no cruzar la frontera definition/resources/handlers.
- Archivos permitidos: `src/examples/**`, `src/sisad-pdfme/integration/**`, `reports/declarative-instances/**`.
- Test focal: `npx vitest run tests/unit/examples/labExamples.test.ts tests/unit/examples/runtimeConfig.test.ts tests/unit/examples/exampleControllerPanel.test.tsx tests/unit/examples/exampleShells.test.tsx tests/unit/features/pdfcomponent/labs/builders.test.ts tests/unit/features/pdfcomponent/template.test.ts tests/unit/sisad-pdfme/examples/exampleBuilder.test.ts tests/unit/sisad-pdfme/examples/multiUserExample.test.ts tests/unit/sisad-pdfme/ui/components/Designer/index.test.ts`
- Presupuesto restante: la tarea sigue en baseline; los siguientes pasos requieren gates y migración de símbolos.
- Condición de parada: si aparece necesidad de tocar geometría, superar 5 archivos o repetir la misma causa tres veces.

## Casos de uso cubiertos

UC-061, UC-062, UC-063, UC-064

Matriz: `reports/declarative-instances/01-USE-CASE-MATRIX.md`.

## Evidencia base

- Código: `src/examples/**` y `src/sisad-pdfme/**`.
- Plan: `.ai/plans/PLAN_MAESTRO_INSTANCIAS_DECLARATIVAS_SISAD_PDFME_2026-07-31.md`.
- ADR: `.ai/architecture/DECLARATIVE-INSTANCE-ARCHITECTURE.md`.
- Reporte de migración: `reports/declarative-instances/03-LOGIC-MIGRATION-MAP.md`.

## Lectura mínima

1. `.ai/START.md`
2. `.ai/routes/declarative-instances.md`
3. `.ai/governance/ANTI-HALLUCINATION.md`
4. `.ai/governance/ANTI-LOOP.md`
5. `.ai/governance/ANTI-OVERFLOW.md`
6. `.ai/architecture/PUBLIC-API-COMPATIBILITY.md`
7. `.ai/architecture/DECLARATIVE-INSTANCE-ARCHITECTURE.md`
8. Esta task-card

## Archivos candidatos

- `src/examples/**`
- `src/sisad-pdfme/integration/**`
- `reports/declarative-instances/**`

Los archivos son candidatos. Confirmar existencia y propiedad antes de editar.

## Archivos protegidos

- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts`
- `.tailwind-migration-backups/**`
- código específico de DigitalAgreements/Uanataca dentro del core

## Invariantes

- Core nuevo: TypeScript/TSX.
- Examples: JavaScript/JSX/JSON.
- Examples consumen entrypoints públicos.
- No deep imports `.ts`.
- No duplicar config merge, colors, ownership, events o recipes.
- `enabled` y `visible` son distintos.
- No eliminar APIs bajas existentes.
- No declarar gates verdes sin ejecutarlos.

## Caracterización previa

1. `git status --short`.
2. Registrar rama/worktree/commit base.
3. Abrir máximo 8 archivos inicialmente.
4. Máximo 2 búsquedas amplias.
5. Escribir hipótesis y prueba focal.
6. Medir antes de modificar.

## Pasos

1. Inventariar líneas, hooks, callbacks e imports por página.
2. Clasificar cada símbolo: EXAMPLE_UI, CORE_CANDIDATE, DUPLICATE_CORE, ADVANCED_DEMO o REMOVE.
3. Registrar comportamientos visibles y estados actuales.
4. Crear baseline de tests y screenshots.

## Criterios de aceptación

- [ ] Existe una tabla por archivo y símbolo.
- [ ] Cada responsabilidad tiene propietario propuesto.
- [ ] Se registran errores preexistentes.
- [ ] No se modifica código funcional.

## Gates focales

```bash
npm run lint
npm run build
npm run quality:direct-config-readers
npm run quality:example-style-boundary
npx vitest run <tests-focales>
```

Playwright cuando exista efecto visible.

## Presupuesto

- Máximo 5 archivos modificados.
- Máximo 8 archivos leídos inicialmente.
- Máximo 2 rondas de búsqueda.
- Máximo 3 intentos sobre la misma causa.
- Un dominio por tarea.

## Condición de parada

Detenerse si:

- se necesita tocar geometría;
- se exceden cinco archivos;
- aparece conflicto con CONFIG/RESTORE/UX;
- la solución introduce lógica host-specific;
- no existe prueba focal;
- la API pública requerida no está acordada;
- el contexto supera 75 %.

## Rollback

Commit atómico. Preservar snapshot, schemaUid, documentId, pageNumber, owner y APIs públicas.

## Handoff obligatorio

Registrar:

```txt
claim
commit base
archivos
causa confirmada
cambios
gates ejecutados
gates no ejecutados
casos UC cubiertos
riesgos
rollback
siguiente acción
```
