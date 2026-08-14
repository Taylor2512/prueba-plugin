---
id: VISUX-035
state: backlog
wave: W4
priority: P0
risk: very-high
owner: qa-reviewer
model: Sol high
writer:
readers: []
dependsOn: [VISUX-029, VISUX-030, VISUX-031, VISUX-032, VISUX-033]
refines: [COREUX-049, COREUX-050]
trace:
  useCases: [DTL-009, DTL-010, SCH-018, SCH-019, RUN-001, RUN-002, RUN-003, RUN-004, RUN-005, RUN-006, RUN-007, RUN-008, RUN-009, RUN-010]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: runtime-contracts
  skills: [sisad-form-viewer-parity, sisad-snapshot-compatibility]
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

# VISUX-035 — Probar paridad propiedad→runtimes→PDF→snapshot

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Verificar que cada propiedad visible del inspector se conserva y produce el mismo resultado en todas las superficies.

## Evidence

- IMG-05
- IMG-09

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-049, COREUX-050
- Depende de: VISUX-029, VISUX-030, VISUX-031, VISUX-032, VISUX-033

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `tests/unit/sisad-pdfme/schemas/**`
- `tests/integration/**`
- `src/sisad-pdfme/shared/snapshotAdapter.ts`

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

1. Crear matriz por familia.
2. Probar read/write del widget.
3. Renderizar Designer, Form y Viewer.
4. Generar PDF focal.
5. Serializar/restaurar snapshot.

## Acceptance

- [ ] 100% de widgets visibles tienen prueba de round-trip.
- [ ] No hay propiedad solo decorativa.
- [ ] Readonly/required/owner coinciden.
- [ ] Issues se reportan en tipos desconocidos.

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

<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-035-probar-paridad-propiedadruntimespdfsnapshot.md:START -->
## Consolidation refinement
For every visible property prove:
read -> edit -> persist -> Form -> Viewer -> Snapshot -> PDF.
Remote data must remain deterministic offline after commit.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-035-probar-paridad-propiedadruntimespdfsnapshot.md:END -->
