---
id: VISUX-001
state: backlog
wave: W0
priority: P0
risk: high
owner: qa-reviewer
model: Terra high
writer:
readers: []
dependsOn: []
refines: [COREUX-001, COREUX-054]
trace:
  useCases: [QLT-001, QLT-002, QLT-003, QLT-004, QLT-005, QLT-006, QLT-007, QLT-008, QLT-009, QLT-010, QLT-011, QLT-012, LAY-001, LAY-002, RSB-001, LSB-001]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: testing
  skills: [sisad-visual-regression, sisad-quality-gates]
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

# VISUX-001 — Congelar baseline visual y estados reproducibles

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Crear evidencia repetible de las nueve capturas y de los estados clave antes de modificar el producto.

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

- Refina: COREUX-001, COREUX-054
- Depende de: ninguna

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `reports/visual-behavior/**`
- `tests/e2e/**`
- `tests/playwright/**`

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

1. Registrar viewport, ruta, modo, recipient, selección, documento, paneles y zoom de cada captura.
2. Crear matriz de estados reproducibles: sidebars abiertos/cerrados, cada panel derecho, schema seleccionado y menú abierto.
3. Definir selectores estables basados en data-testid/data-*; evitar selectores por texto frágil.
4. Capturar baseline en 1280, 1440, 1600 y 1920 px.
5. Registrar diferencias permitidas y prohibidas.

## Acceptance

- [ ] Las nueve imágenes quedan indexadas.
- [ ] Cada estado tiene pasos de reproducción.
- [ ] El baseline no afirma comportamiento que no fue medido.
- [ ] No se modifica código productivo.

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
