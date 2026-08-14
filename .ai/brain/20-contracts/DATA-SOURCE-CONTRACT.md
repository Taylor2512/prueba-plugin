# Data Source Contract

## Propósito

Una fuente de datos es una abstracción reusable que obtiene o busca datos para un
schema sin colocar HTTP dentro del plugin del schema.

PokeAPI, catálogos empresariales, países, clientes, empleados, productos y servicios
internos son consumidores equivalentes de este contrato.

## Formas soportadas

### Provider programático

Para APIs complejas:

```ts
export interface DataSourceProvider {
  query(request: DataSourceQuery): Promise<DataSourceResult>;
  resolveByValue?(request: ResolveDataSourceValue): Promise<DataSourceItem | null>;
}
```

### HTTP declarativo

Para APIs convencionales:

```ts
type HttpDataSourceDefinition = {
  key: string;
  request: {
    method: string;
    path: string;
    query?: Record<string, DataReference>;
    body?: unknown;
  };
  response: DataResponseMapping;
  search?: DataSourceSearchPolicy;
  paging?: DataSourcePagingPolicy;
};
```

El descriptor HTTP utiliza el `HttpClientAdapter` inyectado. Nunca crea un cliente Axios
propio por schema.

## Registry

`sourceKey` es la referencia estable:

```json
{
  "optionSource": {
    "kind": "resource",
    "sourceKey": "customerCatalog"
  }
}
```

El template no necesita conocer:

- token;
- Redux;
- base URL secreta;
- interceptor;
- refresh token;
- certificado;
- implementación HTTP.

## Query

Contexto mínimo:

```ts
type DataSourceQuery = {
  sourceKey: string;
  search?: string;
  offset?: number;
  cursor?: unknown;
  limit?: number;
  params?: Record<string, unknown>;
  userId?: string;
  documentId?: string;
  runtimeSessionId?: string;
  signal: AbortSignal;
};
```

Los campos de identidad sólo existen para aislamiento/capability; no deben transportar
reglas de negocio de un host.

## Result

```ts
type DataSourceResult = {
  items: DataSourceItem[];
  nextCursor?: unknown;
  total?: number;
  rawMeta?: Record<string, unknown>;
};
```

`rawMeta` no implica persistir la respuesta completa.

## Búsqueda y paginación

Soportar:

- none;
- client search;
- remote search;
- offset;
- cursor.

`visibleRows` es presentación y no equivale a `pageSize`.

## Concurrencia

Obligatorio:

- debounce configurable;
- AbortController;
- request sequence;
- ignorar respuestas stale;
- single-flight para queries idénticas;
- cache policy;
- TTL opcional;
- cleanup.

## Cache key

Debe considerar según corresponda:

```text
sourceKey
× query
× page/cursor
× params
× dependency values
× User
× document
× runtime session
```

No mezclar datos privados de dos Users.

## Dependencies

Una source puede depender de valores de otros schemas:

```text
countryId
→ city source params
→ city options
```

Al cambiar una dependencia:

1. abortar request anterior;
2. recalcular params;
3. preservar o invalidar selección según política declarada;
4. no marcar touched sólo por recargar opciones.

## Error model

Estados mínimos:

```text
idle
loading
success
empty
error
cancelled
stale
```

El usuario puede reintentar cuando la política lo permita.

## Fixture público

PokeAPI puede usarse exclusivamente bajo `examples/tests` para demostrar:

- objeto;
- array;
- paginación;
- mapping;
- búsqueda simulada/adaptada.

Nunca introducir `pokemon` en el core.
