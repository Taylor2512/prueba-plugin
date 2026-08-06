---
id: VISUX-013
state: backlog
wave: W2
priority: P1
risk: medium
owner: ux-designer
model: Terra high
writer:
readers: []
dependsOn: [VISUX-005, VISUX-006]
refines: [COREUX-021, COREUX-023]
trace:
  useCases: [LSB-001, LSB-002, LSB-003, LAY-010]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: left-sidebar
  skills: [sisad-left-sidebar-catalog, sisad-tailwind-design-system]
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

# VISUX-013 — Compactar shell, tabs y colapso del LeftSidebar

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Reducir fragmentación superior y asegurar labels legibles en todos los tiers.

## Evidence

- IMG-04

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-021, COREUX-023
- Depende de: VISUX-005, VISUX-006

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/ui/components/Designer/LeftSidebar.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarTabs.tsx`
- `src/sisad-pdfme/ui/components/Designer/LeftSidebarSearch.tsx`

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

1. Reordenar header, tabs, búsqueda y quick filters.
2. Aplicar labels completos/abreviados/icon-only por density.
3. Unificar handle con rail.
4. Reducir contenedores decorativos redundantes.
5. Mantener data-testid y API.

## Acceptance

- [ ] No se cortan Base/Custom/Auto.
- [ ] La búsqueda permanece visible cuando corresponde.
- [ ] El colapso no desplaza el papel.
- [ ] No se reduce legibilidad para ganar espacio.

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
