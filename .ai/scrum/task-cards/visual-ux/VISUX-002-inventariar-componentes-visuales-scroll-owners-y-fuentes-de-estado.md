---
id: VISUX-002

wave: W0
priority: P0
risk: high
owner: runtime-architect
model: Sol high
writer:
readers: []
dependsOn: [VISUX-001]
refines: [COREUX-002, COREUX-004, COREUX-020, COREUX-024]
trace:
  useCases: [LAY-001, LAY-002, LAY-003, LAY-004, LAY-005, LAY-006, LAY-007, LAY-008, LAY-009, LAY-010, LAY-011, LAY-012, RSB-001, RSB-002, RSB-003, RSB-004, RSB-005, RSB-006, RSB-007, RSB-008, RSB-009, RSB-010, RSB-011, RSB-012, LSB-001, LSB-002, LSB-003, LSB-004, LSB-005, LSB-006, LSB-007, LSB-008, LSB-009, LSB-010, LSB-011, LSB-012, LST-001, LST-002, LST-003, LST-004, LST-005, LST-006, LST-007, LST-008, LST-009, LST-010, LST-011, LST-012, DTL-001, DTL-002, DTL-003, DTL-004, DTL-005, DTL-006, DTL-007, DTL-008, DTL-009, DTL-010, DTL-011, DTL-012, CMT-001, CMT-002, CMT-003, CMT-004, CMT-005, CMT-006, CMT-007, CMT-008, DOC-001, DOC-002, DOC-003, DOC-004, DOC-005, DOC-006, DOC-007, DOC-008, DOC-009, DOC-010, DOC-011, DOC-012]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: designer-core-ux
  skills: [sisad-capability-audit, sisad-behavior-traceability]
  requiredSymbols: []
  forbiddenPaths:
    - src//** salvo tests de integración explícitos
    - src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx salvo task específica
    - src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx salvo task específica
    - src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts salvo task específica
    - .tailwind-migration-backups/**
  maxFiles: 8
  maxTokens: 14000
status: BACKLOG
---

# VISUX-002 — Inventariar componentes visuales, scroll owners y fuentes de estado

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Mapear cada superficie visual a su estado, policy, command, event, effect, scroll owner y archivo responsable.

## Evidence

- IMG-01
- IMG-02
- IMG-04
- IMG-06
- IMG-07

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-002, COREUX-004, COREUX-020, COREUX-024
- Depende de: VISUX-001

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/ui/components/**`
- `src/sisad-pdfme/config/**`
- `reports/visual-behavior/**`

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

1. Inventariar Root, stage, Canvas, CtlBar, LeftSidebar, RightSidebar y modales.
2. Marcar un solo scroll owner por panel.
3. Identificar decisiones duplicadas de visible/enabled/reason/handler.
4. Crear mapa UI intent → policy → command → mutation → event → effect → snapshot.
5. Señalar responsabilidades del host que se filtraron al core o viceversa.

## Acceptance

- [ ] Cada componente tiene owner funcional.
- [ ] No quedan scroll owners ambiguos.
- [ ] Las duplicidades se registran antes de refactorizar.
- [ ] El mapa enlaza archivos reales.

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
