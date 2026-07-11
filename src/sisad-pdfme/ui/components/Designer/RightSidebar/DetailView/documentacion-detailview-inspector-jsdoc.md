# Documentación aplicada — DetailView / Inspector

## Resumen

Se documentó el bloque responsable del inspector/right sidebar del diseñador SISAD PDFME:

- widgets básicos del inspector;
- tarjetas y secciones del DetailView;
- taxonomía de secciones;
- contratos de inspector por familia de schema;
- builders de schemas de form-render;
- registro de widgets;
- colaboración/asignación/bloqueo;
- conexiones/persistencia/API/form;
- guards para evitar interferencias con Selecto, Moveable y canvas.

## Criterio de documentación

La documentación se agregó con JSDoc en puntos de extensión y mantenimiento:

- tipos públicos o semipúblicos;
- componentes React exportados;
- helpers puros;
- builders declarativos;
- registros o contratos compartidos;
- funciones de validación.

## Restricciones respetadas

- No se cambió la lógica funcional.
- No se modificaron contratos de imports/exports.
- No se agregaron `!important`, z-index nuevos ni hacks visuales.
- No se tocó Canvas/Moveable/Selecto desde estos archivos.
- No se acopló la lógica del inspector a reglas del host.

## Recomendaciones técnicas

1. Mantener `detailSectionTaxonomy.ts` como fuente de verdad para visibilidad y orden de secciones.
2. Mantener `inspectorContracts.ts` como punto de extensión para tipos nuevos de schema.
3. Evitar condiciones por tipo dentro de `DetailView.tsx`; preferir contratos, presets o taxonomía.
4. En pruebas, cubrir cada sección canónica y cada widget registrado por `detailWidgetRegistry.tsx`.
5. En colaboración, validar casos de owner único, multi-owner, shared, locked by me y locked by other.
