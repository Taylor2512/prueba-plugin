# COREUX-011 — Unificar ActionConfigRegistry y designerActionState

**Estado:** done  
**Wave:** W1  
**Prioridad:** P0  
**Riesgo:** Muy alto  
**Owner sugerido:** config-specialist  
**Modelo sugerido:** Sol high  
**Dependencias:** COREUX-004, COREUX-010  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Eliminar definiciones de acciones que pueden divergir entre config y UI.

## Casos de uso

Dominios: CMD, QLT, SID.

CMD-001, CMD-002, CMD-003, CMD-004, CMD-005, CMD-006, CMD-007, CMD-008, CMD-009, CMD-010, CMD-011, CMD-012, CMD-013, CMD-014, CMD-015, SID-001, SID-002, SID-003, SID-004, SID-005, SID-006, SID-007, SID-008, SID-009, SID-010, SID-011, SID-012, SID-013, SID-014, SID-015, QLT-001, QLT-002, QLT-003, QLT-004, QLT-005, QLT-006, QLT-007, QLT-008, QLT-009, QLT-010, QLT-011, QLT-012, QLT-013, QLT-014, QLT-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Registry, Specification

## Lectura mínima

1. `.ai/START.md`
2. `.ai/routes/designer-core-ux.md`
3. `.ai/architecture/EVENT-COMMAND-EFFECT-ARCHITECTURE.md`
4. `.ai/architecture/DESIGNER-SURFACE-ARCHITECTURE.md`
5. `.ai/governance/ANTI-HALLUCINATION.md`
6. `.ai/governance/ANTI-LOOP.md`
7. `.ai/governance/ANTI-OVERFLOW.md`
8. Esta task-card

## Archivos candidatos

- `src/sisad-pdfme/config/actionConfigRegistry.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/actionRegistry.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerActionState.ts`
- `tests/unit/sisad-pdfme/actions/**`

Confirmar rutas antes de editar. No crear un archivo nuevo si la responsabilidad
ya existe bajo otro nombre.

## Archivos protegidos por defecto

- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerCoordinateService.ts`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`
- `src/sisad-pdfme/generator/**`
- `.tailwind-migration-backups/**`

Solo se permite tocar un archivo protegido cuando aparece explícitamente en
Archivos candidatos y existe prueba focal roja.

## Invariantes

- Solo código productivo bajo `src/sisad-pdfme/**`.
- TypeScript/TSX.
- Cero imports hacia /features/modules.
- No segundo registry, event bus, snapshot o renderer.
- No `setTimeout` de coordinación.
- No z-index arbitrario.
- Tailwind-first; `tokens.css` solo para variables técnicas.
- Un writer; máximo dos readers read-only.
- No afirmar gates no ejecutados.

## Caracterización previa

1. `pwd`
2. `git branch --show-current`
3. `git status --short`
4. registrar commit base;
5. abrir máximo 8 archivos;
6. máximo 2 búsquedas amplias;
7. escribir hipótesis y test focal;
8. registrar claim.

## Pasos

1. Elegir registry canónico.
2. Migrar chrome actions y aliases.
3. Resolver handler/visible/enabled/reason en un selector.
4. Agregar action explain sources.
5. Mantener IDs legacy mediante aliases.

## Criterios de aceptación

- [x] Una acción tiene una definición: sin ids duplicados, todas resolubles y
      sin alias huérfanos.
- [x] Sin handler no se renderiza (verificado sobre las 41 acciones).
- [x] Disabled siempre tiene reason (barrido de 6 contextos × 41 acciones).
- [ ] Reassign con recipients asignables: pertenece a COREUX-026.

La unificación ya estaba implementada; lo que faltaba era el gate que impide
volver a divergir. 13/13 en
`tests/unit/sisad-pdfme/actions/actionDefinitionConformance.test.ts`.

## Gates focales

```bash
npm run lint
npm run build
npm run quality:direct-config-readers
npm run quality:duplicate-functions
npx vitest run <tests-focales>
```

Agregar Playwright solo cuando cambie comportamiento visible.

## Presupuesto

- Máximo 5 archivos productivos.
- Máximo 8 lecturas iniciales.
- Máximo 2 rondas de búsqueda.
- Máximo 3 intentos de parche.
- Un dominio por commit.
- Contexto máximo 75 %.

## Condición de parada

Detenerse y entregar handoff si:

- se requiere tocar otro dominio;
- se excede presupuesto;
- aparece conflicto con otra claim;
- la solución exige una API paralela;
- no existe prueba focal;
- se filtra lógica del host;
- el cambio altera snapshot/geometría sin migración específica.

## Rollback

Commit atómico. Preservar:

```txt
schemaUid
documentId
pageNumber
ownerRecipientId
ownerRecipientIds
ownerColor
required
readOnly
locks
selection
zoom
scroll
snapshotVersion
```

## Handoff

```txt
task
claim
rama/worktree
commit base
causa confirmada
archivos
cambios
eventos/commands afectados
UC cubiertos
gates ejecutados
gates no ejecutados
riesgos
rollback
siguiente acción
```
