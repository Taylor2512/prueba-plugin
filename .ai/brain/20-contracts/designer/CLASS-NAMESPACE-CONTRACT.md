# Contrato de clases y selectores

Constantes:

```ts
DESIGNER_CLASSNAME = 'sisad-pdfme-designer-'
UI_CLASSNAME = 'sisad-pdfme-ui-'
```

Son prefijos técnicos, no configuración de negocio.

## Reglas

- Construir clases mediante helpers `designerClass(suffix)` y `uiClass(suffix)`.
- No concatenar los prefijos en múltiples componentes sin inventario.
- CSS del host no apunta a internals del componente.
- Tests y adapters usan `data-testid`, `data-role`, `data-schema-id`,
  `data-option-id` y `data-owner-id`.
- Clases internas pueden cambiar detrás de una migración visual.
- Un cambio de prefijo exige visual tests y selector inventory.
