---
id: COREUX-034
status: PARTIAL
---

# COREUX-034 — Unificar editor de opciones

**Wave:** W4  
**Prioridad:** P0  
**Riesgo:** Alto  
**Owner sugerido:** schema-specialist  
**Modelo sugerido:** Terra high  
**Dependencias:** COREUX-030  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Select, checkboxGroup y radioGroup comparten option model/editor.

## Casos de uso

Dominios: INS, SCH, INT.

INT-001, INT-002, INT-003, INT-004, INT-005, INT-006, INT-007, INT-008, INT-009, INT-010, INT-011, INT-012, INT-013, INT-014, INT-015, INS-001, INS-002, INS-003, INS-004, INS-005, INS-006, INS-007, INS-008, INS-009, INS-010, INS-011, INS-012, INS-013, INS-014, INS-015, SCH-001, SCH-002, SCH-003, SCH-004, SCH-005, SCH-006, SCH-007, SCH-008, SCH-009, SCH-010, SCH-011, SCH-012, SCH-013, SCH-014, SCH-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Composite, Strategy

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

- `src/sisad-pdfme/schemas/options/OptionListWidget.tsx`
- `src/sisad-pdfme/schemas/options/optionModel.ts`
- `src/sisad-pdfme/schemas/options/optionSelectionBehavior.ts`
- `tests/unit/sisad-pdfme/schemas/options/**`

## Recent progress

- Adopted canonical option id/text normalizers in the inspector editor and selection commands:
	- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/SchemaOptionsEditor.tsx`
	- `src/sisad-pdfme/ui/components/Designer/shared/selectionCommands.ts`
- Executed typecheck and linter; no regressions detected.
- Architecture reconciliation run: no drift.
 - Patched generator preflight and option model consumers to remove ad-hoc `option_{n}` fallbacks.
 - Replaced checkbox-to-group conversion defaults to use `buildDefaultOptionGroupOptions`.
 - Confirmed `npx tsc --noEmit`, `npm run lint --silent`, and reconcile script pass for modified files.

- Completed canonicalization across `radioGroup`, `optionGroupFactory`, `optionValueAdapter` and the `SchemaOptionsEditor`.
	Commit: `2fc72653`.
	Gates: `npx tsc --noEmit` (ok), `npm run lint --silent` (ok), `node scripts/ai/architecture/reconcile-task-statuses.mjs . --apply` (no drift).

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

1. Mantener optionId estable.
2. Add/remove/reorder/default.
3. Evitar defaults inválidos.
4. Validar labels/values.
5. Emitir patch único.

## Criterios de aceptación

- [ ] Single/multiple correctos.
- [ ] Botón + no es schema.
- [ ] Snapshot conserva optionId.
- [ ] Keyboard reorder accesible.

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
