# Análisis ejecutivo Runtime Platform

El snapshot contiene 403 archivos de SISAD-PDFME y 85,990 líneas. La arquitectura ya es una plataforma propia: config, contracts, integration, runtime, React wrappers, recipients, documents, collaboration, generator, converter, snapshot y 90 archivos de schemas.

P0 confirmados por el snapshot:
1. `Form.render()` emite `onChangeInput` antes de asegurar mutación local para el path granular.
2. `Form.setInputs()` emite callbacks también cuando el origen puede ser host, favoreciendo ecos.
3. `schemaValueAdapter` cubre solo semántica básica.
4. `SisadPdfmePreviewRuntime` declara `activeDocumentId` y `signatureProviders`, pero en el snapshot no los consume.
5. `pdf2img` no muestra cleanup del PDF/document/page tras lotes; `pdf2size` abre todas las páginas con `Promise.all`.
6. existen dos `playwright.config` con contratos incompatibles.
7. la identidad de producto y algunos nombres internos siguen mezclando `Pdfme*` legado con `SisadPdfme*`.

No hacer big-bang. Primero source truth + characterization, luego protocolo local-first, después manifest/codec, luego familias y finalmente PDF lifecycle/performance/release.
