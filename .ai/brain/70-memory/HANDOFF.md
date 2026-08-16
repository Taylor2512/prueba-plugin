# Handoff seed

Última sesión: Claude, rama `main`, sin worktrees. Claim liberado
(`same-repo-coordinator status` → vacío).

## Aviso sobre el árbol

Durante la sesión apareció el commit `75af3b4`, hecho **fuera de esta sesión**,
que barrió el árbol entero: mis cambios, los de otro proveedor y un volcado de
`unificados/` de ~89k líneas. Su mensaje —«add initial release closeout plan»—
no describe la mayor parte de lo que contiene.

No se reescribió historia. Quedan sin confirmar el troceo del plan de
continuidad, la política de tamaño de markdown y las vistas regeneradas.

## Qué se cerró

La cola runtime-platform quedó en **24 de 25 PASS**.

| Task | Antes | Ahora |
|---|---|---|
| RTP-515 | BACKLOG | **PASS** — harness de estrés derivado del registry |
| RTP-520 | PARTIAL | **PASS** — se desbloqueó al cerrar 515 |
| RTP-530 | PARTIAL | **PASS** — auditoría de exports, ratchet, fuga de credenciales |
| RTP-535 | BACKLOG | **PASS** — duplicación de vuelta bajo umbral |
| RTP-540 | PARTIAL | **PASS** — se desbloqueó al cerrar 535 |
| RTP-545 | PARTIAL | PARTIAL — 8 de 9 criterios cerrados |

## Estado medido (en serie)

```text
vitest        500 archivos / 3071 tests PASS
tsc           0            (venía de 88)
lint          0 errores    (32 warnings preexistentes)
build         PASS
architecture  ARCHITECTURE_VERIFY_PASS
jscpd owned   0.5636 %     (umbral 0.57 %)
knip cycles   0
brokenLinks   0            (venía de 10)
```

## El único pendiente real del release

**27 módulos sin camino de producción**, bajados desde 55. 18 primitivas de la
campaña se cablearon exportándolas en `integration/index.ts` —para una librería,
«cablear» es hacerlas importables— y 10 ficheros se retiraron por duplicar algo
vivo.

Los 27 restantes están clasificados en tres grupos con causa distinta, en
`reports/runtime-platform/evidence/RTP-545.md`:

- 18 sin ningún importador (internos del Designer, barrels muertos, capabilities
  sin decidir);
- 6 vivos sólo a través de un barrel muerto (`shared/index`);
- 2 sombreados por el alias de `converter`.

Cada uno necesita decisión de producto —exponer o retirar— con evidencia
conductual, el criterio que RTP-530 aplicó a `RegisteredUsersSelector`.

Es lo único que falta para que RTP-545 sea PASS.

## Dos generaciones de task-cards

La campaña tiene la ola 000–420 y la 425–545 **solapadas**: la segunda reformula
a la primera y es sobre la que se ejecutó. RTP-095 pide, palabra por palabra, el
harness que entrega RTP-515.

Siete cards superadas quedan `ARCHIVED` con puntero. Criterio en
[ADR-RTP-021](../30-decisions/ADR-RTP-021-TWO-GENERATION-CARD-OVERLAP.md).
`config/tooling/markdown-architecture-policy.json` ya declaraba
`runtimeActiveRange: 425–545`; el ADR explica por qué existe esa ventana.

**No leer las 43 cards en BACKLOG de la primera ola como 43 tareas pendientes.**

## Antes de construir nada nuevo

Comprobar si la primitiva ya existe. La lista de huérfanos es exactamente el
catálogo de lo que ya está construido y parece faltar.

## Dos correcciones de auditorías previas

- Los «cuatro `fetch()` directos» de RTP-530 eran **tres**.
  `runtime/usePdfmeArtifacts.ts:261` lee object URLs (`blob:`) locales: no sale
  del navegador. Documentado en el sitio para que no se vuelva a marcar.
- La regla «markdown bajo `.ai/` entre 100 y 1000 líneas» era **falsa**: 730 de
  731 violaciones eran documentos demasiado cortos, y el mínimo contradecía a
  `.ai/CONTEXT-BUDGET.md`. Retirado el mínimo, conservado el máximo.

## Tooling roto, anotado y sin resolver

- falta `configs/compatibility-language-allowlist.json` →
  `quality:compatibility-language` revienta con `ENOENT`;
- `quality:template-contracts` busca
  `src/domain/forms/templates/formTemplates.json`, ruta del host original
  inexistente en este repositorio standalone;
- `quality:large-files`, `quality:file-size-range` y
  `quality:duplicate-functions` en rojo por deuda estructural preexistente
  (6 ficheros de más de 700 líneas, máximo 916).

## Decisión de producto pendiente

`SchemaHttpAuthConfig` sigue admitiendo `token`, `username`, `password` y
`headerValue` literales dentro de la plantilla. La **fuga está cerrada**
—`serializeSnapshotForTxt` ya limpia credenciales—, pero el tipo sigue
invitando a escribirlas. El modelo correcto es `mode: 'inherit'` más una
referencia que el host resuelve. Retira capacidad visible del inspector, así
que necesita su propia task.

<!-- SISAD-PDFME-CONSOLIDATION:.ai/brain/70-memory/HANDOFF.md:START -->
## Three-agent handoff rule

Before taking over interrupted work:
inspect live diff, active claim, task evidence and focal tests.
Do not trust the previous provider's Todo list as execution truth.
<!-- SISAD-PDFME-CONSOLIDATION:.ai/brain/70-memory/HANDOFF.md:END -->
