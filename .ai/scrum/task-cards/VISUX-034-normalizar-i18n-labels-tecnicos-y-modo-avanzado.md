---
id: VISUX-034
state: backlog
wave: W4
priority: P1
risk: medium
owner: ux-designer
model: Terra medium
writer:
readers: []
dependsOn: [VISUX-003, VISUX-023, VISUX-024]
refines: [COREUX-029, COREUX-030, COREUX-056]
trace:
  useCases: [LST-002, DTL-005, SCH-017]
  behaviors: []
  methods: []
  events: []
  effects: []
context:
  route: ux-design
  skills: [sisad-accessibility, sisad-inspector-contract]
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

# VISUX-034 — Normalizar i18n, labels técnicos y modo avanzado

## Activation

Mantener en Backlog hasta liberar WIP y comprobar que ninguna task `COREUX-*`
relacionada tiene claim activo sobre los mismos archivos.

Antes de activar, fusionar estos criterios en la fuente Scrum vigente y
registrar un solo writer/worktree.

## Objective

Eliminar mezclas inglés/español y reservar keys técnicas para modo avanzado.

## Evidence

- IMG-02
- IMG-05
- IMG-09

Fuentes de apoyo:

- `reports/visual-behavior/01-SCREENSHOT-AUDIT.md`
- `reports/visual-behavior/02-USE-CASE-MATRIX.md`
- `reports/visual-behavior/03-COMPONENT-MATRIX.md`

## Related work

- Refina: COREUX-029, COREUX-030, COREUX-056
- Depende de: VISUX-003, VISUX-023, VISUX-024

No crear una implementación paralela si la responsabilidad ya existe.

## Allowed files

- `src/sisad-pdfme/ui/i18n.ts`
- `src/sisad-pdfme/schemas/**/propPanel.*`
- `src/sisad-pdfme/ui/components/Designer/RightSidebar/**`

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

1. Inventariar strings sin i18n.
2. Priorizar label visible.
3. Definir technical mode para key, provider IDs y detalles.
4. Renombrar Variables Sample Data y P12 en UI.
5. Probar fallback de idioma.

## Acceptance

- [ ] Interfaz española no mezcla labels ingleses salvo contenido de fixture.
- [ ] Key técnica no domina la fila.
- [ ] No se cambian valores persistidos sin migración.
- [ ] Strings tienen claves estables.

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

<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-034-normalizar-i18n-labels-tecnicos-y-modo-avanzado.md:START -->
## Consolidation refinement
Remove product-facing Axios, Recipient, raw UIDs, mode names (`single`) and internal IDs from
normal mode. Keep them only in advanced/debug diagnostics where useful.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/scrum/task-cards/VISUX-034-normalizar-i18n-labels-tecnicos-y-modo-avanzado.md:END -->
