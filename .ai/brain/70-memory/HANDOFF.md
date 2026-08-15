# Handoff seed

Última sesión: Claude, rama `main`, sin worktrees. Todos los claims liberados
(`same-repo-coordinator status` → vacío). **Sin commit**: el árbol queda con los
cambios sin confirmar porque esta sesión no tuvo el lease `integrator`.

## Qué se cerró

- **RTP-510** pasó de `BLOCKED` a `PARTIAL` (derivado de evidencia, no a mano).
  Multi-documento, aislamiento de firma/artifacts e interaction state
  observable quedan cerrados con evidencia de navegador.
- **Deuda TypeScript**: 147 → 88 errores.
- Tres piezas de tooling de release que estaban rotas: el reconciler de
  estados, el gate `source-language-boundary` y los alias de Vite.

Detalle en `reports/runtime-platform/evidence/RTP-510.md` y `RTP-545.md`.

## Estado medido (en serie, sin trabajo concurrente)

```text
vitest        491 archivos / 2952 tests PASS
playwright    64 PASS / 2 skipped
build         PASS
tsc           88
architecture  ARCHITECTURE_VERIFY_PASS
```

## Hallazgo estructural que gobierna lo que viene

La campaña construyó primitivas correctas y **no las cableó**. `ExecutionScopeStore`
se cableó en esta pasada; siguen huérfanas:

- `runtime/DataSourceRuntime` — sin consumidor de producción. Es lo que RTP-515
  debe montar sobre `schemas/select`.
- `runtime/completionProjection` — sin consumidor de producción.

Antes de construir nada nuevo en esas áreas, comprobar si la primitiva ya existe.

## Primer pendiente exacto

**RTP-515**: cablear `DataSourceRuntime` a `schemas/select`/`schemas/options`
con debounce, estados de carga/vacío/error, reintento, paginación por cursor y
virtualización. Es lo único que queda para que RTP-510 sea PASS.

Después, por dependencias: RTP-530 → RTP-535 → RTP-540 → RTP-545.

## Deuda TypeScript restante (88), por foco

- `ui/collaboration.ts` (12) — `SchemaCommentAnchor.id` es requerido mientras el
  normalizador produce `id` opcional. **Decidir cuál es la verdad** antes de
  tocar el tipo: si un anchor puede existir sin id, manda el normalizador.
- `SchemaConnectionsWidget` (6), `SchemaCollaborationWidget` (5),
  `shared/snapshotAdapter.ts` (5), `schemas/checkbox/index.ts` (4).

## Deuda de tooling anotada, no resuelta

`npm run quality:template-contracts` busca
`src/domain/forms/templates/formTemplates.json`, ruta del host original que no
existe en este repositorio standalone.

<!-- SISAD-PDFME-CONSOLIDATION:.ai/brain/70-memory/HANDOFF.md:START -->
## Three-agent handoff rule

Before taking over interrupted work:
inspect live diff, active claim, task evidence and focal tests.
Do not trust the previous provider's Todo list as execution truth.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/brain/70-memory/HANDOFF.md:END -->
