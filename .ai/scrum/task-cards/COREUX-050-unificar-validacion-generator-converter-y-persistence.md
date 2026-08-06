# COREUX-050 — Unificar validación, generator, converter y persistence

**Estado:** backlog  
**Wave:** W5  
**Prioridad:** P0  
**Riesgo:** Muy alto  
**Owner sugerido:** runtime-architect  
**Modelo sugerido:** Sol high  
**Dependencias:** COREUX-018, COREUX-019, COREUX-047, COREUX-049  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Cerrar perfiles de validación, artifacts y almacenamiento sin lógica host.

## Casos de uso

Dominios: RUN, DOC, EVT.

EVT-001, EVT-002, EVT-003, EVT-004, EVT-005, EVT-006, EVT-007, EVT-008, EVT-009, EVT-010, EVT-011, EVT-012, EVT-013, EVT-014, EVT-015, DOC-001, DOC-002, DOC-003, DOC-004, DOC-005, DOC-006, DOC-007, DOC-008, DOC-009, DOC-010, DOC-011, DOC-012, DOC-013, DOC-014, DOC-015, RUN-001, RUN-002, RUN-003, RUN-004, RUN-005, RUN-006, RUN-007, RUN-008, RUN-009, RUN-010, RUN-011, RUN-012, RUN-013, RUN-014, RUN-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Strategy, Adapter, Facade

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

- `src/sisad-pdfme/generator/preflight.ts`
- `src/sisad-pdfme/runtime/usePdfmeArtifacts.ts`
- `src/sisad-pdfme/adapters/persistenceAdapter.ts`
- `src/sisad-pdfme/runtime/**`
- `tests/unit/sisad-pdfme/runtime/**`

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

1. Definir design/fill/generate/submit profiles.
2. Integrar async hydration conflict policy.
3. Autosave debounce/abort.
4. Generator/converter lifecycle.
5. Emitir validation/save/export events.

## Criterios de aceptación

- [ ] No se genera con blockers.
- [ ] Hydration no pisa dirty fields.
- [ ] Cleanup completo.
- [ ] Adapters genéricos.

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
