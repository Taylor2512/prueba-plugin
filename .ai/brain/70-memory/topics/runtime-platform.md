# Memory topic — Runtime Platform

Durable decisions: local-first Form; manifest incremental; canonical codecs; PDF resource
lifecycle explicit; public host boundaries; registry-driven tests; identity SISAD-PDFME.

<!-- runtime-execution:memory:start -->
## Execution orchestration

- execution state se aísla por RuntimeSession × User × Document;
- execution shapes no son Form modes;
- completion es proyección;
- parallel shared values requieren conflict policy;
- canonical merge + generator es preferido para un documento lógico;
- massive produce resultado por execution y bundle sólo explícito.
<!-- runtime-execution:memory:end -->

<!-- autonomous-runtime:memory:start -->
## Production hardening

- configuration compiles to immutable resolved state;
- capabilities fail closed;
- grid/snap share page-space geometry;
- plugin registry owns schema runtime metadata;
- shared writes use optimistic concurrency;
- conflicts block canonical publication;
- legacy cleanup is evidence-driven;
- autonomous coordinator continues until final queue closeout.
<!-- autonomous-runtime:memory:end -->
