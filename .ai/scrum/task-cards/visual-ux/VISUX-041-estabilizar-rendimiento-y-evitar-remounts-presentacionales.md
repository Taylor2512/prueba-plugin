---
id: VISUX-041

wave: W5
priority: P0
risk: very-high
owner: performance
model: Sol high
writer:
readers: []
dependsOn: [VISUX-005, VISUX-038, VISUX-039]
refines: [COREUX-052]
trace:
  useCases: [RUN-010, LAY-002, QLT-001]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: runtime
  skills: [sisad-react-performance, sisad-controller-parity]
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

# VISUX-041 — Estabilizar rendimiento y evitar remounts presentacionales

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Conservar engine, EventHub, selection y viewport durante cambios visuales.

## Evidence

- IMG-01
- IMG-04

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-052
- Depende de: VISUX-005, VISUX-038, VISUX-039

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/react/useSisadPdfmeConfigService.ts`
- `src/sisad-pdfme/runtime/usePdfmeRuntimeInstance.ts`
- `src/sisad-pdfme/ui/components/Designer/index.tsx`

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

1. Instrumentar identidades.
2. Probar rerenders por sidebars, tabs, inputs y recipient.
3. Memoizar config/resolvers por campos.
4. Evitar clones profundos innecesarios.
5. Medir templates grandes.

## Acceptance

- [ ] Engine/EventHub conservan identidad en cambios presentacionales.
- [ ] No se pierden selection/zoom/scroll.
- [ ] No hay efectos repetidos.
- [ ] Rendimiento queda documentado.

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

<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/visual-ux/VISUX-041-estabilizar-rendimiento-y-evitar-remounts-presentacionales.md:START -->
## Consolidation refinement
Measure runtime config updates, large option lists, multi-page Form, signature assets and
mount/dispose memory. Presentation-only config must not remount Form.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/visual-ux/VISUX-041-estabilizar-rendimiento-y-evitar-remounts-presentacionales.md:END -->
