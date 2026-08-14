# Plan — SISAD-PDFME Portable Integration Runtime

## No es una campaña nueva

Este plan refina la queue existente `SISAD-PDFME-RUNTIME-PLATFORM`.

Antes de implementar integración remota, reconciliar el estado real. El contexto exportado
puede estar atrasado.

## Señal de reanudación

Si live evidence confirma RTP-425..RTP-465 y no existe evidence de RTP-470, iniciar RTP-470.
Si el repositorio contradice esa premisa, seguir source/evidence.

## Crosswalk de trabajo

### RTP-470 — Runtime capability convergence

Añadir a la convergencia:

- integración remota sólo si capability está executable;
- runtime resources para HttpClient/DataSource/Signature execution;
- Form/Viewer/Generator/Snapshot no leen config HTTP ad hoc;
- client/provider resources son runtime-only.

### RTP-475 — Plugin-owned schema manifest

Agregar metadata de binding:

```text
dataBinding:
  none | scalar | collection | artifact
```

No listas hardcodeadas por schema.

### RTP-480 — Codecs/validation/completion

Agregar:

- DataPointer semantics;
- OptionValue typed primitives;
- selectedMissingPolicy;
- remote prefill vs user interaction;
- 0/false/[]/null/"";
- displayValue deterministic snapshot.

### RTP-485/RTP-490 — Concurrency/completion

Incluir:

- stale request rejection;
- request cancellation;
- remote loading no implica touched/complete;
- cache/scope isolation.

### RTP-510 — Multi-user Form

Probar:

- User A y B usando la misma source;
- switch rápido;
- requests A no escriben sobre B;
- cache sensible aislado;
- signature artifacts aislados.

### RTP-515 — All-schema stress

Extender harness registry-driven con:

- static options;
- remote options;
- objects;
- arrays;
- pagination;
- large list;
- dependent fields;
- background refresh;
- API error/retry.

### RTP-520 — Comparator

Sólo usar DocuSign como referencia de UX/semántica reusable. No transportar network/business
rules a SISAD-PDFME.

### RTP-530/RTP-535 — Legacy/dedup

Después de cerrar tests, retirar:

- fetch/axios directo por schema;
- mappings duplicados;
- option fallback incorrecto;
- registries de fuentes duplicados;
- adapters obsoletos.

### RTP-540 — Performance/a11y/privacy

Agregar gates:

- virtualización de listas grandes;
- debounce;
- AbortController;
- response race;
- memory cleanup;
- combobox keyboard/a11y;
- no secretos en snapshot/log;
- Authorization origin policy.

### RTP-545 — Release

No cerrar mientras falte:

- transport-neutral public API;
- Axios adapter test;
- fetch adapter test;
- DataSource contract;
- pointer/binding tests;
- remote select tests;
- deterministic PDF offline test;
- signature provider mock;
- FontRegistry parity;
- docs/gates.

## Orden técnico dentro de las tasks

```text
characterize existing resources/options
→ HttpClientAdapter
→ DataPointer
→ DataSourceRegistry
→ static compatibility
→ remote option runtime
→ other schema bindings
→ snapshot/viewer/PDF
→ signature execution adapter
→ FontRegistry
→ multi-user/performance/security
```

## No hard Axios dependency

El `package.json` del core no necesita `axios` para implementar el contrato.

Si se decide entregar `createAxiosHttpClientAdapter`, resolver una de estas opciones:

1. adapter estructural sin importar tipos Axios;
2. integración opcional/peer en capa separada;
3. adapter proporcionado por host.

No añadir Axios como dependencia productiva del core sólo para soportar una integración posible.

## Definition of done

La integración es portable cuando un test puede sustituir Axios por fetch/fake transport sin
cambiar schema/template ni lógica Form.
