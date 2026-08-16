# ADR RTP-021 — Dos generaciones de task-cards en la misma campaña

## Hecho medido

La campaña Runtime Platform tiene **91 cards** en dos generaciones que se
solapan:

- **000–420**: 50 en `BACKLOG`, 16 en `PARTIAL`, 1 `READY`.
- **425–545**: 24 en `PASS`, 1 en `PARTIAL`.

La segunda generación no continúa a la primera: **la reformula**. La ejecución
real de la campaña ocurrió sobre la segunda.

## Cómo se detectó

Al reconciliar RTP-410 («Crear all-schema execution/completion harness») se vio
que pedía exactamente lo mismo que RTP-515 («Crear all-schema stress harness
dinámico»), ya cerrado. Revisando el resto aparece el mismo patrón.

RTP-095 es el caso más claro. Su `Required work` dice literalmente:

```text
1. derivar casos del registry
2. crear pairs representativos por interactionKind
3. repro old-field→new-field rollback
4. agregar two-instance pair tests
```

Es, punto por punto, lo que entrega el harness de RTP-515
(`tests/unit/sisad-pdfme-comprehensive/helpers/allSchemaStressHarness.ts`).

## Decisión

**Una card de la primera generación cuyo trabajo ya entregó una card `PASS` de
la segunda no se reimplementa.** Se marca `ARCHIVED` con puntero explícito a la
card que la superó.

Reimplementarlas produciría dos implementaciones del mismo comportamiento, que
es precisamente lo que RTP-535 acaba de reducir.

## Criterio de archivado

Sólo se archiva cuando se cumplen las tres:

1. el objetivo de la card antigua está contenido en el de la nueva;
2. la card nueva está en `PASS` **efectivo**, no sólo declarado;
3. existe artefacto vivo —módulo o test— que se puede señalar.

Si falta cualquiera, la card se queda como está. No se archiva por parecido de
título.

## Mapa aplicado

| Antigua | Superada por | Artefacto vivo |
|---|---|---|
| RTP-070 — SchemaRuntimeManifest incremental | RTP-475 | `runtime/schemaManifest.ts` |
| RTP-080 — SchemaValueCodec por familia | RTP-480 | `schemas/values/schemaValueCodec.ts` |
| RTP-095 — Harness pairwise entre schemas | RTP-515 | `helpers/allSchemaStressHarness.ts` |
| RTP-305 — Quality gate registry-driven | RTP-515 | `contracts/schemas/allSchemaStressMatrix.test.ts` |
| RTP-310 — All-schema Playwright + release gates | RTP-540 | evidencia de navegador de RTP-540 |
| RTP-405 — Cerrar append, multi-document y bundle | RTP-505 | `runtime/pdfComposition.ts` |
| RTP-415 — Cerrar browser, performance, privacy y parity | RTP-540 | evidencia de RTP-540 |

## Lo que NO se archiva

`RTP-340` y `RTP-420` describen el mismo closeout que **RTP-545**, que sigue en
`PARTIAL`. No cumplen el criterio 2: no se puede declarar cerrada una card
apoyándose en otra que no lo está. Se quedan como están y se cerrarán con 545.

El resto de la primera generación queda en `BACKLOG` sin tocar: puede ser
trabajo real pendiente, y afirmar lo contrario sin artefacto sería inventar
estado.

## Consecuencia operativa

`.ai/brain/80-work/ACTIVE.md` ya declara que sólo la ventana actual se enruta.
Este ADR explica **por qué** existe esa ventana, para que la próxima sesión no
lea 50 cards en `BACKLOG` como 50 tareas pendientes.
