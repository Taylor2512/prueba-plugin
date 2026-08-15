# PDF composition safety contract

Modos públicos sólo existen si tienen implementación real.

Requisitos:
- explicit ordering;
- latest semantics explícitas;
- SHA-256/provenance cuando se declare integridad;
- limits de artifacts/pages/bytes;
- `AbortSignal`;
- malformed source errors;
- deterministic manifest;
- no persistence dentro del composer;
- conflict no produce final PDF hasta resolución.
