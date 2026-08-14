---
id: VISUX-042

wave: W6
priority: P0
risk: high
owner: qa-reviewer
model: Terra high
writer:
readers: []
dependsOn: [VISUX-035, VISUX-040, VISUX-041]
refines: [COREUX-053, COREUX-054, COREUX-055, COREUX-056]
trace:
  useCases: [QLT-001, QLT-002, QLT-003, QLT-004, QLT-005, QLT-006, QLT-007, QLT-008, QLT-009, QLT-010, QLT-011, QLT-012]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: testing
  skills: [sisad-visual-regression, sisad-testing-pyramid, sisad-quality-gates]
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

# VISUX-042 — Crear suite visual, gates, documentación y release

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Cerrar el programa con pruebas unitarias, contractuales, Playwright, regresión visual y documentación.

## Evidence

- IMG-01
- IMG-02
- IMG-03
- IMG-04
- IMG-05
- IMG-06
- IMG-07
- IMG-08
- IMG-09

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-053, COREUX-054, COREUX-055, COREUX-056
- Depende de: VISUX-035, VISUX-040, VISUX-041

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `tests/**`
- `docs/**`
- `reports/visual-behavior/**`
- `package.json`

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

1. Crear matriz de cobertura task→use case→test.
2. Añadir screenshots por viewport y estado.
3. Ejecutar gates completos.
4. Actualizar docs de sidebars, inspector, schemas y runtimes.
5. Preparar rollback y release notes.

## Acceptance

- [ ] Cero P0 abiertos.
- [ ] Todos los casos críticos tienen test.
- [ ] No hay drift entre docs y código.
- [ ] Build/typecheck/lint/tests pasan o se reportan honestamente.

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

<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/visual-ux/VISUX-042-crear-suite-visual-gates-documentacion-y-release.md:START -->
## Consolidation refinement
Visual release is a dependency of final production closeout.
Include the previously reviewed inspector/signature/reference image scenarios and prevent
technical implementation labels from leaking into normal UX.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/visual-ux/VISUX-042-crear-suite-visual-gates-documentacion-y-release.md:END -->
