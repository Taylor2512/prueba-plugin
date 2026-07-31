# Ruta — instancias declarativas

## Uso

Para simplificar integraciones, mover lógica genérica desde `src/examples`,
crear la fachada `SisadPdfmeInstance` o modificar definition/resources/handlers.

## Lectura

1. `.ai/START.md`
2. `.ai/architecture/DECLARATIVE-INSTANCE-ARCHITECTURE.md`
3. `.ai/plans/PLAN_MAESTRO_INSTANCIAS_DECLARATIVAS_SISAD_PDFME_2026-07-31.md`
4. `.ai/governance/ANTI-HALLUCINATION.md`
5. `.ai/governance/ANTI-LOOP.md`
6. `.ai/governance/ANTI-OVERFLOW.md`
7. `.ai/architecture/PUBLIC-API-COMPATIBILITY.md`
8. Task-card `DECL-*`

## Skills

- `sisad-declarative-instance`
- `sisad-configuration-service`
- `sisad-public-api-compatibility`
- `sisad-collaboration-assignments`
- `sisad-multi-document-routing`
- `sisad-snapshot-compatibility`
- `sisad-testing-pyramid`

## Frontera

```txt
definition → JSON-safe
resources  → no serializable
handlers   → callbacks
```

Examples no implementan runtime orchestration.
