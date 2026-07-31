# UI Runtime comentado — SISAD PDFME

Este paquete contiene los archivos del runtime UI documentados con comentarios de arquitectura y mantenimiento.

## Archivos incluidos

| Archivo | Origen subido | Responsabilidad principal |
|---|---|---|
| Designer.tsx | Designer.tsx | Fachada pública del diseñador, callbacks, zoom, páginas, sidebar, schemas y render React. |
| Form.tsx | Form.tsx | Runtime interactivo de llenado basado en Preview. |
| Viewer.tsx | Viewer.tsx | Runtime de solo lectura basado en Preview. |
| class.ts | class.ts | BaseUIClass y PreviewUI: lifecycle, root React, ResizeObserver, opciones, plugins e inputs. |
| collaboration.ts | collaboration(1).ts | Eventos colaborativos, locks, comentarios, presencia, historial, Yjs/ sync. |
| collaborationContext.ts | collaborationContext.ts | Recipient activo, permisos, owner/color y estado colaborativo efectivo. |
| constants.ts | constants(1).ts | Constantes visuales y de runtime. |
| contexts.ts | contexts.ts | Contextos React de i18n, font, plugins, options y cache. |
| designerEngine.ts | designerEngine.ts | Contratos/configuración del engine, schema config, colaboración, firma, HTTP y builder. |
| helper.ts | helper(1).ts | Atajos, conversiones, template/schema helpers, nombres únicos y utilidades UI. |
| hooks.ts | hooks.ts | Preprocesamiento de PDFs, backgrounds, pageSizes, escalas y hooks compartidos. |
| i18n.ts | i18n.ts | Diccionarios de internacionalización. |
| index.ts | index(2).ts | Entrypoint público del paquete UI. |
| theme.ts | theme.ts | Temas Ant Design default y SISAD. |
| types.ts | types(1).ts | Tipos públicos de bridges, sidebars, documentos, comentarios y runtime API. |

## Criterio aplicado

- Se agregaron comentarios JSDoc y encabezados de responsabilidad por archivo.
- No se cambió lógica funcional.
- Se normalizaron los nombres de salida quitando sufijos `(1)` y `(2)` porque esos nombres parecen provenir de la carga de archivos, no del proyecto real.
- Se añadió documentación consolidada en `documentacion-ui-runtime-sisad-pdfme.md`.

## Recomendación

Antes de reemplazar archivos en tu proyecto, compara con `git diff` y revisa especialmente los archivos grandes:

```bash
git diff -- src/sisad-pdfme/ui
```

