# DECL-032 — Separar ejemplos avanzados y eliminar utilidades duplicadas

**Estado:** backlog  
**Wave:** W5  
**Prioridad:** P1  
**Riesgo:** Alto  
**Owner sugerido:** implementer  
**Modelo sugerido:** Terra medium  
**Dependencias:** DECL-021, DECL-022, DECL-030, DECL-031  
**Worktree/rama:** pendiente

## Coordinación multi-asistente

- Writer: uno.
- Readers: máximo dos, read-only.
- Claim: `DECL-032`.
- Lease: una sesión o hasta handoff.
- Reviewer: distinto del writer.
- WIP global máximo: 3.
- Solo una task-card de riesgo Muy alto en progreso.

## Objetivo observable

Conservar controller/events/artifacts como demos avanzadas y retirar helpers genéricos de examples.

## Casos de uso cubiertos

UC-048, UC-047, UC-051, UC-054, UC-055, UC-061, UC-064

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

- `src/examples/pages/advanced/**`
- `src/examples/exampleBuilder.js`
- `src/examples/exampleBundle.js`
- `src/examples/data/runtimeConfig.js`
- `src/examples/data/showcaseTemplate.js`

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

1. Crear rutas advanced.
2. Mover panel controller/event log a esas rutas.
3. Sustituir bundle/artifacts por API pública.
4. Eliminar imports profundos.
5. Eliminar archivos cuando no tengan consumidores.

## Criterios de aceptación

- [ ] Ejemplos básicos sin paneles avanzados.
- [ ] No quedan deepMerge/decorators/layout genérico.
- [ ] No se pierde cobertura avanzada.
- [ ] Knip no reporta residuos nuevos.

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
