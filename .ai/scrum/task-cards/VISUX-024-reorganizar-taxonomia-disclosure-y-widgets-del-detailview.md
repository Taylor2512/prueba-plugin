---
id: VISUX-024
state: backlog
wave: W3
priority: P0
risk: very-high
owner: schema-specialist
model: Sol high
writer:
readers: []
dependsOn: [VISUX-023]
refines: [COREUX-029, COREUX-030, COREUX-032, COREUX-033]
trace:
  useCases: [DTL-005, DTL-006, DTL-007, DTL-008, DTL-009, DTL-010, DTL-011]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: inspector
  skills: [sisad-inspector-contract, sisad-schema-family-refactor]
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

# VISUX-024 — Reorganizar taxonomía, disclosure y widgets del DetailView

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Agrupar propiedades por identidad, contenido, reglas, interacción, visualización, datos, asignación y avanzado.

## Evidence

- IMG-05
- IMG-09

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-029, COREUX-030, COREUX-032, COREUX-033
- Depende de: VISUX-023

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DetailView/**`
- `src/sisad-pdfme/config/InspectorConfigurationResolver.ts`

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

1. Definir profile por familia y orden de secciones.
2. Formalizar WidgetContract.
3. Aplicar disclosure según frecuencia.
4. Mover Variables Sample Data a contenido/datos y localizarlo.
5. Mostrar reasons en widgets disabled.

## Acceptance

- [ ] Mismos conceptos aparecen en la misma sección.
- [ ] Cada widget declara read/write/propertyPath.
- [ ] Secciones avanzadas no saturan el panel.
- [ ] Scroll estable al editar.

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

<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-024-reorganizar-taxonomia-disclosure-y-widgets-del-detailview.md:START -->
## Consolidation refinement
Complete F3/F4: sections derive from family/capabilities/dataBinding.
No generic universal inspector.
No duplicated nested titles.
Geometry/form rows use compact progressive disclosure.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-024-reorganizar-taxonomia-disclosure-y-widgets-del-detailview.md:END -->
