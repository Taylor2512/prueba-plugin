# COREUX-012 — Conectar CommandBus, eventos e historial

**Estado:** done  
**Wave:** W1  
**Prioridad:** P0  
**Riesgo:** Muy alto  
**Owner sugerido:** runtime-architect  
**Modelo sugerido:** Sol high  
**Dependencias:** COREUX-005, COREUX-011  
**Worktree/rama:** pendiente

## Restricción de activación

No pasar a Ready mientras el WIP global permanezca en 3. Antes de activarla,
reconciliar `CONFIG-020`, `CONFIG-001` y `UX-001`.

## Objetivo observable

Definir un envelope de comando y eventos de ejecución/undo/redo.

## Casos de uso

Dominios: CMD, EVT, INT.

CMD-001, CMD-002, CMD-003, CMD-004, CMD-005, CMD-006, CMD-007, CMD-008, CMD-009, CMD-010, CMD-011, CMD-012, CMD-013, CMD-014, CMD-015, EVT-001, EVT-002, EVT-003, EVT-004, EVT-005, EVT-006, EVT-007, EVT-008, EVT-009, EVT-010, EVT-011, EVT-012, EVT-013, EVT-014, EVT-015, INT-001, INT-002, INT-003, INT-004, INT-005, INT-006, INT-007, INT-008, INT-009, INT-010, INT-011, INT-012, INT-013, INT-014, INT-015

Fuente: `reports/core-ux/01-USE-CASE-MATRIX.md`.

## Patrones

Command, Memento

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

- `src/sisad-pdfme/commands/index.ts`
- `src/sisad-pdfme/ui/commands/designerCommands.ts`
- `src/sisad-pdfme/ui/commands/commandBus.ts`
- `tests/unit/sisad-pdfme/commands/**`

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
- Cero imports hacia examples/features/modules.
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

1. Agregar command id/correlation/cause.
2. Emitir executed/rejected/undone/redone.
3. Definir Memento mínimo por comando.
4. Evitar snapshots completos cuando no son necesarios.
5. Exponer canUndo/canRedo reactivo.

## Criterios de aceptación

- [x] Undo/redo reflejan historial real. **Bug corregido**: `execute` apilaba
      TODOS los comandos ignorando `meta.undoable`, pese a que el contrato decía
      lo contrario; un cambio de vista ensuciaba la pila y un undo deshacía algo
      que el usuario no había hecho.
- [x] Comando rechazado no ejecuta, no muta y no toca el historial; emite
      `rejected` con motivo (`invalid-command` / `blocked-by-guard`).
- [x] Eventos y toolbar sincronizados: cada fase lleva
      `{canUndo, canRedo, undoDepth, redoDepth}`.

Entrega: envelope `CommandLifecycleEvent` y `subscribeLifecycle()` dentro del
CommandBus existente — sin segundo bus. 13/13 en
`tests/unit/sisad-pdfme/commands/commandLifecycle.test.ts`.

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
