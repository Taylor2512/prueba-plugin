# Documentación técnica — UI Runtime SISAD PDFME
Este documento acompaña los archivos comentados del runtime UI. Resume responsabilidades, API pública, límites y riesgos por archivo.

## Designer.tsx — Fachada pública del editor PDF
### Responsabilidades
- Normaliza el template con `ensureDesignerTemplate`.
- Expone callbacks `onSaveTemplate`, `onChangeTemplate`, `onPageChange`.
- Delega comandos a `DesignerRuntimeApi`: undo/redo, zoom, fit, páginas, sidebar, focus/highlight, addSchema y schema config.

### Riesgos / notas
- Debe compilarse como `.tsx` porque renderiza JSX.
- No introducir lógica de negocio o integraciones SISAD.
- Evitar mutación ambigua al setear `pdfmeVersion`; preferible construir `nextTemplate`.

## Form.tsx — Runtime interactivo de llenado
### Responsabilidades
- Hereda de `PreviewUI`.
- Renderiza `Preview` con inputs editables.
- Emite cambios por input, por lote y JSON de formulario.

### Riesgos / notas
- `onChangeInput` puede emitirse desde `setInputs` y desde Preview; cuidar duplicidad.
- No acoplar validaciones específicas de host.

## Viewer.tsx — Runtime de visualización
### Responsabilidades
- Hereda de `PreviewUI`.
- Renderiza `Preview` sin callbacks de edición.
- Mantiene cursor y total de páginas.

### Riesgos / notas
- Debe permanecer read-only.
- No agregar side effects sobre inputs.

## class.ts — Infraestructura base de lifecycle UI
### Responsabilidades
- Administra DOM container, React root, resize observer, template, options, font, lang y plugins.
- `BaseUIClass` soporta Designer/Form/Viewer.
- `PreviewUI` agrega manejo de inputs para Form/Viewer.

### Riesgos / notas
- Cambios en medición de tamaño afectan zoom y canvas.
- Destroy debe ser idempotente y defensivo.
- No crear múltiples roots React por contenedor.

## collaboration.ts — Motor de sincronización colaborativa
### Responsabilidades
- Define `CollaborationEvent`.
- Aplica eventos a schemas.
- Calcula diffs de eventos.
- Soporta locks, comments, presence/history y adaptadores Yjs/legacy.

### Riesgos / notas
- Cuidar eventos obsoletos por timestamp.
- No perder comments/commentAnchors al actualizar schema base.
- No mezclar colaboración con UI visual o negocio de host.

## collaborationContext.ts — Contexto efectivo de colaboración
### Responsabilidades
- Normaliza recipients.
- Resuelve recipient activo, roles, permisos y owner color.
- Resuelve estado colaborativo de un schema.

### Riesgos / notas
- Roles viewer/reviewer/commenter no deben editar estructura por defecto.
- No sobrescribir ownerColor de schemas existentes sin intención.

## constants.ts — Constantes UI
### Responsabilidades
- Define idioma default, mensajes, classnames, sidebars, page gap y zoom.

### Riesgos / notas
- Cambios en dimensiones impactan layout y pruebas visuales.
- No agregar constantes de negocio.

## contexts.ts — Contextos React
### Responsabilidades
- I18nContext, FontContext, PluginsRegistry, OptionsContext y CacheContext.

### Riesgos / notas
- Mantener pluginRegistry vacío por defecto para evitar bundle innecesario.

## designerEngine.ts — Configuración extensible del diseñador
### Responsabilidades
- Define tipos de schema config, colaboración, HTTP, prefill, persistence, requests, form JSON y firma.
- Aplica defaults colaborativos.
- Resuelve y fusiona config avanzada.
- Expone builder del engine.

### Riesgos / notas
- Archivo de contrato público/semipúblico: cambios pueden romper integraciones.
- Evitar `any` nuevo y switches repetidos por schema.type.
- Mantener serializabilidad en metadata de schemas.

## helper.ts — Utilidades runtime
### Responsabilidades
- Atajos de teclado.
- Conversión template <-> schemas UI.
- Base64/data URLs.
- Nombres únicos y helpers de layout.

### Riesgos / notas
- `template2SchemasList` es crítico para multipágina.
- Atajos no deben capturar inputs/textarea/select/contentEditable.
- Evitar mutaciones de template externo.

## hooks.ts — Hooks runtime y preprocesamiento
### Responsabilidades
- `useUIPreProcessor` genera backgrounds, pageSizes y escala.
- Usa cache LRU simple para PDFs procesados.
- Protege tareas async con requestId.

### Riesgos / notas
- Escala incorrecta rompe coordenadas visuales.
- Cache debe seguir acotado.
- Manejar errores de pdf2img/pdf2size sin perder último estado bueno.

## i18n.ts — Internacionalización
### Responsabilidades
- Diccionarios por idioma para UI y schemas.

### Riesgos / notas
- Toda key de Dict debe estar cubierta por cada idioma.
- No incluir términos de negocio del host.

## index.ts — Entrypoint público UI
### Responsabilidades
- Exporta Designer/Form/Viewer, aliases y estilos base.
- Reexporta designerEngine, colaboración y eventos.

### Riesgos / notas
- No agregar lógica.
- Cuidar import CSS: debe seguir siendo runtime genérico.

## theme.ts — Temas Ant Design
### Responsabilidades
- Define defaultTheme y sisadTheme.

### Riesgos / notas
- No confundir theme runtime con CSS específico de StepTwo/host.

## types.ts — Tipos públicos y bridges
### Responsabilidades
- Contratos de SidebarProps, DesignerRuntimeApi, documents/comments bridge y presentation modes.

### Riesgos / notas
- Es API pública: preferir extensiones opcionales a breaking changes.
- Mantener sincronizado con implementaciones reales del runtime API.

## Resumen de generación

| Archivo | Líneas origen | Líneas documentadas |
|---|---:|---:|
| Designer.tsx | 348 | 372 |
| Form.tsx | 130 | 151 |
| Viewer.tsx | 54 | 70 |
| class.ts | 299 | 324 |
| collaboration.ts | 1497 | 1519 |
| collaborationContext.ts | 256 | 274 |
| constants.ts | 21 | 33 |
| contexts.ts | 14 | 26 |
| designerEngine.ts | 1433 | 1454 |
| helper.ts | 601 | 622 |
| hooks.ts | 499 | 516 |
| i18n.ts | 903 | 915 |
| index.ts | 25 | 39 |
| theme.ts | 63 | 75 |
| types.ts | 147 | 161 |
