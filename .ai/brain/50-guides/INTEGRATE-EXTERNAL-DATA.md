# Integrar datos externos

## Caso A — el host ya usa Axios

1. reutiliza la instancia Axios existente;
2. conserva allí baseURL, interceptors, refresh y Authorization;
3. envuélvela con el adapter SISAD-PDFME;
4. registra DataSources por `sourceKey`;
5. el schema sólo referencia `sourceKey` y mappings.

Ejemplo conceptual:

```ts
const pdfmeHttp = createAxiosHttpClientAdapter(api);

const resources = {
  integrations: {
    httpClient: pdfmeHttp,
    dataSources: {
      customers: createHttpDataSource({
        request: { method: 'GET', path: '/customers' },
        response: {
          collection: { syntax: 'json-pointer', path: '/items' },
          item: {
            label: { syntax: 'json-pointer', path: '/name' },
            value: { syntax: 'json-pointer', path: '/id' }
          }
        }
      })
    }
  }
};
```

## Caso B — el host usa fetch

Inyecta un adapter fetch con base URL y `resolveHeaders`.

## Caso C — API no convencional

Implementa `DataSourceProvider.query()` directamente. El schema no cambia.

## Arrays/objetos

Usa JSON Pointer para ubicación precisa y JSONPath cuando se necesiten múltiples matches.

## Seguridad

Nunca copiar al template:

- token;
- API key;
- refresh token;
- cookies;
- private key.

## Testing

Mockear provider/transport. No depender de internet para cerrar gates.
