# Runtime / Preview base — SISAD PDFME JSDoc

Este paquete contiene una copia completa de los archivos runtime/base UI enviados, con documentación JSDoc agregada o normalizada sin cambiar la lógica funcional.

## Archivos incluidos

- `AppContextProvider.tsx`
- `CtlBar.tsx`
- `ErrorScreen.tsx`
- `Paper.tsx`
- `Preview.tsx`
- `Renderer.tsx`
- `Root.tsx`
- `Spinner.tsx`
- `StaticSchema.tsx`
- `UnitPager.tsx`
- `usePreviewRuntime.ts`

## Criterio aplicado

- Se documentaron responsabilidades, contratos y límites arquitectónicos.
- Se preservaron imports, exports, callbacks y flujo funcional.
- No se introdujeron dependencias nuevas.
- No se modificaron reglas de render, selección, zoom, persistencia, prefill ni colaboración runtime.

## Observaciones

Este bloque es sensible porque conecta el runtime visual con plugins imperativos (`Renderer`), preprocesamiento de PDF (`Paper`/`Preview`) y sincronización de datos (`usePreviewRuntime`). La documentación refuerza que la geometría del canvas debe seguir controlada por schemas y servicios internos, no por estilos arbitrarios de plugins o hosts.
