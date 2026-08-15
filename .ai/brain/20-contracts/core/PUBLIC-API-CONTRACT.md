# Public API contract

Hosts consumen `SisadPdfmeInstance`, wrappers públicos, config/controller/bundle/adapters. No deep-importan Canvas, Moveable, Selecto, DetailView ni registries internos. Nuevas capabilities deben aparecer primero en API pública/config/controller.

<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/20-contracts/core/PUBLIC-API-CONTRACT.md:START -->
## Integration runtime resources

La API pública debe poder recibir runtime-only resources para integraciones externas sin exigir
deep imports.

Conceptualmente:

```ts
resources.integrations.httpClient
resources.integrations.dataSources
resources.integrations.signatureExecution
resources.integrations.fonts
```

La forma exacta debe reutilizar la autoridad `SisadPdfmeInstanceResources/adapters` existente.

Clientes, interceptors, funciones y secretos no forman parte del bundle/snapshot portable.
<!-- SISAD-PDFME-PORTABLE-INTEGRATION:.ai/brain/20-contracts/core/PUBLIC-API-CONTRACT.md:END -->
