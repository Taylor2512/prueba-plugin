# Integration Runtime Contract

## Propósito

Unificar lifecycle técnico compartido por integraciones sin convertir todas las
integraciones en un único `executeAnyApi`.

## Capas

```text
IntegrationRuntime
├── HttpClientAdapter
├── DataSourceProvider
├── ActionProvider
├── SignatureProvider
└── FontProvider
```

Cada provider conserva su semántica.

## Lifecycle compartido

```text
idle
pending
success
error
cancelled
```

Servicios comunes:

- AbortSignal;
- timeout;
- correlationId;
- logging seguro;
- metrics;
- retry policy;
- cleanup;
- cache sólo donde sea correcto.

## DataSource vs Action vs Signature

`DataSourceProvider`:
- lectura/búsqueda/paginación;
- normalmente idempotente.

`ActionProvider`:
- side effect;
- requiere política explícita de retry/idempotency.

`SignatureProvider`:
- ceremonia especializada;
- puede usar polling, webhook, OTP, biometría, certificados y artifacts.

Una firma externa no debe modelarse como un select remoto ni como un `fetch` dentro
de `signature/index.ts`.

## Portabilidad

Los providers runtime son recursos inyectados, no contenido durable del template.

El componente debe poder copiarse a otro proyecto y registrar allí:

- su Axios instance;
- su fetch wrapper;
- su auth resolver;
- sus DataSources;
- sus SignatureProviders;
- sus fonts.

## Fallo de integración

Una integración caída no debe:

- corromper otros schemas;
- revertir drafts hermanos;
- contaminar otro User/document/session;
- producir un PDF inconsistente;
- convertir automáticamente `pending` en complete.

## Observabilidad

No loggear secretos.

Los eventos pueden incluir:

```text
providerKey
operation
correlationId
duration
status
errorCode seguro
```

No incluir tokens/cookies/certificados privados.
