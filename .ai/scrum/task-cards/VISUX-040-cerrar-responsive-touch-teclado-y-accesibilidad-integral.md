---
id: VISUX-040
state: backlog
wave: W5
priority: P0
risk: high
owner: accessibility
model: Terra high
writer:
readers: []
dependsOn: [VISUX-006, VISUX-010, VISUX-018, VISUX-039]
refines: [COREUX-051]
trace:
  useCases: [A11Y-001, A11Y-002, A11Y-003, A11Y-004, A11Y-005, A11Y-006, A11Y-007, A11Y-008, A11Y-009, A11Y-010, A11Y-011, A11Y-012, LAY-007, LAY-008, LAY-009]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: testing
  skills: [sisad-accessibility, sisad-responsive-ux]
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

# VISUX-040 — Cerrar responsive, touch, teclado y accesibilidad integral

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Hacer operables todas las superficies con teclado, touch y lector de pantalla.

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

- Refina: COREUX-051
- Depende de: VISUX-006, VISUX-010, VISUX-018, VISUX-039

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/ui/components/**`
- `tests/e2e/**`
- `tests/unit/sisad-pdfme/ui/**`

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

1. Crear matriz keyboard/touch.
2. Validar tabs, menús, modales, drag alternatives y focus restore.
3. Aplicar hit areas.
4. Probar reduced motion y contraste.
5. Validar mobile/tablet layouts.

## Acceptance

- [ ] No hay trampas de foco.
- [ ] Todos los iconos tienen nombre.
- [ ] Touch puede seleccionar y abrir paneles.
- [ ] Estados se anuncian.

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
