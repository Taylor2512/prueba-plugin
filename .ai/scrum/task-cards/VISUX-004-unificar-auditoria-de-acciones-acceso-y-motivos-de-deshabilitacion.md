---
id: VISUX-004
state: backlog
wave: W0
priority: P0
risk: very-high
owner: runtime-architect
model: Sol high
writer:
readers: []
dependsOn: [VISUX-002]
refines: [COREUX-010, COREUX-011, COREUX-012]
trace:
  useCases: [COL-001, COL-002, COL-003, COL-004, COL-005, COL-006, COL-007, COL-008, COL-009, COL-010, COL-011, COL-012, DTL-012, LST-005, LST-006]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: commands
  skills: [sisad-action-state, sisad-behavior-traceability]
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

# VISUX-004 — Unificar auditoría de acciones, acceso y motivos de deshabilitación

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Asegurar que toolbar, menús, lista e inspector calculen visible, enabled, executable y reason desde la misma fuente.

## Evidence

- IMG-05
- IMG-09

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-010, COREUX-011, COREUX-012
- Depende de: VISUX-002

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/config/actionConfigRegistry.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/designerActionState.ts`
- `src/sisad-pdfme/ui/components/Designer/shared/accessPolicy.ts`
- `src/sisad-pdfme/ui/commands/**`

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

1. Inventariar acciones repetidas por superficie.
2. Comparar políticas para duplicate, delete, hide/show, lock, required, reassign y open-properties.
3. Definir un descriptor por acción y un selector contextual.
4. Prohibir handlers silenciosos y acciones visibles sin reason.
5. Añadir pruebas de paridad entre superficies.

## Acceptance

- [ ] Una acción produce el mismo estado en todas las superficies.
- [ ] Eliminar no aparece duplicado sin justificación.
- [ ] Abrir propiedades se oculta si Detalle ya está activo.
- [ ] Cada disabled tiene reason.

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
