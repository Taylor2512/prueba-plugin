---
id: VISUX-023
state: backlog
wave: W3
priority: P0
risk: high
owner: schema-specialist
model: Terra high
writer:
readers: []
dependsOn: [VISUX-019, VISUX-004]
refines: [COREUX-029, COREUX-030]
trace:
  useCases: [DTL-001, DTL-002, DTL-003, DTL-004, DTL-012]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: inspector
  skills: [sisad-inspector-contract, sisad-schema-behavior-matrix]
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

# VISUX-023 — Corregir header e identidad del DetailView

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Mostrar nombre, tipo, página, owner y estado de acceso de forma uniforme para todas las familias.

## Evidence

- IMG-05
- IMG-09

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-029, COREUX-030
- Depende de: VISUX-019, VISUX-004

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailView.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/DetailHeader.tsx`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/detailSchemas.ts`

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

1. Probar identity widget por familia.
2. Eliminar duplicidad input + botón Renombrar.
3. Diferenciar En edición por ti, reservado por otra persona, readonly y posición fija.
4. Derivar header desde schema access state.
5. Asegurar labels localizados.

## Acceptance

- [ ] Signature no muestra nombre vacío si existe.
- [ ] El header no dice Bloqueado por el usuario actual.
- [ ] Renombrar tiene una sola interacción.
- [ ] Acciones incompatibles no aparecen habilitadas.

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

<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-023-corregir-header-e-identidad-del-detailview.md:START -->
## Consolidation refinement
Normal product UI uses User/assignee language.
Raw UID, legacy Recipient aliases and technical owner IDs belong to advanced/debug mode.
Assignment, lock and audit are separate.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-023-corregir-header-e-identidad-del-detailview.md:END -->
