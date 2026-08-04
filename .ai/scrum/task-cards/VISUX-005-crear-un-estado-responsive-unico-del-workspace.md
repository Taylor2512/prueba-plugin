---
id: VISUX-005
state: backlog
wave: W1
priority: P0
risk: very-high
owner: runtime-architect
model: Sol high
writer:
readers: []
dependsOn: [VISUX-002]
refines: [COREUX-020]
trace:
  useCases: [LAY-001, LAY-002, LAY-003, LAY-004, LAY-005, LAY-006, LAY-007, LAY-008, LAY-009, LAY-010, LAY-011, LAY-012, RUN-010]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: responsive-ux
  skills: [sisad-responsive-ux, sisad-react-performance]
  requiredSymbols: []
  forbiddenPaths:
    - src/examples/** salvo tests de integración explícitos
    - src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx salvo task específica
    - src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx salvo task específica
    - src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts salvo task específica
    - .tailwind-migration-backups/**
  maxFiles: 8
  maxTokens: 14000
---

# VISUX-005 — Crear un estado responsive único del workspace

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Resolver layout por tamaño real del root y devolver política única para stage, sidebars, toolbar, tabs y canvas.

## Evidence

- IMG-01
- IMG-03
- IMG-04

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-020
- Depende de: VISUX-002

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/ui/components/Designer/index.tsx`
- `src/sisad-pdfme/ui/components/Designer/shared/useResponsiveDensity.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerUiConfig.ts`

Confirmar rutas reales antes de editar. Máximo cinco archivos productivos por
commit; dividir la task si el cambio supera un dominio.

## Forbidden paths

- `src/examples/** salvo tests de integración explícitos`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Moveable.tsx salvo task específica`
- `src/sisad-pdfme/ui/components/Designer/Canvas/Selecto.tsx salvo task específica`
- `src/sisad-pdfme/ui/components/Designer/shared/coordinateMath.ts salvo task específica`
- `.tailwind-migration-backups/**`

## Invariants

- Solo código productivo bajo `src/sisad-pdfme/**`.
- Core nuevo en TypeScript/TSX.
- Cero imports hacia `src/examples`, `src/features` o `src/modules`.
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

1. Medir root con un único ResizeObserver.
2. Definir tiers wide/desktop/tablet/compact/mobile.
3. Resolver panelPolicy, presentations, widths y density.
4. Eliminar decisiones responsive duplicadas de LeftSidebar y RightSidebar.
5. Probar que resize no reconstruye engine.

## Acceptance

- [ ] Una sola salida responsive gobierna todas las superficies.
- [ ] No se usa window.innerWidth como autoridad.
- [ ] No hay loop de ResizeObserver.
- [ ] El engine conserva identidad.

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
