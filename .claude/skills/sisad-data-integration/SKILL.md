# SISAD Data Integration

Use esta skill para cambios relacionados con:

- HttpClientAdapter;
- DataSourceProvider;
- remote options;
- JSON Pointer/JSONPath;
- Authorization/header injection;
- Axios/fetch adapters;
- integration lifecycle;
- signature execution providers;
- FontRegistry relacionado con integraciones.

## Reglas

1. core transport-neutral;
2. PokeAPI sólo example/fixture;
3. no secretos en templates/snapshots;
4. no fetch/axios dentro de cada schema;
5. runtime resources no serializables;
6. source/evidence antes de task status;
7. si una task previa de runtime está abierta, refinarla antes de crear nueva campaña;
8. tests de race/cancel/cache/User-document-session;
9. no cerrar PDF con dependencia remota no materializada.
