# Data Integration Runtime

## Flujo canónico

```text
Schema binding
→ sourceKey
→ DataSourceRegistry
→ IntegrationRuntime
→ HttpClientAdapter/provider
→ response
→ DataPointer
→ canonical value/options
→ Form transaction
→ snapshot
→ Viewer/Generator
```

## Punto de inyección

Reconciliar con `SisadPdfmeInstanceResources`. El target es que un host pueda proporcionar
clientes y providers sin modificar internals:

```ts
<SisadPdfmeInstance
  definition={definition}
  resources={{
    integrations: {
      httpClient,
      dataSources,
      signatureExecution,
      fonts
    }
  }}
/>
```

Si live source ya tiene una clave `adapters` adecuada, extenderla en lugar de duplicarla.

## Axios host inheritance

Una instancia Axios inyectada conserva la configuración que el proyecto host ya aplicó,
incluidos baseURL/defaults/interceptors. SISAD-PDFME no debe importar el store del host.

```text
Host auth/store
→ Axios interceptor
→ injected Axios adapter
→ IntegrationRuntime
→ DataSource/SignatureProvider
```

## Header resolver

Alternativa portable:

```text
Host session/auth
→ resolveHeaders(context)
→ HttpClientAdapter
```

Authorization sólo se reenvía a orígenes permitidos.

## Remote options

Un selector remoto:

```text
focus/open
→ query
→ loading
→ five visible rows
→ scroll
→ next page/virtualization
→ user selection
→ canonical commit
```

Cinco filas visibles no limitan pageSize a cinco.

## Determinismo

Una vez seleccionado/confirmado el dato:

```text
canonical value + display value
→ snapshot
→ PDF
```

No depender de que la API siga disponible durante generación.

## Multi-user

Cache, drafts y requests se aíslan por el scope necesario.

Un request de User A nunca actualiza un field de User B después de un switch rápido.
