---
id: VISUX-037
state: backlog
wave: W5
priority: P0
risk: very-high
owner: runtime-architect
model: Sol high
writer:
readers: []
dependsOn: [VISUX-004, VISUX-022, VISUX-028]
refines: [COREUX-010, COREUX-026, COREUX-033]
trace:
  useCases: [COL-001, COL-002, COL-003, COL-004, COL-005, COL-006, COL-007, COL-008, COL-009, COL-010, COL-011, COL-012, DTL-004, LST-004]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: assignments
  skills: [sisad-collaboration-assignments, sisad-action-state]
  requiredSymbols: []
  forbiddenPaths:
    - src//** salvo tests de integración explícitos
    - src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx salvo task específica
    - src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx salvo task específica
    - src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts salvo task específica
    - .tailwind-migration-backups/**
  maxFiles: 8
  maxTokens: 14000
---

# VISUX-037 — Unificar asignación, reserva de edición, readonly y posición fija

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Producir un SchemaAccessState único y labels distintos para cada concepto.

## Evidence

- IMG-05
- IMG-09

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-010, COREUX-026, COREUX-033
- Depende de: VISUX-004, VISUX-022, VISUX-028

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/collaboration/**`
- `src/sisad-pdfme/ui/collaboration/schemaRuntimeAccess.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/accessPolicy.ts`

Confirmar rutas reales antes de editar. Máximo cinco archivos productivos por
commit; dividir la task si el cambio supera un dominio.

## Forbidden paths

- `src//** salvo tests de integración explícitos`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx salvo task específica`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx salvo task específica`
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts salvo task específica`
- `.tailwind-migration-backups/**`

## Invariants

- Solo código productivo bajo `src/sisad-pdfme/**`.
- Core nuevo en TypeScript/TSX.
- Cero imports hacia `src/`, `src/features` o `src/modules`.
- No segundo registry, event bus, snapshot, renderer, access policy u overlay manager.
- No `setTimeout` para lifecycle.
- No z-index arbitrario.
- Un control visible tiene handler o reason.
- Preservar `schemaUid`, `documentId`, `pageNumber`, owner, locks y snapshot.
- No afirmar gates no ejecutados.

## Characterization test

1. Registrar `pwd`, rama, worktree, commit base y `git status --short`.
2. Abrir máximo ocho archivos.
3. Reproducir evidencia asociada.
4. Crear test rojo o assertion geométrica antes del parche.
5. Medir estado anterior y posterior.
6. Registrar claim.

## Steps

1. Definir owner/assignment/session user.
2. Definir readOnly/objectLocked/editReservation/positionFixed.
3. Resolver locked-by-me/other.
4. Consumir estado en Canvas, ListView, DetailView y actions.
5. Probar cambio de recipient y permisos.

## Acceptance

- [ ] Bloqueado por alice no aparece si Alice es la sesión actual y posee reserva propia.
- [ ] Fijar posición no se confunde con edición.
- [ ] Actions tienen paridad.
- [ ] Snapshot conserva estados.

## Gates

```bash
npm run typecheck
npm run lint
npm run build
npx vitest run <tests-focales>
git diff --check -- <archivos-tocados>
```

Agregar Playwright cuando cambie layout, foco, scroll o comportamiento visible.

## Stop condition

Detenerse y entregar handoff si:

- aparece necesidad de tocar otro dominio;
- se exceden cinco archivos productivos;
- existe conflicto con otra claim;
- la solución exige una API paralela;
- no se puede escribir un test focal;
- el cambio altera geometría/snapshot fuera del alcance;
- se intenta corregir con CSS del host o z-index arbitrario.

## Rollback

Commit atómico. Revertir únicamente la task y conservar evidencia de
caracterización. No borrar datos persistidos ni IDs para recuperar visuales.

## Handoff

```text
task:
claim/worktree:
commit base:
causa confirmada:
archivos:
cambios:
use cases:
commands/events/effects:
gates passed:
gates failed:
gates not run:
risks:
rollback:
next action:
stop:
```
