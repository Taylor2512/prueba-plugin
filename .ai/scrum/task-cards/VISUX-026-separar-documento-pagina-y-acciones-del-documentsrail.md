---
id: VISUX-026
state: backlog
wave: W3
priority: P0
risk: very-high
owner: runtime-architect
model: Sol high
writer:
readers: []
dependsOn: [VISUX-019]
refines: [COREUX-027, COREUX-046]
trace:
  useCases: [DOC-001, DOC-002, DOC-003, DOC-004, DOC-005, DOC-006, DOC-007, DOC-008, DOC-009, DOC-010, DOC-011, DOC-012]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: runtime-contracts
  skills: [sisad-multi-document-routing, sisad-right-sidebar-contract]
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

# VISUX-026 — Separar documento, página y acciones del DocumentsRail

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Representar jerarquía documento→páginas y eliminar affordances duplicados.

## Evidence

- IMG-07
- IMG-08

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-027, COREUX-046
- Depende de: VISUX-019

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/ui/components/Designer/RightSidebar/DocumentsRail.tsx`
- `src/sisad-pdfme/documents/index.ts`
- `src/sisad-pdfme/react/SisadPdfmeDesigner.tsx`

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

1. Definir document items y page items.
2. Subir PDF agrega documento; Nueva página agrega página al activo.
3. Eliminar botón + ambiguo o convertirlo en menú explícito.
4. Integrar contador en header.
5. Cerrar delete/reorder/object URL lifecycle.

## Acceptance

- [ ] Documento y página no se confunden.
- [ ] Cada acción tiene un resultado único.
- [ ] Eliminar mantiene routing válido.
- [ ] Form/Viewer reciben documento activo cuando corresponda.

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
