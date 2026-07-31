# DECL-006 — Mover composición base+perfil+overrides al core

**Estado:** backlog  
**Wave:** W1  
**Prioridad:** P0  
**Riesgo:** Alto  
**Owner sugerido:** config-specialist  
**Modelo sugerido:** Terra high  
**Dependencias:** DECL-005  
**Worktree/rama:** pendiente

## Coordinación multi-asistente

- Writer: uno.
- Readers: máximo dos, read-only.
- Claim: `DECL-006`.
- Lease: una sesión o hasta handoff.
- Reviewer: distinto del writer.
- WIP global máximo: 3.
- Solo una task-card de riesgo Muy alto en progreso.

## Objetivo observable

Eliminar `deepMerge` y perfiles de config implementados en examples.

## Casos de uso cubiertos

UC-049, UC-061

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

- `src/sisad-pdfme/config/SisadPdfmeConfigService.ts`
- `src/sisad-pdfme/config/resolveSisadPdfmeConfig.ts`
- `src/sisad-pdfme/instance/resolveSisadPdfmeInstance.ts`
- `tests/unit/sisad-pdfme/config/**`

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

1. Reutilizar el merge canónico.
2. Definir precedence definition/config/overrides.
3. Reemplazar arrays, no concatenarlos.
4. Evitar mutar config importada.
5. Exponer explain sources.

## Criterios de aceptación

- [ ] Examples no necesitan deepMerge.
- [ ] Arrays tienen semántica documentada.
- [ ] Misma entrada produce misma config.
- [ ] Config dinámica conserva classification.

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
