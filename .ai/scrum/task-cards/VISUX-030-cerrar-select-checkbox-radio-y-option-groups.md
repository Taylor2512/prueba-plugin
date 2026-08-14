---
id: VISUX-030
state: backlog
wave: W4
priority: P0
risk: very-high
owner: schema-specialist
model: Sol high
writer:
readers: []
dependsOn: [VISUX-024, VISUX-028]
refines: [COREUX-034, COREUX-038]
trace:
  useCases: [SCH-008, SCH-009, SCH-010, SCH-011, SCH-020]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: schemas
  skills: [sisad-schema-family-refactor, sisad-canvas-interaction]
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

# VISUX-030 — Cerrar select, checkbox, radio y option groups

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Hacer visibles y operables los grupos, opciones, root selection y botón agregar.

## Evidence

- IMG-03
- IMG-04

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-034, COREUX-038
- Depende de: VISUX-024, VISUX-028

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/schemas/select/**`
- `src/sisad-pdfme/schemas/checkbox/**`
- `src/sisad-pdfme/schemas/checkboxGroup/**`
- `src/sisad-pdfme/schemas/radioGroup/**`
- `src/sisad-pdfme/schemas/options/**`

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

1. Definir root/option/add DOM contract.
2. Aumentar hit area sin agrandar indicador.
3. Diferenciar Designer double-click de Form click.
4. Unificar editor de opciones.
5. Probar vertical, horizontal, add/remove/reorder.

## Acceptance

- [ ] El grupo se percibe como grupo.
- [ ] Click selecciona root en Designer.
- [ ] Form cambia valor sin seleccionar chrome.
- [ ] PDF representa el valor correcto.

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

<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-030-cerrar-select-checkbox-radio-y-option-groups.md:START -->
## Consolidation refinement
Choice inspector covers static + remote options, typed values, selectedMissingPolicy,
search/pagination/virtualization and multiple independent instances.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-030-cerrar-select-checkbox-radio-y-option-groups.md:END -->
